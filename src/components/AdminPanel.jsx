/**
 * AdminPanel.jsx — Panel de administración de la Ruta Expo Pineda
 * Ruta: /admin
 * PIN: VITE_ADMIN_PIN (fallback: VITE_CAJA_PIN, luego '0000')
 *
 * Tabs:
 *   1. Escaneos  — funnel de conversión + bar chart por parada
 *   2. Leads     — interesados agrupados por obra, botón WhatsApp, CSV export
 *   3. Cupones   — lista con badges copa/compra
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
);

const PIN_CORRECTO = import.meta.env.VITE_ADMIN_PIN
  || import.meta.env.VITE_CAJA_PIN
  || '0000';

const PARADAS = {
  1:  'Palacio de Viana',
  2:  'Taberna Santa Marina',
  3:  'La Fuenseca',
  4:  'Casa 12PB',
  5:  'Taberna San Miguel',
  6:  'Taberna El Olmo',
  7:  'Casa Salinas',
  8:  'Posada del Caballo Andaluz',
  9:  'Puerta de Sevilla',
  10: 'Taberna La Viuda',
  12: 'La Cazuela de la Espartería',
  13: 'La Inaudita',
};

// ── PIN Screen ──────────────────────────────────────────────────────────────────
function PinScreen({ onSuccess }) {
  const [digits, setDigits] = useState('');
  const [shake, setShake] = useState(false);

  function press(d) {
    if (digits.length >= 4) return;
    const next = digits + d;
    setDigits(next);
    if (next.length === 4) {
      if (next === PIN_CORRECTO) {
        onSuccess();
      } else {
        setShake(true);
        setTimeout(() => { setDigits(''); setShake(false); }, 700);
      }
    }
  }

  return (
    <div style={s.pinWrap}>
      <div style={s.pinInner}>
        <h1 style={s.pinTitle}>Panel Admin</h1>
        <p style={s.pinSub}>Introduce el PIN de acceso</p>
        <div style={{ ...s.dots, ...(shake ? s.dotsShake : {}) }}>
          {[0, 1, 2, 3].map(i => (
            <span key={i} style={{ ...s.dot, ...(i < digits.length ? s.dotOn : {}) }} />
          ))}
        </div>
        <div style={s.pad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} style={s.key} onClick={() => press(String(n))}>{n}</button>
          ))}
          <span style={{ ...s.key, background: 'transparent', border: 'none' }} />
          <button style={s.key} onClick={() => press('0')}>0</button>
          <button style={s.key} onClick={() => setDigits(d => d.slice(0, -1))}>⌫</button>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Escaneos ───────────────────────────────────────────────────────────────
function TabEscaneos() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Conteo de visitantes únicos (sesiones)
      const { count: totalSesiones, error: e1 } = await supabaseAdmin
        .from('visitantes')
        .select('*', { count: 'exact', head: true });
      if (e1) console.error('visitantes error:', e1);

      // Conteo de escaneos por parada
      const { data: escaneos, error: e2 } = await supabaseAdmin
        .from('escaneos_paradas')
        .select('parada_id, visitor_id')
        .order('timestamp', { ascending: false });
      if (e2) console.error('escaneos error:', e2);
      else console.log('escaneos data:', escaneos?.length, escaneos?.[0]);

      // Conteo de cupones desbloqueados
      const { count: totalCupones, error: e3 } = await supabaseAdmin
        .from('cupones')
        .select('*', { count: 'exact', head: true });
      if (e3) console.error('cupones error:', e3);

      // Conteo de cupones canjeados
      const { count: cuponesCanjeados, error: e4 } = await supabaseAdmin
        .from('cupones')
        .select('*', { count: 'exact', head: true })
        .eq('canjeado', true);
      if (e4) console.error('cupones canjeados error:', e4);

      // Agrupación por parada
      const porParada = {};
      (escaneos || []).forEach(({ parada_id }) => {
        porParada[parada_id] = (porParada[parada_id] || 0) + 1;
      });

      setData({ totalSesiones, porParada, totalCupones, cuponesCanjeados });
      setLoading(false);
    })();
  }, []);

  if (loading) return <p style={s.loading}>Cargando...</p>;
  if (!data) return <p style={s.loading}>Error al cargar datos</p>;

  const maxEscaneos = Math.max(...Object.values(data.porParada), 1);

  return (
    <div style={s.tabContent}>
      {/* Funnel */}
      <h2 style={s.sectionTitle}>Embudo de conversión</h2>
      <div style={s.funnel}>
        {[
          { label: 'Sesiones iniciadas', value: data.totalSesiones || 0, color: '#0F0E0D' },
          { label: 'Cupones desbloqueados', value: data.totalCupones || 0, color: '#555' },
          { label: 'Cupones canjeados', value: data.cuponesCanjeados || 0, color: '#888' },
        ].map(({ label, value, color }) => (
          <div key={label} style={s.funnelRow}>
            <span style={s.funnelLabel}>{label}</span>
            <span style={{ ...s.funnelBadge, background: color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Bar chart por parada */}
      <h2 style={{ ...s.sectionTitle, marginTop: '2rem' }}>Escaneos por parada</h2>
      <div style={s.barChart}>
        {Object.entries(PARADAS).map(([id, nombre]) => {
          const count = data.porParada[Number(id)] || 0;
          const pct = Math.round((count / maxEscaneos) * 100);
          return (
            <div key={id} style={s.barRow}>
              <span style={s.barLabel}>{nombre}</span>
              <div style={s.barTrack}>
                <div style={{ ...s.barFill, width: `${pct}%` }} />
              </div>
              <span style={s.barCount}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab: Leads ──────────────────────────────────────────────────────────────────
function TabLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactados, setContactados] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_contactados') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabaseAdmin
        .from('interesados_obras')
        .select('*')
        .order('created_at', { ascending: false });
      setLeads(data || []);
      setLoading(false);
    })();
  }, []);

  function marcarContactado(id) {
    const next = { ...contactados, [id]: new Date().toISOString() };
    setContactados(next);
    localStorage.setItem('admin_contactados', JSON.stringify(next));
  }

  function exportCSV() {
    const rows = [
      ['id', 'obra_id', 'nombre', 'email', 'telefono', 'mensaje', 'created_at'],
      ...leads.map(l => [l.id, l.obra_id, l.nombre, l.email, l.telefono, l.mensaje, l.created_at]),
    ];
    const csv = rows.map(r => r.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_pineda_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Agrupación por obra
  const porObra = leads.reduce((acc, l) => {
    const key = l.obra_id || 'sin_obra';
    if (!acc[key]) acc[key] = [];
    acc[key].push(l);
    return acc;
  }, {});

  if (loading) return <p style={s.loading}>Cargando...</p>;

  return (
    <div style={s.tabContent}>
      <div style={s.leadsHeader}>
        <h2 style={s.sectionTitle}>Interesados en obras ({leads.length})</h2>
        <button style={s.csvBtn} onClick={exportCSV}>⬇ CSV</button>
      </div>

      {Object.keys(porObra).length === 0 && (
        <p style={s.empty}>Sin leads registrados todavía.</p>
      )}

      {Object.entries(porObra).map(([obraId, items]) => (
        <div key={obraId} style={s.obraGroup}>
          <h3 style={s.obraTitle}>{obraId} <span style={s.obraBadge}>{items.length}</span></h3>
          {items.map(lead => (
            <div key={lead.id} style={{
              ...s.leadCard,
              ...(contactados[lead.id] ? s.leadCardContactado : {}),
            }}>
              <div style={s.leadInfo}>
                <strong>{lead.nombre || '—'}</strong>
                <span style={s.leadDetail}>{lead.email}</span>
                {lead.telefono && <span style={s.leadDetail}>{lead.telefono}</span>}
                {lead.mensaje && <span style={s.leadMensaje}>{lead.mensaje}</span>}
                {contactados[lead.id] && (
                  <span style={s.contactadoBadge}>✓ Contactado</span>
                )}
              </div>
              <div style={s.leadActions}>
                {lead.telefono && (
                  <a
                    href={`https://wa.me/${lead.telefono.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(lead.nombre || '')}%2C%20te%20escribimos%20desde%20La%20Inaudita%20por%20tu%20inter%C3%A9s%20en%20la%20obra%20de%20Rafael%20Pineda.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={s.waBtn}
                  >
                    WhatsApp
                  </a>
                )}
                {!contactados[lead.id] && (
                  <button style={s.contactarBtn} onClick={() => marcarContactado(lead.id)}>
                    Contactado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Tab: Cupones ────────────────────────────────────────────────────────────────
function TabCupones() {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabaseAdmin
        .from('cupones')
        .select('*')
        .order('creado_en', { ascending: false })
        .limit(200);
      setCupones(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p style={s.loading}>Cargando...</p>;

  return (
    <div style={s.tabContent}>
      <h2 style={s.sectionTitle}>Cupones ({cupones.length})</h2>
      {cupones.length === 0 && <p style={s.empty}>Sin cupones generados todavía.</p>}
      <div style={s.cuponList}>
        {cupones.map(c => (
          <div key={c.id} style={s.cuponRow}>
            <span style={s.cuponCodigo}>{c.codigo}</span>
            <div style={s.cuponBadges}>
              {c.copa_usada && <span style={{ ...s.badge, background: '#2a7a2a' }}>🍷 Copa</span>}
              {c.canjeado   && <span style={{ ...s.badge, background: '#1a4a8a' }}>💳 Compra</span>}
              {!c.copa_usada && !c.canjeado && <span style={{ ...s.badge, background: '#999' }}>Pendiente</span>}
            </div>
            <span style={s.cuponFecha}>
              {c.creado_en ? new Date(c.creado_en).toLocaleDateString('es-ES') : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main AdminPanel ─────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('escaneos');

  if (!authed) return <PinScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <h1 style={s.headerTitle}>Admin · Ruta Pineda</h1>
        <button style={s.logoutBtn} onClick={() => setAuthed(false)}>Salir</button>
      </header>

      <nav style={s.tabs}>
        {[
          { key: 'escaneos', label: 'Escaneos' },
          { key: 'leads',    label: 'Leads' },
          { key: 'cupones',  label: 'Cupones' },
        ].map(({ key, label }) => (
          <button
            key={key}
            style={{ ...s.tabBtn, ...(tab === key ? s.tabBtnActive : {}) }}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'escaneos' && <TabEscaneos />}
      {tab === 'leads'    && <TabLeads />}
      {tab === 'cupones'  && <TabCupones />}
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────────
const SANS = '"Rubik",system-ui,sans-serif';

const s = {
  // PIN
  pinWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: SANS },
  pinInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '2rem' },
  pinTitle: { fontSize: '1.4rem', fontWeight: '600', margin: 0, color: '#0F0E0D' },
  pinSub: { fontSize: '0.8rem', color: '#888', margin: 0 },
  dots: { display: 'flex', gap: '0.75rem' },
  dotsShake: { animation: 'shake 0.4s ease' },
  dot: { width: 14, height: 14, borderRadius: '50%', border: '2px solid #0F0E0D', background: 'transparent' },
  dotOn: { background: '#0F0E0D' },
  pad: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginTop: '0.5rem' },
  key: { width: 72, height: 56, fontSize: '1.3rem', fontFamily: SANS, background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' },

  // Layout
  wrap: { minHeight: '100vh', background: '#fafaf9', fontFamily: SANS },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #e8e6e3', background: '#fff' },
  headerTitle: { margin: 0, fontSize: '1rem', fontWeight: '600', color: '#0F0E0D' },
  logoutBtn: { fontSize: '0.78rem', padding: '0.4rem 0.9rem', background: 'transparent', border: '1px solid #ddd', cursor: 'pointer', borderRadius: 4 },

  // Tabs
  tabs: { display: 'flex', borderBottom: '1px solid #e8e6e3', background: '#fff' },
  tabBtn: { flex: 1, padding: '0.75rem', fontSize: '0.82rem', fontFamily: SANS, background: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', color: '#888' },
  tabBtnActive: { borderBottom: '2px solid #0F0E0D', color: '#0F0E0D', fontWeight: '600' },

  // Content
  tabContent: { padding: '1.5rem', maxWidth: 680, margin: '0 auto' },
  loading: { padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' },
  empty: { color: '#aaa', fontSize: '0.85rem', padding: '1rem 0' },
  sectionTitle: { fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', margin: '0 0 1rem' },

  // Funnel
  funnel: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  funnelRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: '#fff', border: '1px solid #e8e6e3', borderRadius: 4 },
  funnelLabel: { fontSize: '0.85rem', color: '#444' },
  funnelBadge: { color: '#fff', fontSize: '0.9rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: 4, minWidth: 40, textAlign: 'center' },

  // Bar chart
  barChart: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  barRow: { display: 'grid', gridTemplateColumns: '180px 1fr 40px', alignItems: 'center', gap: '0.5rem' },
  barLabel: { fontSize: '0.76rem', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  barTrack: { height: 16, background: '#f0eeeb', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', background: '#0F0E0D', borderRadius: 3, transition: 'width 0.4s ease' },
  barCount: { fontSize: '0.75rem', color: '#888', textAlign: 'right' },

  // Leads
  leadsHeader: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' },
  csvBtn: { fontSize: '0.75rem', padding: '0.35rem 0.75rem', background: '#0F0E0D', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  obraGroup: { marginBottom: '1.5rem' },
  obraTitle: { fontSize: '0.82rem', fontWeight: '600', color: '#0F0E0D', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  obraBadge: { background: '#e8e6e3', borderRadius: 10, padding: '0.1rem 0.45rem', fontSize: '0.72rem', color: '#555', fontWeight: '400' },
  leadCard: { background: '#fff', border: '1px solid #e8e6e3', borderRadius: 4, padding: '0.75rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' },
  leadCardContactado: { opacity: 0.6 },
  leadInfo: { display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 },
  leadDetail: { fontSize: '0.78rem', color: '#666' },
  leadMensaje: { fontSize: '0.76rem', color: '#888', fontStyle: 'italic' },
  contactadoBadge: { fontSize: '0.7rem', color: '#2a7a2a', fontWeight: '600' },
  leadActions: { display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 },
  waBtn: { fontSize: '0.72rem', padding: '0.35rem 0.6rem', background: '#25d366', color: '#fff', borderRadius: 4, textDecoration: 'none', textAlign: 'center' },
  contactarBtn: { fontSize: '0.72rem', padding: '0.35rem 0.6rem', background: 'transparent', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', color: '#555' },

  // Cupones
  cuponList: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  cuponRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', background: '#fff', border: '1px solid #e8e6e3', borderRadius: 4 },
  cuponCodigo: { fontFamily: 'monospace', fontSize: '0.85rem', color: '#0F0E0D', flex: 1 },
  cuponBadges: { display: 'flex', gap: '0.3rem' },
  badge: { fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: 10, color: '#fff', fontWeight: '600' },
  cuponFecha: { fontSize: '0.72rem', color: '#aaa' },
};
