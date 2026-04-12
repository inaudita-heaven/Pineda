import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SANS = '"Rubik", system-ui, sans-serif';
const PLAYFAIR = '"Playfair Display", Georgia, serif';

export default function FormInteresado({ obra, sessionId, onClose }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [rgpd, setRgpd] = useState(false);
  const [estado, setEstado] = useState('idle');

  const enviar = async () => {
    if (!form.nombre || !form.email || !rgpd) return;
    setEstado('enviando');
    try {
      const { error } = await supabase.from('interesados_obras').insert({
        session_id:     sessionId,
        obra_id:        obra.id,
        obra_titulo:    obra.title,
        nombre:         form.nombre.trim(),
        email:          form.email.trim().toLowerCase(),
        telefono:       form.telefono.trim() || null,
        consentimiento: true,
      });
      if (error) throw error;
      setEstado('ok');
    } catch {
      setEstado('error');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15,14,13,0.75)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 9000, padding: '0',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          width: '100%', maxWidth: '520px',
          padding: '2rem 1.5rem 2.5rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}
      >
        <div>
          <p style={{ fontFamily: SANS, fontSize: '0.62rem',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(15,14,13,0.4)', margin: '0 0 0.3rem' }}>
            Me interesa
          </p>
          <h2 style={{ fontFamily: PLAYFAIR, fontSize: '1.2rem',
            fontWeight: '400', color: '#0F0E0D', margin: 0, lineHeight: 1.3 }}>
            {obra.title}
          </h2>
          {obra.technique && (
            <p style={{ fontFamily: SANS, fontSize: '0.72rem',
              color: 'rgba(15,14,13,0.45)', margin: '0.2rem 0 0', fontWeight: '300' }}>
              {obra.technique}{obra.year ? ` · ${obra.year}` : ''}
            </p>
          )}
        </div>

        {estado === 'ok' ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{
              fontFamily: PLAYFAIR, fontSize: '1.1rem',
              color: '#0F0E0D', margin: '0 0 0.25rem'
            }}>
              Gracias, {form.nombre.split(' ')[0]}.
            </p>
            <p style={{
              fontFamily: SANS, fontSize: '0.82rem',
              color: 'rgba(15,14,13,0.55)', margin: '0 0 1.5rem',
              fontWeight: '300', lineHeight: 1.6
            }}>
              Hemos registrado tu interés. Si quieres información
              de compra ahora mismo, escríbenos por WhatsApp.
            </p>
            <a
              href={`https://wa.me/34636291910?text=Hola%2C%20acabo%20de%20registrar%20mi%20inter%C3%A9s%20por%20la%20obra%20%E2%80%9C${encodeURIComponent(obra.title)}%E2%80%9D%20(Ref%3A%20${obra.id}).%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '0.85rem',
                backgroundColor: '#0F0E0D',
                color: '#fff',
                fontFamily: SANS,
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                marginBottom: '0.75rem',
              }}
            >
              Contactar por WhatsApp →
            </a>
            <button onClick={onClose} style={{
              ...st.btnSecundario, width: '100%'
            }}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input placeholder="Nombre *" value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                style={st.input} />
              <input placeholder="Email *" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={st.input} />
              <input placeholder="Teléfono (opcional)" type="tel" value={form.telefono}
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                style={st.input} />
            </div>

            <label style={{ display: 'flex', gap: '0.75rem',
              alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={rgpd}
                onChange={e => setRgpd(e.target.checked)}
                style={{ marginTop: '3px', flexShrink: 0 }} />
              <span style={{ fontFamily: SANS, fontSize: '0.72rem',
                color: 'rgba(15,14,13,0.6)', lineHeight: 1.5, fontWeight: '300' }}>
                Acepto que La Inaudita se ponga en contacto conmigo
                en relación a esta obra. Mis datos no serán cedidos a terceros.
              </span>
            </label>

            {estado === 'error' && (
              <p style={{ fontFamily: SANS, fontSize: '0.75rem', color: '#b03030', margin: 0 }}>
                Error al enviar. Inténtalo de nuevo.
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={enviar}
                disabled={!form.nombre || !form.email || !rgpd || estado === 'enviando'}
                style={{ ...st.btnPrimario, flex: 1,
                  opacity: (!form.nombre || !form.email || !rgpd) ? 0.4 : 1 }}>
                {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
              </button>
              <button onClick={onClose} style={{ ...st.btnSecundario, flex: 1 }}>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const st = {
  input: {
    width: '100%', padding: '0.7rem 0.75rem',
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.9rem', color: '#0F0E0D',
    border: '1px solid #e8e6e3', outline: 'none', backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  btnPrimario: {
    padding: '0.85rem', backgroundColor: '#0F0E0D', color: '#fff',
    border: 'none', cursor: 'pointer',
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
  },
  btnSecundario: {
    padding: '0.85rem', backgroundColor: 'transparent', color: '#0F0E0D',
    border: '1px solid #0F0E0D', cursor: 'pointer',
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
  },
};
