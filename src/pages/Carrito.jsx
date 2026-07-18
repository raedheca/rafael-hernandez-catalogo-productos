import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Badge, Button, Form, InputGroup, Table } from 'react-bootstrap'
import { FaBagShopping, FaTicket, FaTrash, FaXmark } from 'react-icons/fa6'
import { useCarrito } from '../context/CarritoContext.jsx'
import { validar_cupon } from '../services/cupones_service.js'
import ModalConfirmacion from '../components/ModalConfirmacion/ModalConfirmacion.jsx'
import Seo from '../components/Seo/Seo.jsx'

const Carrito = () => {
  const {
    items_carrito,
    eliminar_del_carrito,
    vaciar_carrito,
    precio_total,
    cupon_aplicado,
    aplicar_cupon,
    quitar_cupon,
    monto_descuento,
    total_con_descuento,
  } = useCarrito()
  const [mostrar_modal_vaciar, set_mostrar_modal_vaciar] = useState(false)
  const [codigo_cupon_ingresado, set_codigo_cupon_ingresado] = useState('')
  const [esta_validando_cupon, set_esta_validando_cupon] = useState(false)
  const [mensaje_error_cupon, set_mensaje_error_cupon] = useState(null)

  const manejar_aplicar_cupon = async (evento) => {
    evento.preventDefault()
    if (!codigo_cupon_ingresado.trim()) return

    set_esta_validando_cupon(true)
    set_mensaje_error_cupon(null)
    try {
      const cupon = await validar_cupon(codigo_cupon_ingresado)
      aplicar_cupon(cupon)
      set_codigo_cupon_ingresado('')
    } catch (error) {
      set_mensaje_error_cupon(error.message)
    } finally {
      set_esta_validando_cupon(false)
    }
  }

  if (items_carrito.length === 0) {
    return (
      <div className="text-center py-5">
        <Seo
          titulo="Carrito"
          descripcion="Revisa los productos que agregaste a tu carrito de compras."
        />
        <FaBagShopping size={48} className="text-secondary mb-3" />
        <h2>Tu carrito esta vacio</h2>
        <p className="text-secondary mb-4">Agrega productos desde el catalogo para verlos aca.</p>
        <Link to="/productos" className="btn btn-outline-warning">
          Ver catalogo
        </Link>
      </div>
    )
  }

  return (
    <section>
      <Seo
        titulo="Carrito"
        descripcion="Revisa los productos que agregaste a tu carrito de compras."
      />
      <h2 className="mb-4">Mi carrito</h2>

      <div className="table-responsive">
        <Table className="align-middle bg-white shadow-sm">
          <thead>
            <tr>
              <th></th>
              <th>Producto</th>
              <th>Precio unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items_carrito.map(({ producto, cantidad }) => (
              <tr key={producto.id_producto}>
                <td style={{ width: '70px' }}>
                  <img
                    src={producto.imagen_producto}
                    alt={producto.nombre_producto}
                    className="object-fit-contain"
                    style={{ width: '60px', height: '60px' }}
                  />
                </td>
                <td>{producto.nombre_producto}</td>
                <td>${producto.precio_producto.toLocaleString('es-AR')}</td>
                <td>{cantidad}</td>
                <td>${(producto.precio_producto * cantidad).toLocaleString('es-AR')}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => eliminar_del_carrito(producto.id_producto)}
                    aria-label={`Eliminar ${producto.nombre_producto} del carrito`}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="bg-white shadow-sm rounded p-3 mt-3">
        <h5 className="mb-3">Cupon de descuento</h5>

        {mensaje_error_cupon && (
          <Alert variant="danger" dismissible onClose={() => set_mensaje_error_cupon(null)}>
            {mensaje_error_cupon}
          </Alert>
        )}

        {cupon_aplicado ? (
          <div className="d-flex align-items-center gap-3">
            <Badge bg="success" className="fs-6">
              <FaTicket className="me-2" />
              {cupon_aplicado.codigo_cupon}
            </Badge>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={quitar_cupon}
              aria-label="Quitar cupon aplicado"
            >
              <FaXmark className="me-1" />
              Quitar cupon
            </Button>
          </div>
        ) : (
          <Form onSubmit={manejar_aplicar_cupon}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Ingresa tu codigo de cupon"
                value={codigo_cupon_ingresado}
                onChange={(evento) => set_codigo_cupon_ingresado(evento.target.value)}
                aria-label="Codigo de cupon"
              />
              <Button
                variant="warning"
                type="submit"
                disabled={esta_validando_cupon || !codigo_cupon_ingresado.trim()}
              >
                <FaTicket className="me-2" />
                {esta_validando_cupon ? 'Validando...' : 'Aplicar'}
              </Button>
            </InputGroup>
          </Form>
        )}
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-3">
        <Button variant="outline-secondary" onClick={() => set_mostrar_modal_vaciar(true)}>
          Vaciar carrito
        </Button>

        <div className="text-sm-end">
          <p className="mb-1">
            Subtotal: <span className="fw-bold">${precio_total.toLocaleString('es-AR')}</span>
          </p>
          {cupon_aplicado && (
            <p className="mb-1 text-success">
              Descuento ({cupon_aplicado.codigo_cupon}): -$
              {monto_descuento.toLocaleString('es-AR')}
            </p>
          )}
          <h4 className="mb-0">
            Total:{' '}
            <span className="fw-bold">
              ${(cupon_aplicado ? total_con_descuento : precio_total).toLocaleString('es-AR')}
            </span>
          </h4>
        </div>
      </div>

      <ModalConfirmacion
        mostrar={mostrar_modal_vaciar}
        titulo="Vaciar carrito"
        mensaje="Estas seguro de que queres eliminar todos los productos del carrito?"
        texto_confirmar="Vaciar"
        variante="danger"
        onConfirmar={() => {
          vaciar_carrito()
          set_mostrar_modal_vaciar(false)
        }}
        onCancelar={() => set_mostrar_modal_vaciar(false)}
      />
    </section>
  )
}

export default Carrito
