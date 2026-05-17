import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Icono from '../Icono/Icono.jsx'

const ItemDetail = () => {
  const { id_producto } = useParams()

  const [producto_detalle, set_producto_detalle] = useState(null)
  const [esta_cargando, set_esta_cargando] = useState(true)
  const [mensaje_error, set_mensaje_error] = useState(null)

  useEffect(() => {
    set_esta_cargando(true)
    fetch('/productos.json')
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        const producto_encontrado = datos.find(
          (item) => item.id_producto === Number(id_producto)
        )
        if (!producto_encontrado) {
          throw new Error('Producto no encontrado')
        }
        set_producto_detalle(producto_encontrado)
        set_mensaje_error(null)
      })
      .catch((error) => set_mensaje_error(error.message))
      .finally(() => set_esta_cargando(false))
  }, [id_producto])

  if (esta_cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    )
  }

  if (mensaje_error) {
    return (
      <div className="alert alert-danger">
        <Icono name="exclamation-triangle" className="me-2" />
        {mensaje_error}
        <div className="mt-3">
          <Link to="/productos" className="btn btn-sm btn-outline-warning">
            Volver al catalogo
          </Link>
        </div>
      </div>
    )
  }

  const precio_formateado = producto_detalle.precio_producto.toLocaleString('es-AR')

  return (
    <article className="row g-4">
      <div className="col-md-6">
        <img
          src={producto_detalle.imagen_producto}
          alt={producto_detalle.nombre_producto}
          className="w-100 object-fit-contain rounded shadow-sm bg-white p-4"
          style={{ maxHeight: '420px' }}
        />
      </div>

      <div className="col-md-6">
        <span className="badge bg-info text-dark mb-2 text-capitalize">
          {producto_detalle.categoria_producto}
        </span>
        <h2>{producto_detalle.nombre_producto}</h2>
        <p className="text-muted">{producto_detalle.descripcion_producto}</p>

        <h3 className="text-dark fw-bold my-3">${precio_formateado}</h3>

        <p className="text-secondary small">
          <Icono name="box-seam" className="me-1" />
          Stock disponible: {producto_detalle.stock_producto} unidades
        </p>

        <div className="d-flex gap-2 mt-3">
          <button type="button" className="btn btn-outline-warning">
            <Icono name="cart-plus" className="me-2" />
            Agregar al carrito
          </button>
          <Link to="/productos" className="btn btn-outline-secondary">
            <Icono name="arrow-left" className="me-1" />
            Volver al catalogo
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ItemDetail
