import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap'
import { FaBagShopping, FaTrash } from 'react-icons/fa6'
import { useCarrito } from '../context/CarritoContext.jsx'
import ModalConfirmacion from '../components/ModalConfirmacion/ModalConfirmacion.jsx'
import Seo from '../components/Seo/Seo.jsx'

const Carrito = () => {
  const { items_carrito, eliminar_del_carrito, vaciar_carrito, precio_total } = useCarrito()
  const [mostrar_modal_vaciar, set_mostrar_modal_vaciar] = useState(false)

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

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-3">
        <Button variant="outline-secondary" onClick={() => set_mostrar_modal_vaciar(true)}>
          Vaciar carrito
        </Button>
        <h4 className="mb-0">
          Total: <span className="fw-bold">${precio_total.toLocaleString('es-AR')}</span>
        </h4>
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
