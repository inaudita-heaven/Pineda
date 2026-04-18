import React, { useState } from 'react';
import { PRECIOS_OBRAS, PRECIOS_PAPEL } from '../data/precios';

const SANS = '"Rubik", system-ui, sans-serif';
const SERIF = '"Playfair Display", Georgia, serif';
const _k = '1201';

export default function PreciosPanel() {
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);
  const [filtro, setFiltro] = useState('todo');
  const [busqueda, setBusqueda] = useState('');
  const [conCupon, setConCupon] = useState(false);

  if (!auth) return (
    <div style={s.login}>
      <p style={s.loginSub}>Rafael Pineda · Pintor de Córdoba</p>
      <p style={s.loginT}>Catálogo de precios</p>
      <input type="password" placeholder="Contraseña" value={pin}
        maxLength={6} autoFocus style={s.pinInput}
        onChange={e => setPin(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && pin === _k && setAuth(true)} />
      <button onClick={() => pin === _k && setAuth(true)} style={s.pinBtn}>
        Ver precios
      </button>
      {pin.length >= 4 && pin !== _k && (
        <p style={s.pinErr}>Contraseña incorrecta</p>
      )}
    </div>
  );

  const obras = Object.entries(PRECIOS_OBRAS).map(([id, o]) => ({
    id, serie: 'O',
    label: o.title,
    ref: `O-${String(o.num).padStart(3,'0')}`,
    precio: o.publico,
    precio_cupon: null,
    tipo: 'Obra original',
  }));

  const papeles = Object.entries(PRECIOS_PAPEL).map(([id, p]) => ({
    id, serie: 'P',
    label: p.tipo === 'grabado' ? 'Obra en papel · Grabado' : p.tipo === 'chapi' ? 'Obra en papel · Chapi Pineda' : 'Obra en papel',
    ref: `P-${String(p.num).padStart(3,'0')}`,
    precio: p.publico,
    precio_cupon: p.pvp_cupon,
    tipo: p.tipo === 'grabado' ? 'Grabado' : p.tipo === 'chapi' ? 'Chapi Pineda' : 'Obra en papel',
  }));

  const todo = [...obras, ...papeles].filter(item => {
    if (filtro === 'O' && item.serie !== 'O') return false;
    if (filtro === 'P' && item.serie !== 'P') return false;
    if (busqueda && !item.label.toLowerCase().includes(busqueda.toLowerCase())
        && !item.ref.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <p style={s.eyebrow}>Catálogo de precios</p>
          <h1 style={s.titulo}>Rafael Pineda</h1>
        </div>
        <button onClick={() => setAuth(false)} style={s.btnSalir}>Salir</button>
      </div>

      <div style={s.filtros}>
        <div style={s.tabs}>
          {[
            { id: 'todo', label: 'Todo' },
            { id: 'O', label: 'Originales' },
            { id: 'P', label: 'Obra en papel' },
          ].map(t => (
            <button key={t.id} onClick={() => setFiltro(t.id)}
              style={{ ...s.tab, ...(filtro === t.id ? s.tabOn : {}) }}>
              {t.label}
            </button>
          ))}
        </div>
        <input placeholder="Buscar..." value={busqueda}
          onChange={e => setBusqueda(e.target.value)} style={s.buscador} />
        {filtro === 'P' && (
          <label style={s.cuponLabel}>
            <input type="checkbox" checked={conCupon}
              onChange={e => setConCupon(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Con cupón PINEDA30
          </label>
        )}
      </div>

      <div style={s.lista}>
        {todo.map(item => {
          const tieneCupon = conCupon && item.precio_cupon;
          const precioMostrar = tieneCupon ? item.precio_cupon : item.precio;
          return (
            <div key={item.id} style={s.fila}>
              <div style={s.filaIzq}>
                <span style={s.ref}>{item.ref}</span>
                <div>
                  <p style={s.nombre}>{item.label}</p>
                  <p style={s.tipo}>{item.tipo}</p>
                </div>
              </div>
              <div style={s.filaDer}>
                {tieneCupon && (
                  <span style={s.precioTachado}>{item.precio}€</span>
                )}
                <span style={{ ...s.precio, color: tieneCupon ? '#1a6b3c' : '#0F0E0D' }}>
                  {precioMostrar}€
                </span>
                {tieneCupon && <span style={s.badgeCupon}>PINEDA30</span>}
              </div>
            </div>
          );
        })}
        {todo.length === 0 && <p style={s.vacio}>Sin resultados.</p>}
      </div>

      <p style={s.pie}>
        Precios en euros, IVA incluido · La Inaudita · Rodríguez Marín 20 · Córdoba
      </p>
    </div>
  );
}

const s = {
  login:{ minHeight:'100dvh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',fontFamily:SANS,gap:'1rem',padding:'2rem'},
  loginSub:{ fontFamily:SANS,fontSize:'0.72rem',color:'rgba(15,14,13,0.4)',letterSpacing:'0.1em',textTransform:'uppercase',margin:0},
  loginT:{ fontFamily:SERIF,fontSize:'1.6rem',color:'#0F0E0D',margin:0,textAlign:'center'},
  pinInput:{ width:'140px',textAlign:'center',fontSize:'1.5rem',letterSpacing:'0.3em',padding:'0.75rem',border:'1px solid #e8e6e3',outline:'none',fontFamily:SANS},
  pinBtn:{ padding:'0.75rem 2rem',backgroundColor:'#0F0E0D',color:'#fff',border:'none',cursor:'pointer',fontFamily:SANS,fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase'},
  pinErr:{ fontFamily:SANS,fontSize:'0.75rem',color:'#b03030',margin:0},
  wrap:{ backgroundColor:'#fff',minHeight:'100dvh',fontFamily:SANS},
  header:{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem',borderBottom:'2px solid #0F0E0D'},
  eyebrow:{ fontFamily:SANS,fontSize:'0.6rem',letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(15,14,13,0.35)',margin:'0 0 0.2rem'},
  titulo:{ fontFamily:SERIF,fontSize:'1.4rem',fontWeight:'400',color:'#0F0E0D',margin:0},
  btnSalir:{ fontFamily:SANS,fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(15,14,13,0.4)',background:'transparent',border:'1px solid #e8e6e3',padding:'0.4rem 0.8rem',cursor:'pointer'},
  filtros:{ padding:'1rem 1.25rem',borderBottom:'1px solid #e8e6e3',display:'flex',flexDirection:'column',gap:'0.75rem'},
  tabs:{ display:'flex'},
  tab:{ fontFamily:SANS,fontSize:'0.68rem',letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.6rem 1rem',background:'transparent',border:'1px solid #e8e6e3',cursor:'pointer',color:'rgba(15,14,13,0.4)',marginRight:'-1px'},
  tabOn:{ backgroundColor:'#0F0E0D',color:'#fff',borderColor:'#0F0E0D'},
  buscador:{ padding:'0.6rem 0.75rem',border:'1px solid #e8e6e3',fontFamily:SANS,fontSize:'0.85rem',outline:'none',width:'100%',boxSizing:'border-box'},
  cuponLabel:{ fontFamily:SANS,fontSize:'0.82rem',color:'#0F0E0D',display:'flex',alignItems:'center',cursor:'pointer'},
  lista:{ padding:'0 1.25rem'},
  fila:{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.85rem 0',borderBottom:'1px solid #f0efee',gap:'1rem'},
  filaIzq:{ display:'flex',alignItems:'center',gap:'0.75rem',flex:1},
  ref:{ fontFamily:'"Courier New",monospace',fontSize:'0.72rem',color:'rgba(15,14,13,0.35)',minWidth:'4.5rem',flexShrink:0},
  nombre:{ fontFamily:SERIF,fontSize:'0.95rem',color:'#0F0E0D',margin:'0 0 0.1rem'},
  tipo:{ fontFamily:SANS,fontSize:'0.68rem',color:'rgba(15,14,13,0.4)',margin:0,textTransform:'uppercase',letterSpacing:'0.06em'},
  filaDer:{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.15rem',flexShrink:0},
  precioTachado:{ fontFamily:SANS,fontSize:'0.75rem',color:'rgba(15,14,13,0.35)',textDecoration:'line-through'},
  precio:{ fontFamily:SERIF,fontSize:'1.25rem',fontWeight:'400'},
  badgeCupon:{ fontFamily:SANS,fontSize:'0.55rem',letterSpacing:'0.08em',backgroundColor:'#1a6b3c',color:'#fff',padding:'0.15rem 0.4rem'},
  vacio:{ fontFamily:SANS,fontSize:'0.82rem',color:'rgba(15,14,13,0.35)',textAlign:'center',padding:'3rem 0'},
  pie:{ fontFamily:SANS,fontSize:'0.62rem',color:'rgba(15,14,13,0.3)',textAlign:'center',padding:'2rem 1.25rem',letterSpacing:'0.04em'},
};
