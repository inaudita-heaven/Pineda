import React, { useState } from 'react';
import { PRECIOS_OBRAS, PRECIOS_PAPEL } from '../data/precios';
import { catalog } from '../data/catalog';
import FormInteresadoMulti from './FormInteresadoMulti';
import Lightbox from './Lightbox';
import { getSessionId } from '../lib/session';

const catalogMap = Object.fromEntries(catalog.map(c => [c.id, c]));

const SANS = '"Rubik", system-ui, sans-serif';
const SERIF = '"Playfair Display", Georgia, serif';
const _k = '1201';

export default function PreciosPanel() {
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);
  const [filtro, setFiltro] = useState('todo');
  const [busqueda, setBusqueda] = useState('');
  const [conCupon, setConCupon] = useState(false);
  const [seleccionadas, setSeleccionadas] = useState(new Set());
  const [mostrarForm, setMostrarForm] = useState(false);
  const [negociacionIds, setNegociacionIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('pineda_en_negociacion') || '[]')); }
    catch { return new Set(); }
  });
  const [lightbox, setLightbox] = useState(null);
  const sessionId = getSessionId();

  if (!auth) return (
    <div style={s.login}>
      <div style={{ width: '100%', maxWidth: '320px' }}>
        <img src="/logos/INA_Branding_Negro.png" alt="La Inaudita"
          style={{ width: '100%', objectFit: 'contain', opacity: 0.9 }} />
      </div>
      <div style={{ width: '100%', maxWidth: '180px' }}>
        <img src="/images/autopineda.png" alt="Rafael Pineda"
          style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
      </div>
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
    enNegociacion: (o.enNegociacion ?? false) || negociacionIds.has(id),
    imageUrl: catalogMap[id]?.imageUrl ?? null,
  }));

  const papeles = Object.entries(PRECIOS_PAPEL).map(([id, p]) => ({
    id, serie: 'P',
    label: p.tipo === 'grabado' ? 'Obra en papel · Grabado' : p.tipo === 'chapi' ? 'Obra en papel · Chapi Pineda' : 'Obra en papel',
    ref: `P-${String(p.num).padStart(3,'0')}`,
    precio: p.publico,
    precio_cupon: p.pvp_cupon,
    tipo: p.tipo === 'grabado' ? 'Grabado' : p.tipo === 'chapi' ? 'Chapi Pineda' : 'Obra en papel',
    enNegociacion: (p.enNegociacion ?? false) || negociacionIds.has(id),
    imageUrl: null,
  }));

  const todo = [...obras, ...papeles].filter(item => {
    if (filtro === 'O' && item.serie !== 'O') return false;
    if (filtro === 'P' && item.serie !== 'P') return false;
    if (busqueda && !item.label.toLowerCase().includes(busqueda.toLowerCase())
        && !item.ref.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const toggleSeleccion = (id) => {
    setSeleccionadas(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const obrasSeleccionadas = todo.filter(i => seleccionadas.has(i.id)).map(i => ({
    id: i.id, title: i.label, ref: i.ref,
  }));

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
            { id: 'O', label: 'Obra expuesta' },
            { id: 'P', label: 'Fondo Rafael Pineda' },
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
          const checked = seleccionadas.has(item.id);
          return (
            <div key={item.id} style={s.fila}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.label}
                  onClick={() => setLightbox({ src: item.imageUrl, alt: item.label })}
                  style={s.thumb} />
              ) : (
                <div style={s.thumbPlaceholder} />
              )}
              <div style={s.filaInfo}>
                <span style={s.ref}>{item.ref}</span>
                <p style={s.nombre}>{item.label}</p>
                <p style={s.tipo}>{item.tipo}</p>
                {item.enNegociacion && (
                  <span style={s.badgeNegociacion}>En negociación</span>
                )}
              </div>
              <div style={s.filaDer}>
                {tieneCupon && <span style={s.precioTachado}>{item.precio}€</span>}
                <span style={{ ...s.precio, color: tieneCupon ? '#1a6b3c' : '#0F0E0D' }}>
                  {precioMostrar}€
                </span>
                {tieneCupon && <span style={s.badgeCupon}>PINEDA30</span>}
                {item.enNegociacion ? (
                  <span style={s.checkDisabled}>—</span>
                ) : (
                  <label style={s.checkLabel}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSeleccion(item.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
        {todo.length === 0 && <p style={s.vacio}>Sin resultados.</p>}
      </div>

      <p style={s.pie}>
        Precios en euros, sin IVA · La Inaudita · Rodríguez Marín 20 · Córdoba
      </p>

      {seleccionadas.size > 0 && (
        <div style={s.fab}>
          <button onClick={() => setMostrarForm(true)} style={s.fabBtn}>
            Enviar consulta ({seleccionadas.size})
          </button>
        </div>
      )}

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}

      {mostrarForm && (
        <FormInteresadoMulti
          obras={obrasSeleccionadas}
          sessionId={sessionId}
          onClose={() => {
            setMostrarForm(false);
            setSeleccionadas(new Set());
            try { setNegociacionIds(new Set(JSON.parse(localStorage.getItem('pineda_en_negociacion') || '[]'))); }
            catch {}
          }}
        />
      )}
    </div>
  );
}

const s = {
  login:{ minHeight:'100dvh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',fontFamily:SANS,gap:'1rem',padding:'2rem'},
  loginSub:{ fontFamily:SANS,fontSize:'0.72rem',color:'rgba(15,14,13,0.4)',letterSpacing:'0.1em',textTransform:'uppercase',margin:0},
  loginT:{ fontFamily:SERIF,fontSize:'1.6rem',color:'#0F0E0D',margin:0,textAlign:'center'},
  pinInput:{ width:'160px',textAlign:'center',fontSize:'0.9rem',letterSpacing:'0.12em',padding:'0.65rem',border:'1px solid #e8e6e3',outline:'none',fontFamily:SANS},
  pinBtn:{ padding:'0.75rem 2rem',backgroundColor:'#0F0E0D',color:'#fff',border:'none',cursor:'pointer',fontFamily:SANS,fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase'},
  pinErr:{ fontFamily:SANS,fontSize:'0.75rem',color:'#b03030',margin:0},
  wrap:{ backgroundColor:'#fff',minHeight:'100dvh',fontFamily:SANS,overflowX:'hidden',paddingBottom:'5rem'},
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
  lista:{ padding:'0 1rem'},
  fila:{ display:'flex',alignItems:'flex-start',padding:'0.75rem 0',borderBottom:'1px solid #f0efee',gap:'0.6rem'},
  filaInfo:{ flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:'0.1rem'},
  thumb:{ width:'44px',height:'44px',objectFit:'cover',flexShrink:0,cursor:'zoom-in',backgroundColor:'#f9f8f7' },
  thumbPlaceholder:{ width:'44px',height:'44px',flexShrink:0 },
  ref:{ fontFamily:'"Courier New",monospace',fontSize:'0.65rem',color:'rgba(15,14,13,0.35)'},
  nombre:{ fontFamily:SERIF,fontSize:'0.9rem',color:'#0F0E0D',margin:0,lineHeight:1.3,overflowWrap:'break-word'},
  tipo:{ fontFamily:SANS,fontSize:'0.62rem',color:'rgba(15,14,13,0.4)',margin:0,textTransform:'uppercase',letterSpacing:'0.06em'},
  badgeNegociacion:{ fontFamily:SANS,fontSize:'0.55rem',letterSpacing:'0.06em',color:'rgba(15,14,13,0.5)',border:'1px solid rgba(15,14,13,0.2)',padding:'0.1rem 0.4rem',alignSelf:'flex-start',marginTop:'0.15rem'},
  filaDer:{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.15rem',flexShrink:0,minWidth:'60px'},
  precioTachado:{ fontFamily:SANS,fontSize:'0.7rem',color:'rgba(15,14,13,0.35)',textDecoration:'line-through'},
  precio:{ fontFamily:SERIF,fontSize:'1.05rem',fontWeight:'400'},
  badgeCupon:{ fontFamily:SANS,fontSize:'0.5rem',letterSpacing:'0.08em',backgroundColor:'#1a6b3c',color:'#fff',padding:'0.15rem 0.35rem'},
  checkLabel:{ marginTop:'0.35rem',display:'flex',alignItems:'center',justifyContent:'flex-end'},
  checkDisabled:{ fontFamily:SANS,fontSize:'0.75rem',color:'rgba(15,14,13,0.25)',marginTop:'0.35rem'},
  vacio:{ fontFamily:SANS,fontSize:'0.82rem',color:'rgba(15,14,13,0.35)',textAlign:'center',padding:'3rem 0'},
  fab:{ position:'fixed',bottom:0,left:0,right:0,padding:'1rem 1.25rem',backgroundColor:'#fff',borderTop:'2px solid #0F0E0D',zIndex:1000},
  fabBtn:{ width:'100%',padding:'0.9rem',backgroundColor:'#0F0E0D',color:'#fff',border:'none',cursor:'pointer',fontFamily:SANS,fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase'},
  pie:{ fontFamily:SANS,fontSize:'0.62rem',color:'rgba(15,14,13,0.3)',textAlign:'center',padding:'2rem 1.25rem',letterSpacing:'0.04em'},
};
