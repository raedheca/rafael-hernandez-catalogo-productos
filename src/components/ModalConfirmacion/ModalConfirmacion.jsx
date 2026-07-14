import { Button, Modal } from 'react-bootstrap'

const ModalConfirmacion = ({
  mostrar,
  titulo = 'Confirmar accion',
  mensaje,
  texto_confirmar = 'Confirmar',
  variante = 'danger',
  onConfirmar,
  onCancelar,
}) => {
  return (
    <Modal show={mostrar} onHide={onCancelar} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensaje}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant={variante} onClick={onConfirmar}>
          {texto_confirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalConfirmacion
