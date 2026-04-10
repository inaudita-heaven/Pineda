/**
 * PantallaCreditos.jsx
 * Pantalla de inicio — se muestra UNA sola vez (controlado por hasSeenCredits en session.js).
 * Función: presentar la exposición antes de comenzar la ruta.
 */

import React from 'react';

const SERIF = '"IM Fell English", "Cormorant Garamond", Georgia, serif';
const SANS  = 'system-ui, -apple-system, sans-serif';

export default function PantallaCreditos({ onClose }) {
  return (
    <div style={s.root}>
      <div style={s.inner}>

        {/* Marca superior */}
        <p style={s.eyebrow}>Córdoba · Abril–Mayo 2025</p>

        {/* Retrato / monograma */}
        <div style={s.monogram} aria-hidden="true">
          <span style={s.monogramLetras}>R.P.</span>
        </div>

        {/* Título de la exposición */}
        <h1 style={s.titulo}>
          Rafael Pineda
        </h1>
        <p style={s.subtitulo}>Pintor de Córdoba</p>

        {/* Divisor */}
        <div style={s.divisor} />

        {/* Texto introductorio */}
        <p style={s.texto}>
          Treinta años pintando Córdoba desde dentro.
          <br />
          Sus cuadros no son postales: son memoria de barrio,
          <br />
          luz de patio y la sombra exacta que deja un capote al caer.
        </p>

        <p style={s.textoPeq}>
          Una ruta por las tabernas y espacios del casco antiguo
          donde viven sus obras.
        </p>

        {/* Tres salas */}
        <div style={s.salas}>
          {[
            { num: 'I',    nombre: 'Palacio de Viana',  sub: 'Paisaje y paisanaje cordobés' },
            { num: 'IV',   nombre: 'Casa 12PB',         sub: 'Los estilos de Pineda' },
            { num: 'XIII', nombre: 'La Inaudita',        sub: 'Los peligros del toreo' },
          ].map(({ num, nombre, sub }) => (
            <div key={num} style={s.sala}>
              <span style={s.salaNum}>{num}</span>
              <div>
                <p style={s.salaNombre}>{nombre}</p>
                <p style={s.salaSub}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button style={s.boton} onClick={onClose}>
          Entrar
        </button>

        {/* Créditos pequeños */}
        <p style={s.creditos}>
          Una producción de La Inaudita · Córdoba 2025
        </p>

      </div>
    </div>
  );
}

const s = {
  root: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#0F0E0D',
    color: '#f5f3ef',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflowY: 'auto',
    zIndex: 20000,
  },
  inner: {
    width: '100%',
    maxWidth: '480px',
    padding: '3rem 2rem 4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.25rem',
  },
  eyebrow: {
    fontFamily: SANS,
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#888',
    margin: 0,
  },
  monogram: {
    width: '80px',
    height: '80px',
    border: '1px solid #444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramLetras: {
    fontFamily: SERIF,
    fontSize: '1.6rem',
    fontWeight: '400',
    color: '#ccc',
    letterSpacing: '4px',
  },
  titulo: {
    fontFamily: SERIF,
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    fontWeight: '400',
    margin: 0,
    letterSpacing: '2px',
    lineHeight: 1.1,
    color: '#f5f3ef',
  },
  subtitulo: {
    fontFamily: SERIF,
    fontSize: '1rem',
    fontStyle: 'italic',
    color: '#aaa',
    margin: 0,
  },
  divisor: {
    width: '40px',
    height: '1px',
    backgroundColor: '#444',
    margin: '0.5rem 0',
  },
  texto: {
    fontFamily: SERIF,
    fontSize: '1rem',
    fontStyle: 'italic',
    lineHeight: 1.8,
    color: '#ccc',
    margin: 0,
  },
  textoPeq: {
    fontFamily: SANS,
    fontSize: '0.82rem',
    color: '#777',
    lineHeight: 1.6,
    margin: 0,
  },
  salas: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    borderTop: '1px solid #2a2a2a',
    borderBottom: '1px solid #2a2a2a',
    padding: '1.25rem 0',
    margin: '0.5rem 0',
  },
  sala: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  salaNum: {
    fontFamily: SERIF,
    fontSize: '1rem',
    color: '#666',
    minWidth: '3rem',
    textAlign: 'right',
    paddingTop: '2px',
  },
  salaNombre: {
    fontFamily: SERIF,
    fontSize: '0.95rem',
    color: '#ddd',
    margin: '0 0 2px',
    lineHeight: 1.3,
  },
  salaSub: {
    fontFamily: SANS,
    fontSize: '0.72rem',
    color: '#666',
    margin: 0,
    fontStyle: 'italic',
  },
  boton: {
    marginTop: '0.5rem',
    fontFamily: SANS,
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '1rem 3rem',
    backgroundColor: '#f5f3ef',
    color: '#0F0E0D',
    border: 'none',
    cursor: 'pointer',
    minHeight: '48px',
  },
  creditos: {
    fontFamily: SANS,
    fontSize: '0.68rem',
    color: '#444',
    letterSpacing: '0.5px',
    margin: 0,
  },
};
