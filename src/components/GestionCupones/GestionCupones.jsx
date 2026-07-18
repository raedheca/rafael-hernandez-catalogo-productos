import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Modal, Spinner, Table } from 'react-bootstrap'
import { FaPen, FaTicket, FaTrash } from 'react-icons/fa6'
import {
  actualizar_cupon,
  crear_cupon,
  eliminar_cupon,
  obtener_cupones,
} from '../../services/cupones_service.js'
import FormularioCupon from '../FormularioCupon/FormularioCupon.jsx'
import ModalConfirmacion from '../ModalConfirmacion/ModalConfirmacion.jsx'

const formatear_tipo = (tipo_descuento) =>
  tipo_descuento === 'porcentaje' ? 'Porcentaje' : 'Monto fijo'

const formatear_valor = (cupon) =>
  cupon.tipo_descuento === 'porcentaje'
    ? `${cupon.valor_descuento}%`
    : `$${cupon.valor_descuento.toLocaleString('es-AR')}`

const GestionCupones = () => {
  const [lista_cupones, set_lista_cupones] = useState([])
  const [esta_cargando, set_esta_cargando] = useState(true)
  const [mensaje_error, set_mensaje_error] = useState(null)
  const [mensaje_exito, set_mensaje_exito] = useState(null)

  const [cupon_en_edicion, set_cupon_en_edicion] = useState(null)
  const [mostrar_formulario, set_mostrar_formulario] = useState(false)
  const [cupon_a_eliminar, set_cupon_a_eliminar] = useState(null)

  const cargar_cupones = async () => {
    set_esta_cargando(true)
    try {
      const cupones = await obtener_cupones()
      set_lista_cupones(cupones)
      set_mensaje_error(null)
    } catch (error) {
      set_mensaje_error(error.message)
    } finally {
      set_esta_cargando(false)
    }
  }

  useEffect(() => {
    // Carga inicial de cupones al montar la pestana.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar_cupones()
  }, [])

  const abrir_formulario_nuevo = () => {
    set_cupon_en_edicion(null)
    set_mostrar_formulario(true)
  }

  const abrir_formulario_edicion = (cupon) => {
    set_cupon_en_edicion(cupon)
    set_mostrar_formulario(true)
  }

  const manejar_guardar = async (datos_cupon) => {
    if (cupon_en_edicion) {
      await actualizar_cupon(cupon_en_edicion.id_cupon, datos_cupon)
      set_mensaje_exito('Cupon actualizado correctamente.')
    } else {
      await crear_cupon(datos_cupon)
      set_mensaje_exito('Cupon creado correctamente.')
    }
    set_mostrar_formulario(false)
    await cargar_cupones()
  }

  const confirmar_eliminacion = async () => {
    try {
      await eliminar_cupon(cupon_a_eliminar.id_cupon)
      set_mensaje_exito('Cupon eliminado correctamente.')
      set_cupon_a_eliminar(null)
      await cargar_cupones()
    } catch (error) {
      set_mensaje_error(error.message)
      set_cupon_a_eliminar(null)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Administracion de cupones</h2>
        <Button variant="warning" onClick={abrir_formulario_nuevo}>
          <FaTicket className="me-2" />
          Nuevo cupon
        </Button>
      </div>

      {mensaje_exito && (
        <Alert variant="success" dismissible onClose={() => set_mensaje_exito(null)}>
          {mensaje_exito}
        </Alert>
      )}

      {mensaje_error && (
        <Alert variant="danger" dismissible onClose={() => set_mensaje_error(null)}>
          {mensaje_error}
        </Alert>
      )}

      {esta_cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : lista_cupones.length === 0 ? (
        <p className="text-secondary">Todavia no hay cupones cargados.</p>
      ) : (
        <div className="table-responsive">
          <Table className="align-middle bg-white shadow-sm">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista_cupones.map((cupon) => (
                <tr key={cupon.id_cupon}>
                  <td className="fw-bold">{cupon.codigo_cupon}</td>
                  <td>{formatear_tipo(cupon.tipo_descuento)}</td>
                  <td>{formatear_valor(cupon)}</td>
                  <td>{cupon.fecha_vencimiento || 'Sin vencimiento'}</td>
                  <td>
                    <Badge bg={cupon.activo ? 'success' : 'secondary'}>
                      {cupon.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => abrir_formulario_edicion(cupon)}
                        aria-label={`Editar ${cupon.codigo_cupon}`}
                      >
                        <FaPen />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => set_cupon_a_eliminar(cupon)}
                        aria-label={`Eliminar ${cupon.codigo_cupon}`}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={mostrar_formulario} onHide={() => set_mostrar_formulario(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{cupon_en_edicion ? 'Editar cupon' : 'Nuevo cupon'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioCupon
            cupon={cupon_en_edicion}
            onGuardar={manejar_guardar}
            onCancelar={() => set_mostrar_formulario(false)}
          />
        </Modal.Body>
      </Modal>

      <ModalConfirmacion
        mostrar={!!cupon_a_eliminar}
        titulo="Eliminar cupon"
        mensaje={`Estas seguro de que queres eliminar el cupon "${cupon_a_eliminar?.codigo_cupon}"? Esta accion no se puede deshacer.`}
        texto_confirmar="Eliminar"
        variante="danger"
        onConfirmar={confirmar_eliminacion}
        onCancelar={() => set_cupon_a_eliminar(null)}
      />
    </div>
  )
}

export default GestionCupones
