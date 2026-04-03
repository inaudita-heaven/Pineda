import { useEffect, useRef, useState } from 'react'

const QR_ELEMENT_ID = 'qr-reader'

/**
 * Escáner QR usando html5-qrcode.
 * Importado dinámicamente para evitar SSR issues y reducir bundle inicial.
 *
 * Props:
 *  onScan(decodedText) — llamado al leer un QR válido
 *  onError(message)    — llamado si la cámara no está disponible
 */
export default function QrScanner({ onScan, onError }) {
  const scannerRef = useRef(null)
  const [status, setStatus] = useState('iniciando') // 'iniciando' | 'activo' | 'error'

  useEffect(() => {
    let scanner = null

    async function start() {
      try {
        const { Html5QrcodeScanner } = await import('html5-qrcode')

        scanner = new Html5QrcodeScanner(
          QR_ELEMENT_ID,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            // Mostrar solo botón de cámara trasera (modo móvil)
            showTorchButtonIfSupported: true,
          },
          /* verbose= */ false
        )

        scanner.render(
          (decodedText) => {
            setStatus('activo')
            onScan?.(decodedText)
          },
          () => {
            // Errores de frame son normales mientras el QR no está en foco — se ignoran
          }
        )

        setStatus('activo')
        scannerRef.current = scanner
      } catch (err) {
        setStatus('error')
        onError?.(err.message ?? 'No se pudo acceder a la cámara')
      }
    }

    start()

    return () => {
      scannerRef.current?.clear().catch(() => {})
    }
  }, [])

  return (
    <div>
      {status === 'iniciando' && (
        <p className="text-muted text-center" style={{ padding: '24px 0' }}>
          Iniciando cámara…
        </p>
      )}
      {status === 'error' && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 16px',
          color: '#991b1b',
          fontSize: '0.85rem',
          marginBottom: 12,
        }}>
          No se pudo acceder a la cámara. Asegúrate de dar permiso en tu navegador.
        </div>
      )}
      <div id={QR_ELEMENT_ID} style={{ width: '100%' }} />
    </div>
  )
}
