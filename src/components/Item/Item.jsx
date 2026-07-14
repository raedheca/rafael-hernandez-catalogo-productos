import { Link } from 'react-router-dom'
import { Badge, Card, Col } from 'react-bootstrap'
import TarjetaProducto from './TarjetaProducto.js'

const Item = ({ producto }) => {
  const {
    id_producto,
    nombre_producto,
    descripcion_producto,
    precio_producto,
    imagen_producto,
    categoria_producto,
  } = producto

  const precio_formateado = precio_producto.toLocaleString('es-AR')

  return (
    <Col md={6} lg={4}>
      <TarjetaProducto className="h-100 bg-white border-0 shadow-sm">
        <Card.Img
          variant="top"
          src={imagen_producto}
          alt={nombre_producto}
          className="object-fit-contain p-3 bg-white"
          style={{ height: '220px' }}
        />
        <Card.Body className="d-flex flex-column">
          <Badge bg="info" text="dark" className="align-self-start mb-2 text-capitalize">
            {categoria_producto}
          </Badge>
          <Card.Title>{nombre_producto}</Card.Title>
          <Card.Text className="text-muted small flex-grow-1">
            {descripcion_producto.substring(0, 80)}...
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fs-5 fw-bold text-dark">${precio_formateado}</span>
            <Link
              to={`/producto/${id_producto}`}
              className="btn btn-outline-success btn-sm"
            >
              Ver detalle
            </Link>
          </div>
        </Card.Body>
      </TarjetaProducto>
    </Col>
  )
}

export default Item
