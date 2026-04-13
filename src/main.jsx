import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import CajaPanel from './components/CajaPanel';

const isCaja = window.location.pathname.endsWith('/caja') ||
               window.location.pathname.endsWith('/caja/');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      {isCaja ? <CajaPanel /> : <App />}
    </Suspense>
  </StrictMode>
);
