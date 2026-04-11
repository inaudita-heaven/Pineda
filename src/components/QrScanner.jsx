import { useEffect, useRef, useState } from 'react';

export default function QrScanner({ onScan, onClose }) {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Guard against React 18 strict-mode double-invoke
    if (mountedRef.current) return;
    mountedRef.current = true;

    let scanner;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            scanner.stop().catch(() => {});
            onScan(decodedText);
          },
          () => {
            // scan errors are expected — ignore
          }
        )
        .catch(() => {
          setError('No se pudo acceder a la cámara. Verifica los permisos.');
        });
    });

    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={e => e.stopPropagation()}>
        <p className="qr-modal__title">Apunta la cámara al QR de la parada</p>
        <div id="qr-reader" className="qr-reader" />
        {error && <p className="qr-modal__error">{error}</p>}
        <button className="btn btn--ghost qr-modal__cancel" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
