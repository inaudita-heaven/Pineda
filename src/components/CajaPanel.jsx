import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QrScanner from './QrScanner';

const CAJA_PIN = import.meta.env.VITE_CAJA_PIN || '0000';
const COUPON_RE = /^PINEDA30-[A-Z0-9]{6}$/;

// ── PIN screen ──────────────────────────────────────────────────
function PinScreen({ onSuccess }) {
  const { t } = useTranslation();
  const [digits, setDigits] = useState('');
  const [shake, setShake] = useState(false);

  function press(d) {
    if (digits.length >= 4) return;
    const next = digits + d;
    setDigits(next);
    if (next.length === 4) {
      if (next === CAJA_PIN) {
        onSuccess();
      } else {
        setShake(true);
        setTimeout(() => { setDigits(''); setShake(false); }, 700);
      }
    }
  }

  return (
    <div className="caja-pin">
      <div className="caja-pin__inner">
        <h1 className="caja-pin__title">{t('caja.pin.title')}</h1>
        <p className="caja-pin__sub">{t('caja.pin.prompt')}</p>
        <div className={`caja-pin__dots${shake ? ' caja-pin__dots--shake' : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <span key={i} className={`caja-pin__dot${i < digits.length ? ' caja-pin__dot--on' : ''}`} />
          ))}
        </div>
        <div className="caja-pin__pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} className="caja-pin__key" onClick={() => press(String(n))}>{n}</button>
          ))}
          <span className="caja-pin__key caja-pin__key--empty" />
          <button className="caja-pin__key" onClick={() => press('0')}>0</button>
          <button className="caja-pin__key caja-pin__key--del" onClick={() => setDigits(d => d.slice(0, -1))}>⌫</button>
        </div>
      </div>
    </div>
  );
}

// ── Main panel ──────────────────────────────────────────────────
export default function CajaPanel() {
  const { t } = useTranslation();
  const [authed, setAuthed] = useState(false);
  const [mode, setMode] = useState('copa'); // 'copa' | 'compra'
  const [code, setCode] = useState('');
  const [obra, setObra] = useState('');
  const [precio, setPrecio] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null); // null | { ok: bool, message: string }

  if (!authed) return <PinScreen onSuccess={() => setAuthed(true)} />;

  // ── Handlers ──────────────────────────────────────────────────

  function handleScan(decoded) {
    setShowScanner(false);
    let extracted = decoded.trim();
    try {
      const url = new URL(decoded);
      extracted = url.searchParams.get('code') || url.searchParams.get('coupon') || decoded;
    } catch { /* raw text */ }
    setCode(extracted.toUpperCase());
    setResult(null);
  }

  function handleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'es-ES';
    rec.maxAlternatives = 1;
    setListening(true);
    rec.onresult = e => {
      setCode(e.results[0][0].transcript.toUpperCase().replace(/\s+/g, ''));
      setListening(false);
      setResult(null);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  }

  function validate() {
    const c = code.trim().toUpperCase();
    if (!COUPON_RE.test(c)) {
      setResult({ ok: false, message: t('caja.copa.invalid') });
      return;
    }
    const key = `caja_copa_${c}`;
    if (localStorage.getItem(key)) {
      setResult({ ok: false, message: t('caja.copa.already_used') });
      return;
    }
    localStorage.setItem(key, new Date().toISOString());
    setResult({ ok: true, message: t('caja.copa.success') });
    // TODO: Supabase — UPDATE cupones SET copa_usada=true, copa_usada_en=NOW() WHERE codigo=c
  }

  function validateCompra() {
    const c = code.trim().toUpperCase();
    if (!COUPON_RE.test(c)) {
      setResult({ ok: false, message: t('caja.copa.invalid') });
      return;
    }
    if (!obra.trim() || !precio.trim()) {
      setResult({ ok: false, message: t('caja.compra.fields_required') });
      return;
    }
    const key = `caja_compra_${c}`;
    if (localStorage.getItem(key)) {
      setResult({ ok: false, message: t('caja.compra.already_used') });
      return;
    }
    localStorage.setItem(key, JSON.stringify({
      obra: obra.trim(),
      precio: precio.trim(),
      ts: new Date().toISOString(),
    }));
    setResult({ ok: true, message: t('caja.compra.success') });
    // TODO: Supabase — UPDATE cupones SET canjeado=true, canjeado_en=NOW(),
    //         obra_comprada=obra, precio_final=precio WHERE codigo=c
  }

  function reset() {
    setCode('');
    setObra('');
    setPrecio('');
    setResult(null);
  }

  function switchMode(m) { setMode(m); reset(); }

  const hasSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="caja">
      <header className="caja__header">
        <h1 className="caja__title">{t('caja.title')}</h1>
        <button className="btn btn--ghost caja__logout-btn" onClick={() => { setAuthed(false); reset(); }}>
          {t('caja.logout')}
        </button>
      </header>

      <nav className="caja__tabs">
        <button className={`caja__tab${mode === 'copa' ? ' caja__tab--active' : ''}`} onClick={() => switchMode('copa')}>
          {t('caja.nav.copa')}
        </button>
        <button className={`caja__tab${mode === 'compra' ? ' caja__tab--active' : ''}`} onClick={() => switchMode('compra')}>
          {t('caja.nav.compra')}
        </button>
      </nav>

      <main className="caja__main">
        <p className="caja__subtitle">{t(`caja.${mode}.subtitle`)}</p>

        {/* Code input */}
        <div className="caja__input-group">
          <input
            className="caja__code-input"
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setResult(null); }}
            placeholder="PINEDA30-XXXXXX"
            spellCheck={false}
            autoCapitalize="characters"
            autoComplete="off"
          />
          <div className="caja__input-btns">
            <button className="btn btn--outline" onClick={() => setShowScanner(true)}>
              {t(`caja.${mode}.scan`)}
            </button>
            {hasSpeech && (
              <button
                className={`btn btn--outline${listening ? ' caja__voice--active' : ''}`}
                onClick={handleVoice}
              >
                {listening ? '🎙️' : t(`caja.${mode}.voice`)}
              </button>
            )}
          </div>
        </div>

        {/* Compra-only fields */}
        {mode === 'compra' && (
          <div className="caja__compra-fields">
            <input
              className="caja__field"
              type="text"
              value={obra}
              onChange={e => { setObra(e.target.value); setResult(null); }}
              placeholder={t('caja.compra.obra_placeholder')}
              autoComplete="off"
            />
            <input
              className="caja__field"
              type="number"
              inputMode="decimal"
              value={precio}
              onChange={e => { setPrecio(e.target.value); setResult(null); }}
              placeholder={t('caja.compra.price_placeholder')}
              min="0"
              step="0.01"
            />
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`caja__result${result.ok ? ' caja__result--ok' : ' caja__result--err'}`}>
            {result.message}
          </div>
        )}

        {/* Action */}
        {!result ? (
          <button
            className="btn btn--primary caja__action-btn"
            onClick={mode === 'copa' ? validate : validateCompra}
            disabled={!code.trim()}
          >
            {t(`caja.${mode}.validate`)}
          </button>
        ) : (
          <button className="btn btn--outline caja__action-btn" onClick={reset}>
            {t('caja.new')}
          </button>
        )}
      </main>

      {showScanner && <QrScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
}
