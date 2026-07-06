import Icon from '../Icon/Icon';
import './ConfirmModal.css';

export default function ConfirmModal({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  varianteConfirmar = 'btn-success',
  onConfirmar,
  onCancelar,
}) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <section className="confirm-modal" role="dialog" aria-modal="true">
        <div className="modal-icon">
          <Icon name="check_circle" className="filled" />
        </div>

        <h2>{titulo}</h2>
        <p>{mensagem}</p>

        <div className="modal-actions">
          <button
            type="button"
            className={`btn ${varianteConfirmar}`}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={onCancelar}
          >
            {textoCancelar}
          </button>
        </div>
      </section>
    </div>
  );
}
