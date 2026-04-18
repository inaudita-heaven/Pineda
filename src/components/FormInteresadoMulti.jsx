import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SANS = '"Rubik", system-ui, sans-serif';
const SERIF = '"Playfair Display", Georgia, serif';

export default function FormInteresadoMulti({ obras, sessionId, onClose }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [rgpd, setRgpd] = useState(false);
  const [estado, setEstado] = useState('idle');

  const enviar = async () => {
    if (!form.nombre || !form.email || !rgpd) return;
    setEstado('enviando');
    try {
      const rows = obras.map(o => ({
        session_id:     sessionId,
        obra_id:        o.id,
        obra_titulo:    o.title,
        nombre:         form.nombre.trim(),
        email:          form.email.trim().toLowerCase(),
        telefono:       form.telefono.trim() || null,
        consentimiento: true,
      }));
      const { error } = await supabase.from('interesados_obras').insert(rows);
      if (error) throw error;
      setEstado('ok');
    } catch {
      setEstado('error');
    }
  };

  const waTexto = [
    `Hola, me interesan las siguientes obras de Rafael Pineda:\n`,
    ...obras.map((o, i) => `${i + 1}. ${o.title} (${o.ref})`),
    `\nMi nombre es ${form.nombre || '…'}. Me gustaría más información sobre precio y disponibilidad.`,
  ].join('\n');
  const waUrl = `https://wa.me/34636291910?text=${encodeURIComponent(waTexto)}`;

  return (
    <div onClick={onClose} style={st.overlay}>
      <div onClick={e => e.stopPropagation()} style={st.panel}>

        {/* Cabecera */}
        <div>
          <p style={st.eyebrow}>Me interesan · {obras.length} {obras.length === 1 ? 'obra' : 'obras'}</p>
          <ul style={st.listaObras}>
            {obras.map(o => (
              <li key={o.id} style={st.listaItem}>
                <span style={st.listaRef}>{o.ref}</span> {o.title}
              </li>
            ))}
          </ul>
        </div>

        {estado === 'ok' ? (
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <p style={{ fontFamily: SERIF, fontSize: '1.1rem', color: '#0F0E0D', margin: '0 0 0.25rem' }}>
              Gracias, {form.nombre.split(' ')[0]}.
            </p>
            <p style={{ fontFamily: SANS, fontSize: '0.82rem', color: 'rgba(15,14,13,0.55)', margin: '0 0 1.5rem', fontWeight: '300', lineHeight: 1.6 }}>
              Hemos registrado tu interés. Si quieres información ahora mismo, escríbenos por WhatsApp con la lista ya preparada.
            </p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={st.btnWa}>
              Abrir WhatsApp con la lista →
            </a>
            <button onClick={onClose} style={{ ...st.btnSec, width: '100%', marginTop: '0.75rem' }}>Cerrar</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input placeholder="Nombre *" value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={st.input} />
              <input placeholder="Email *" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={st.input} />
              <input placeholder="Teléfono (opcional)" type="tel" value={form.telefono}
                onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} style={st.input} />
            </div>

            <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={rgpd} onChange={e => setRgpd(e.target.checked)} style={{ marginTop: '3px', flexShrink: 0 }} />
              <span style={{ fontFamily: SANS, fontSize: '0.72rem', color: 'rgba(15,14,13,0.6)', lineHeight: 1.5, fontWeight: '300' }}>
                Acepto que La Inaudita se ponga en contacto conmigo en relación a estas obras. Mis datos no serán cedidos a terceros.
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
                style={{ ...st.btnPrim, flex: 1, opacity: (!form.nombre || !form.email || !rgpd) ? 0.4 : 1 }}>
                {estado === 'enviando' ? 'Enviando…' : 'Enviar consulta'}
              </button>
              <button onClick={onClose} style={{ ...st.btnSec, flex: 1 }}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const st = {
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(15,14,13,0.75)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 9000,
  },
  panel: {
    backgroundColor: '#fff',
    width: '100%', maxWidth: '520px',
    maxHeight: '90dvh', overflowY: 'auto',
    padding: '2rem 1.5rem 2.5rem',
    display: 'flex', flexDirection: 'column', gap: '1.25rem',
  },
  eyebrow: {
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.62rem', letterSpacing: '0.16em',
    textTransform: 'uppercase', color: 'rgba(15,14,13,0.4)', margin: '0 0 0.6rem',
  },
  listaObras: {
    margin: 0, padding: 0, listStyle: 'none',
    display: 'flex', flexDirection: 'column', gap: '0.3rem',
    borderLeft: '2px solid #0F0E0D', paddingLeft: '0.75rem',
  },
  listaItem: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '0.9rem', color: '#0F0E0D', lineHeight: 1.4,
  },
  listaRef: {
    fontFamily: '"Courier New", monospace',
    fontSize: '0.65rem', color: 'rgba(15,14,13,0.4)',
  },
  input: {
    width: '100%', padding: '0.7rem 0.75rem',
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.9rem', color: '#0F0E0D',
    border: '1px solid #e8e6e3', outline: 'none',
    backgroundColor: '#fff', boxSizing: 'border-box',
  },
  btnPrim: {
    padding: '0.85rem', backgroundColor: '#0F0E0D', color: '#fff',
    border: 'none', cursor: 'pointer',
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
  },
  btnSec: {
    padding: '0.85rem', backgroundColor: 'transparent', color: '#0F0E0D',
    border: '1px solid #0F0E0D', cursor: 'pointer',
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
  },
  btnWa: {
    display: 'block', padding: '0.85rem',
    backgroundColor: '#0F0E0D', color: '#fff',
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.72rem', letterSpacing: '0.1em',
    textTransform: 'uppercase', textDecoration: 'none',
  },
};
