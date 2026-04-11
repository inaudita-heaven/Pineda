import React from 'react';
import { useTranslation } from 'react-i18next';

const SANS = '"Rubik", system-ui, sans-serif';

export default function NavBar({ tabActiva, onTab, visitedStops, couponDesbloqueado }) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'ruta',     label: 'Ruta',      icon: '◎' },
    { id: 'catalogo', label: 'Catálogo',  icon: '◻' },
    { id: 'cupon',    label: 'Cupón',     icon: '◈' },
  ];

  return (
    <nav style={styles.nav}>
      {tabs.map(tab => {
        const activa = tabActiva === tab.id;
        const showDot = tab.id === 'cupon' && couponDesbloqueado;
        return (
          <button
            key={tab.id}
            onClick={() => onTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activa ? styles.tabActiva : {}),
            }}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span style={styles.tabLabel}>{tab.label}</span>
            {showDot && <span style={styles.dot} />}
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '56px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e8e6e3',
    display: 'flex',
    alignItems: 'stretch',
    zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    position: 'relative',
    WebkitTapHighlightColor: 'transparent',
  },
  tabActiva: {
    borderTop: '2px solid #0F0E0D',
  },
  tabIcon: {
    fontSize: '1rem',
    color: '#0F0E0D',
    lineHeight: 1,
  },
  tabLabel: {
    fontFamily: '"Rubik", system-ui, sans-serif',
    fontSize: '0.58rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#0F0E0D',
  },
  dot: {
    position: 'absolute',
    top: '6px',
    right: 'calc(50% - 14px)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#0F0E0D',
  },
};
