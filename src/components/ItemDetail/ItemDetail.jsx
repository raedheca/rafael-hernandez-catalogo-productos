import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap'
import { FaArrowLeft, FaBoxOpen, FaCartPlus, FaTriangleExclamation } from 'react-icons/fa6'
import { obtener_producto_por_id } from '../../services/productos_service.js'
import { useCarrito } from '../../context/CarritoContext.jsx'
import Seo from '../Seo/Seo.jsx'

const ItemDetail = () => {
  const { id_producto } = useParams()
  const { agregar_al_carrito } = useCarrito()

  const [producto_detalle, set_producto_detalle] = useState(null)
  const [esta_cargando, set_esta_cargando] = useState(true)
  const [mensaje_error, set_mensaje_error] = useState(null)
  const [producto_agregado, set_producto_agregado] = useState(false)

  useEffect(() => {
    // Se resetea el spinner de carga cuando cambia id_producto (navegacion entre productos).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    set_esta_cargando(true)
    obtener_producto_por_id(id_producto)
      .then((producto_encontrado) => {
        set_producto_detalle(producto_encontrado)
        set_mensaje_error(null)
      })
      .catch((error) => set_mensaje_error(error.message))
      .finally(() => set_esta_cargando(false))
  }, [id_producto])

  const manejar_agregar_al_carrito = () => {
    agregar_al_carrito(producto_detalle)
    set_producto_agregado(true)
    setTimeout(() => set_producto_agregado(false), 2000)
  }

  if (esta_cargando) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" role="status" />
      </div>
    )
  }

  if (mensaje_error) {
    return (
      <Alert variant="danger">
        <FaTriangleExclamation className="me-2" />
        {mensaje_error}
        <div className="mt-3">
          <Link to="/productos" className="btn btn-sm btn-outline-warning">
            Volver al catalogo
          </Link>
        </div>
      </Alert>
    )
  }

  const precio_formateado = producto_detalle.precio_producto.toLocaleString('es-AR')

  return (
    <Row as="article" className="g-4">
      <Seo
        titulo={producto_detalle.nombre_producto}
        descripcion={producto_detalle.descripcion_producto}
      />
      <Col md={6}>
        <img
          src={producto_detalle.imagen_producto}
          alt={producto_detalle.nombre_producto}
          className="w-100 object-fit-contain rounded shadow-sm bg-white p-4"
          style={{ maxHeight: '420px' }}
        />
      </Col>

      <Col md={6}>
        <span className="badge bg-info text-dark mb-2 text-capitalize">
          {producto_detalle.categoria_producto}
        </span>
        <h2>{producto_detalle.nombre_producto}</h2>
        <p className="text-muted">{producto_detalle.descripcion_producto}</p>

        <h3 className="text-dark fw-bold my-3">${precio_formateado}</h3>

        <p className="text-secondary small">
          <FaBoxOpen className="me-1" />
          Stock disponible: {producto_detalle.stock_producto} unidades
        </p>

        <div className="d-flex gap-2 mt-3">
          <Button variant="outline-warning" onClick={manejar_agregar_al_carrito}>
            <FaCartPlus className="me-2" />
            {producto_agregado ? 'Agregado ✓' : 'Agregar al carrito'}
          </Button>
          <Link to="/productos" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-1" />
            Volver al catalogo
          </Link>
        </div>
      </Col>
    </Row>
  )
}

export default ItemDetail
