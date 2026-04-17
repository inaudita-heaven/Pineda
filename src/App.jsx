/**
 * App.jsx — Orquestador principal de Ruta Expo Pineda
 * src/App.jsx
 *
 * Flujo de pantallas:
 *   creditos → bienvenida → lista_paradas ↔ escaner ↔ parada_sellada ↔ intermedia
 *                                        ↕
 *                                    modal_cupon (cuando eligible)
 *
 * Rutas especiales:
 *   ?stop=N&token=XXX  → QR físico — se guarda en qrPendiente, NO salta pantallas
 *   /caja              → CajaPanelComponent (PIN protegido)
 *
 * Bugs corregidos en esta versión:
 *   [1] abrirMaps usa window.open (nueva pestaña) — nunca window.location.href
 *   [2] QR en URL se guarda en qrPendiente, no salta PantallaCreditos/Bienvenida
 *   [3] scanLock se libera con setTimeout(SCAN_LOCK_MS) — anti-doble-escaneo
 *   [4] PantallaCreditos.onClose → siempre va a bienvenida
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// ── Componentes de pantalla ────────────────────────────────────────────────────
import PantallaBienvenida    from './components/PantallaBienvenida';
import PantallaIntermedia    from './components/PantallaIntermedia';
import CouponUnlockedModal   from './components/CouponUnlockedModal';
import ProgresoCupon         from './components/ProgresoCupon';
import LanguageSelector      from './components/LanguageSelector';
import CajaPanelComponent    from './components/CajaPanelComponent';
import AdminPanel            from './components/AdminPanel';
import PantallaCatalogo      from './components/PantallaCatalogo';
import NavBar               from './components/NavBar';
import PestañaRuta          from './components/PestañaRuta';
import PestañaCatalogo      from './components/PestañaCatalogo';
import PestañaCupon         from './components/PestañaCupon';

// ── Lógica de dominio ──────────────────────────────────────────────────────────
import { stops, getStopByToken, isStopOpen, getNextOpenTime } from './data/stops';
import {
  getSessionId, getVisitedStops, addVisitedStop,
  isStopVisited,
  saveCoupon, getSavedCoupon, hasCoupon,
} from './lib/session';
import { checkCouponEligibility } from './lib/coupon';
import { supabase } from './lib/supabaseClient';

// ── Constante anti-doble-escaneo ───────────────────────────────────────────────
const SCAN_LOCK_MS = 3000;

// ── Cola de sincronización offline ─────────────────────────────────────────────
const SYNC_QUEUE_KEY = 'pineda_sync_queue';

function getSyncQueue() {
  try {
    return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
  } catch { return []; }
}

function addToSyncQueue(item) {
  const q = getSyncQueue();
  if (!q.find(i => i.stopId === item.stopId && i.sessionId === item.sessionId)) {
    q.push({ ...item, timestamp: Date.now() });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(q));
  }
}

function removeFromSyncQueue(stopId, sessionId) {
  const q = getSyncQueue().filter(
    i => !(i.stopId === stopId && i.sessionId === sessionId)
  );
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(q));
}

async function syncQueueToSupabase(sessionId) {
  const q = getSyncQueue();
  if (q.length === 0) return;
  for (const item of q) {
    try {
      const { error } = await supabase.rpc('registrar_escaneo', {
        p_session_id:      item.sessionId,
        p_stop_id:         item.stopId,
        p_token:           item.token,
        p_idempotency_key: item.idempotencyKey,
      });
      if (!error) removeFromSyncQueue(item.stopId, item.sessionId);
    } catch { /* sin conexión, reintenta después */ }
  }
}

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const { t } = useTranslation();

  // ── /admin — panel de administración ─────────────────────────────────────
  if (window.location.pathname.includes('/admin')) {
    return <AdminPanel />;
  }

  // ── /caja — ruta especial del personal ────────────────────────────────────
  if (window.location.pathname.includes('/caja')) {
    return <CajaPanelComponent />;
  }

  // ── Leer parámetros QR de la URL ───────────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const qrStopId  = parseInt(urlParams.get('stop') || '0', 10);
  const qrToken   = urlParams.get('token') || '';

  // ── Sesión ─────────────────────────────────────────────────────────────────
  const [sessionId]    = useState(() => getSessionId());
  const [visitedStops, setVisitedStops] = useState(() => getVisitedStops());

  // ── QR pendiente de procesar ───────────────────────────────────────────────
  // FIX [2]: El QR en URL NUNCA salta las pantallas de intro.
  // Se guarda aquí y se procesa cuando el usuario pulsa [COMENZAR].
  const [qrPendiente, setQrPendiente] = useState(() =>
    qrStopId && qrToken ? { stopId: qrStopId, token: qrToken } : null
  );

  // ── Pantalla activa ────────────────────────────────────────────────────────
  const [pantalla, setPantalla] = useState('bienvenida');

  // ── Estado del escáner ─────────────────────────────────────────────────────
  const [scanLock, setScanLock]           = useState(false);
  const [scanError, setScanError]         = useState(null);
  const [paradaActiva, setParadaActiva]   = useState(null);
  const [scannerStopId, setScannerStopId] = useState(null);

  // ── Estado de navegación entre paradas ────────────────────────────────────
  const [intermediaData, setIntermediaData] = useState(null); // { fromStop, toStop, mapsUrl }

  // ── Cupón ──────────────────────────────────────────────────────────────────
  const [mostrarModalCupon, setMostrarModalCupon] = useState(false);
  const [couponYaMostrado, setCouponYaMostrado]   = useState(() => hasCoupon());
  const [mostrarCatalogo, setMostrarCatalogo]     = useState(false);
  const [tabActiva, setTabActiva]                 = useState('ruta');

  // ── Procesar QR pendiente cuando llegamos a 'escaner_pendiente' ────────────
  // FIX [2]: Solo se ejecuta desde onComenzar, no en el arranque.
  useEffect(() => {
    if (pantalla === 'escaner_pendiente' && qrPendiente) {
      procesarEscaneo(qrPendiente.stopId, qrPendiente.token);
    }
  }, [pantalla]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Comprobar elegibilidad de cupón tras cada sello ───────────────────────
  useEffect(() => {
    if (couponYaMostrado) return;
    const { eligible } = checkCouponEligibility(visitedStops);
    if (eligible) {
      if (!getSavedCoupon()) generateCode();
      setMostrarModalCupon(true);
      setCouponYaMostrado(true);
    }
  }, [visitedStops]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync offline al recuperar conexión ────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => syncQueueToSupabase(sessionId);
    window.addEventListener('online', handleOnline);
    if (navigator.onLine) syncQueueToSupabase(sessionId);
    return () => window.removeEventListener('online', handleOnline);
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ══════════════════════════════════════════════════════════════════════════
  // Lógica de escaneo QR
  // ══════════════════════════════════════════════════════════════════════════

  const procesarEscaneo = useCallback(async (stopId, token) => {
    if (scanLock) return;
    setScanLock(true);
    setScanError(null);

    // 1. Validación local inmediata
    const stop = stops.find(s => s.id === stopId);
    if (!stop) {
      setScanError(t('escaner.error_token'));
      setScanLock(false);
      return;
    }
    if (visitedStops.includes(stopId)) {
      setScanError(t('escaner.error_ya_sellada'));
      setScanLock(false);
      return;
    }
    if (stop.token && token !== stop.token) {
      setScanError(t('escaner.error_token'));
      setScanLock(false);
      return;
    }

    // 2. UI Optimista: sellar inmediatamente sin esperar red
    const newVisited = addVisitedStop(stopId);
    setVisitedStops(newVisited);
    setParadaActiva(stop);
    setMostrarCatalogo(false);
    window.history.replaceState({}, '', window.location.pathname);
    setQrPendiente(null);
    setPantalla('parada_sellada');

    // 3. Generar idempotency key
    const idempotencyKey = `${sessionId}-${stopId}-${Math.floor(Date.now() / 60000)}`;
    const syncItem = { sessionId, stopId, token, idempotencyKey };

    // 4. Intentar sync con Supabase en background
    if (navigator.onLine) {
      try {
        const { data: rpcData, error } = await supabase.rpc('registrar_escaneo', {
          p_session_id:      sessionId,
          p_stop_id:         stopId,
          p_token:           token,
          p_idempotency_key: idempotencyKey,
        });
        if (error) {
          // Error de red / auth → reintentable → encolar
          addToSyncQueue(syncItem);
        } else if (rpcData && rpcData.ok === false) {
          // Error de lógica (token inválido, parada no encontrada) → no reintentable → solo log
          console.warn('[scan] RPC rejected:', rpcData.error);
        }
      } catch {
        // Excepción de red → encolar para reintento
        addToSyncQueue(syncItem);
      }
    } else {
      addToSyncQueue(syncItem);
    }

    // 5. Verificar cupón
    const eligibility = checkCouponEligibility(newVisited);
    if (eligibility.eligible && !hasCoupon()) {
      generateCode();
      setCouponYaMostrado(true);
      setTimeout(() => setMostrarModalCupon(true), 800);
    }

    setTimeout(() => setScanLock(false), SCAN_LOCK_MS);
  }, [scanLock, sessionId, visitedStops, t]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helper: genera código si no existe ────────────────────────────────────
  function generateCode() {
    const clean = sessionId.replace(/-/g, '').substring(0, 6).toUpperCase();
    const code  = `PINEDA30-${clean}`;
    saveCoupon(code);
    // Persistir en Supabase en background
    supabase.from('cupones').insert({
      session_id: sessionId,
      codigo: code,
      creado_en: new Date().toISOString(),
      canjeado: false,
    }).then(({ error }) => {
      if (error) console.error('Error guardando cupón en Supabase:', error);
    });
    return code;
  }

  // ── Ir a siguiente parada ─────────────────────────────────────────────────
  const irASiguienteParada = useCallback((fromStopId) => {
    const siguiente = stops.find(s => s.id === fromStopId + 1);
    if (!siguiente) {
      setPantalla('app');
      return;
    }
    setIntermediaData({
      fromStop: fromStopId,
      toStop:   siguiente.id,
      mapsUrl:  siguiente.mapsUrl,
    });
    setPantalla('intermedia');
  }, []);

  // FIX [1]: NUNCA window.location.href — destruye la app React.
  // Abre Maps en nueva pestaña (o app nativa vía OS intent) y vuelve a lista.
  const abrirMaps = useCallback(() => {
    if (!intermediaData?.mapsUrl) return;
    window.open(intermediaData.mapsUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setPantalla('app'), 300);
  }, [intermediaData]);

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════

  return (
    <div style={styles.root}>

      {/* Selector de idioma flotante */}
      <LanguageSelector variant="floating" />

      {/* ── PantallaBienvenida ───────────────────────────────────────────── */}
      {pantalla === 'bienvenida' && (
        <PantallaBienvenida
          onComenzar={() => {
            // FIX [2]: si hay QR pendiente, procesar ahora (ya vimos la intro)
            if (qrPendiente) {
              setPantalla('escaner_pendiente');
            } else {
              setPantalla('app');
            }
          }}
        />
      )}

      {/* ── App principal con tabs ───────────────────────────────────────── */}
      {pantalla === 'app' && (
        <>
          {tabActiva === 'ruta' && (
            <PestañaRuta
              visitedStops={visitedStops}
              onEscanear={(stopId) => {
                setScannerStopId(stopId);
                setPantalla('escaner');
              }}
              onVerCupon={() => setTabActiva('cupon')}
              onVerCatalogoSala={(stop) => {
                setParadaActiva(stop);
                setMostrarCatalogo(true);
              }}
            />
          )}
          {tabActiva === 'catalogo' && (
            <PestañaCatalogo
              onVerSala={(stop) => {
                setParadaActiva(stop);
                setMostrarCatalogo(true);
              }}
            />
          )}
          {tabActiva === 'cupon' && (
            <PestañaCupon
              visitedStops={visitedStops}
              sessionId={sessionId}
            />
          )}
          <NavBar
            tabActiva={tabActiva}
            onTab={setTabActiva}
            visitedStops={visitedStops}
            couponDesbloqueado={couponYaMostrado}
          />
        </>
      )}

      {/* ── Escáner QR (manual) ──────────────────────────────────────────── */}
      {pantalla === 'escaner' && (
        <PantallaEscaner
          stopId={scannerStopId}
          error={scanError}
          locked={scanLock}
          onScan={procesarEscaneo}
          onCancelar={() => setPantalla('app')}
          t={t}
        />
      )}

      {/* ── Validando QR de URL (pantalla de espera) ─────────────────────── */}
      {/* FIX [2]: Pantalla placeholder mientras procesarEscaneo corre */}
      {pantalla === 'escaner_pendiente' && (
        <div style={styles.pendienteWrap}>
          <p style={styles.pendienteTexto}>Validando parada…</p>
        </div>
      )}

      {/* ── Parada sellada ───────────────────────────────────────────────── */}
      {pantalla === 'parada_sellada' && paradaActiva && !mostrarCatalogo && (
        <PantallaParadaSellada
          stop={paradaActiva}
          visitedStops={visitedStops}
          onSiguiente={() => irASiguienteParada(paradaActiva.id)}
          onVolverLista={() => setPantalla('app')}
          onVerCatalogo={() => setMostrarCatalogo(true)}
          t={t}
        />
      )}

      {mostrarCatalogo && paradaActiva && (
        <PantallaCatalogo
          stop={paradaActiva}
          onVolver={() => setMostrarCatalogo(false)}
        />
      )}

      {/* ── Pantalla intermedia / countdown Maps ─────────────────────────── */}
      {pantalla === 'intermedia' && intermediaData && (
        <PantallaIntermedia
          fromStop={intermediaData.fromStop}
          toStop={intermediaData.toStop}
          onAbrirMaps={abrirMaps}
          onVolver={() => setPantalla('app')}
        />
      )}

      {/* ── Modal cupón desbloqueado ──────────────────────────────────────── */}
      {mostrarModalCupon && (
        <CouponUnlockedModal
          sessionId={sessionId}
          onClose={() => setMostrarModalCupon(false)}
        />
      )}

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Sub-componentes inline
// ══════════════════════════════════════════════════════════════════════════════

// ── Escáner QR ────────────────────────────────────────────────────────────────
function PantallaEscaner({ stopId, error, locked, onScan, onCancelar, t }) {
  const scannerRef = React.useRef(null);

  React.useEffect(() => {
    let scanner = null;

    const iniciar = async () => {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        false
      );
      scanner.render(
        (decodedText) => {
          try {
            const url   = new URL(decodedText);
            const sId   = parseInt(url.searchParams.get('stop') || '0', 10);
            const token = url.searchParams.get('token') || '';
            if (sId && token) onScan(sId, token);
          } catch {
            // QR inválido — ignorar
          }
        },
        () => { /* errores continuos de lectura — ignorar */ }
      );
      scannerRef.current = scanner;
    };

    iniciar();
    return () => { scannerRef.current?.clear().catch(() => {}); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={styles.scannerOverlay}>
      <div style={styles.scannerModal}>
        <h2 style={styles.scannerTitulo}>{t('escaner.titulo')}</h2>
        <p style={styles.scannerInstruccion}>{t('escaner.instruccion')}</p>

        <div id="qr-reader" style={styles.qrReader} />

        {locked && !error && (
          <p style={styles.scannerMensaje}>{t('escaner.buscando')}</p>
        )}
        {error && (
          <p style={{ ...styles.scannerMensaje, color: '#c00' }}>{error}</p>
        )}

        <button onClick={onCancelar} style={styles.botonCancelar}>
          {t('escaner.cancelar')}
        </button>
      </div>
    </div>
  );
}

// ── Parada sellada ────────────────────────────────────────────────────────────
function PantallaParadaSellada({ stop, visitedStops, onSiguiente, onVolverLista, onVerCatalogo, t }) {
  const esSala = stop.required;

  return (
    <div style={styles.selladaOverlay}>
      <div style={styles.selladaModal}>

        <div style={styles.selladaHeader}>
          <div style={styles.selladaCheck}>✓</div>
          <h2 style={styles.selladaTitulo}>
            {t('parada_sellada.titulo', { nombre: t(`paradas_nombres.p${stop.id}`) })}
          </h2>
          {esSala && (
            <span style={styles.selladaBadgeSala}>
              {t('parada_sellada.subtitulo_sala')}
            </span>
          )}
        </div>

        {esSala && (
          <div style={styles.selladaSalaInfo}>
            <p style={styles.selladaSalaTexto}>
              {t(`salas.${stop.key}_gancho`)}
            </p>
          </div>
        )}

        <div style={styles.selladaDireccion}>
          <p style={styles.selladaDireccionTexto}>{stop.address}</p>
        </div>

        <div style={styles.selladaProgreso}>
          <ProgresoCupon visitedStopIds={visitedStops} onVerCupon={() => {}} />
        </div>

        <div style={styles.selladaBotones}>
          {stop.id < 13 && (
            <button onClick={onSiguiente} style={styles.botonPrimario}>
              {t('parada_sellada.siguiente')}
            </button>
          )}
          <button onClick={onVerCatalogo} style={styles.botonSecundario}>
            {t('catalogo.titulo')} →
          </button>
          <button onClick={onVolverLista} style={{ ...styles.botonSecundario, borderColor: '#e8e6e3', color: 'rgba(15,14,13,0.5)' }}>
            {t('parada_sellada.volver_ruta')}
          </button>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Estilos
// ══════════════════════════════════════════════════════════════════════════════
const SERIF = '"IM Fell English", "Cormorant Garamond", Georgia, serif';
const SANS  = 'system-ui, -apple-system, sans-serif';

const styles = {
  root: {
    fontFamily: SERIF,
    backgroundColor: '#fff',
    minHeight: '100vh',
    color: '#0F0E0D',
  },

  // ── Espera QR pendiente ───────────────────────────────────────────────────
  pendienteWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  pendienteTexto: {
    fontFamily: SERIF,
    fontSize: '1rem',
    color: '#999',
    fontStyle: 'italic',
  },

  // ── Lista ─────────────────────────────────────────────────────────────────
  lista: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '1rem',
    paddingBottom: '4rem',
  },
  listaHeader: {
    textAlign: 'center',
    padding: '3rem 1rem 2rem',
    borderBottom: '3px solid #000',
    marginBottom: '2rem',
  },
  listaTitulo: {
    fontSize: 'clamp(1.6rem, 6vw, 2.8rem)',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '1.5px',
    lineHeight: 1.1,
  },
  listaSubtitulo: {
    fontFamily: SANS,
    fontSize: '0.8rem',
    color: '#888',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: '0.75rem 0 0',
  },
  progresoPad: {
    marginBottom: '2rem',
  },
  tarjetasWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  listaPie: {
    marginTop: '2rem',
    textAlign: 'center',
    borderTop: '1px solid #e0e0e0',
    paddingTop: '1.5rem',
  },
  listaPieTexto: {
    fontFamily: SANS,
    fontSize: '0.8rem',
    color: '#aaa',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    margin: 0,
  },

  // ── Tarjeta de parada ─────────────────────────────────────────────────────
  tarjeta: {
    padding: '1.25rem',
    border: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    transition: 'opacity 0.2s',
  },
  tarjetaTop: {
    display: 'flex',
    gap: '0.875rem',
    alignItems: 'flex-start',
  },
  tarjetaNum: {
    fontFamily: SERIF,
    fontSize: '1.6rem',
    fontWeight: '400',
    color: '#aaa',
    lineHeight: 1,
    minWidth: '2rem',
    textAlign: 'center',
    paddingTop: '2px',
  },
  tarjetaInfo: {
    flex: 1,
  },
  tarjetaNombre: {
    fontFamily: SERIF,
    fontSize: '1.15rem',
    fontWeight: '400',
    margin: '0 0 0.2rem',
    lineHeight: 1.2,
  },
  tarjetaDireccion: {
    fontFamily: SANS,
    fontSize: '0.78rem',
    color: '#888',
    margin: 0,
    letterSpacing: '0.3px',
  },
  tarjetaBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  tarjetaAccion: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  // ── Badges ────────────────────────────────────────────────────────────────
  badgeSala: {
    fontFamily: SANS,
    fontSize: '0.68rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    backgroundColor: '#000',
    color: '#fff',
    padding: '2px 8px',
  },
  badgeAbierta: {
    fontFamily: SANS,
    fontSize: '0.68rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: '#2a7a2a',
  },
  badgeCerrada: {
    fontFamily: SANS,
    fontSize: '0.68rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: '#999',
  },
  badgeInfo: {
    fontFamily: SANS,
    fontSize: '0.68rem',
    color: '#bbb',
    fontStyle: 'italic',
  },
  sellada: {
    fontFamily: SANS,
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#000',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  // ── Botones ───────────────────────────────────────────────────────────────
  botonEscanear: {
    fontFamily: SANS,
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '0.6rem 1.25rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    minHeight: '48px',
  },
  botonMaps: {
    fontFamily: SANS,
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#000',
    letterSpacing: '0.5px',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  botonPrimario: {
    fontFamily: SANS,
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '1rem',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    minHeight: '52px',
  },
  botonSecundario: {
    fontFamily: SANS,
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '1rem',
    backgroundColor: '#fff',
    color: '#000',
    border: '2px solid #000',
    cursor: 'pointer',
    width: '100%',
    minHeight: '52px',
  },

  // ── Escáner ───────────────────────────────────────────────────────────────
  scannerOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9000,
    padding: '1rem',
  },
  scannerModal: {
    backgroundColor: '#fff',
    padding: '2rem',
    maxWidth: '400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  scannerTitulo: {
    fontFamily: SERIF,
    fontSize: '1.4rem',
    fontWeight: '400',
    margin: 0,
    textAlign: 'center',
  },
  scannerInstruccion: {
    fontFamily: SANS,
    fontSize: '0.85rem',
    color: '#666',
    textAlign: 'center',
    margin: 0,
  },
  qrReader: {
    width: '100%',
  },
  scannerMensaje: {
    fontFamily: SANS,
    fontSize: '0.85rem',
    color: '#555',
    margin: 0,
    textAlign: 'center',
  },
  botonCancelar: {
    fontFamily: SANS,
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '0.75rem 2rem',
    backgroundColor: '#fff',
    color: '#000',
    border: '2px solid #000',
    cursor: 'pointer',
    marginTop: '0.5rem',
    minHeight: '48px',
  },

  // ── Parada sellada ────────────────────────────────────────────────────────
  selladaOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    overflowY: 'auto',
    zIndex: 8000,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selladaModal: {
    maxWidth: '560px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    paddingTop: '3rem',
    paddingBottom: '3rem',
  },
  selladaHeader: {
    textAlign: 'center',
    borderBottom: '2px solid #000',
    paddingBottom: '2rem',
  },
  selladaCheck: {
    fontSize: '3rem',
    lineHeight: 1,
    marginBottom: '0.75rem',
    fontFamily: SERIF,
  },
  selladaTitulo: {
    fontFamily: SERIF,
    fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '1px',
  },
  selladaBadgeSala: {
    display: 'inline-block',
    marginTop: '0.75rem',
    fontFamily: SANS,
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    backgroundColor: '#000',
    color: '#fff',
    padding: '3px 10px',
  },
  selladaSalaInfo: {
    borderLeft: '3px solid #000',
    paddingLeft: '1rem',
  },
  selladaSalaTexto: {
    fontFamily: SERIF,
    fontSize: '1rem',
    fontStyle: 'italic',
    lineHeight: 1.7,
    margin: 0,
    color: '#333',
  },
  selladaDireccion: {
    paddingTop: '0.5rem',
  },
  selladaDireccionTexto: {
    fontFamily: SANS,
    fontSize: '0.82rem',
    color: '#999',
    margin: 0,
  },
  selladaProgreso: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: '1.5rem',
  },
  selladaBotones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
};
