import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QrScanner({ onScan, onClose }) {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Guard against React 18 strict-mode double-invoke
    if (mountedRef.current) return;
    mountedRef.current = true;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 240, height: 240 }, rememberLastUsedCamera: false },
      /* verbose */ false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear().catch(() => {});
        onScan(decodedText);
      },
      () => {
        // scan errors are expected — ignore
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
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
