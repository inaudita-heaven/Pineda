import { usePassportStore } from '../store/passportStore'

/**
 * Aviso que aparece tras completar la primera parada (Viana).
 * Informa que el progreso se guarda solo en este dispositivo.
 */
export default function ProgressWarningModal({ onClose }) {
  const markWarningShown = usePassportStore(s => s.markWarningShown)

  function handleClose() {
    markWarningShown()
    onClose?.()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="warning-title">
      <div className="modal">
        <h2 className="modal__title" id="warning-title">Tu progreso se guarda aquí</h2>
        <p className="modal__body">
          Tu pasaporte se guarda en este dispositivo. Si cambias de navegador o borras los datos del
          sitio, perderás las paradas completadas.
          <br /><br />
          ¡Sigue la ruta con el mismo dispositivo para no perder tu progreso!
        </p>
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={handleClose}>
            ¡Entendido, a explorar!
          </button>
        </div>
      </div>
    </div>
  )
}
