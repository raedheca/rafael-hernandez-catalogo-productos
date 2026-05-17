import { Link } from 'react-router-dom'

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
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 bg-white border-0 shadow-sm">
        <img
          src={imagen_producto}
          alt={nombre_producto}
          className="card-img-top object-fit-contain p-3 bg-white"
          style={{ height: '220px' }}
        />
        <div className="card-body d-flex flex-column">
          <span className="badge bg-info text-dark align-self-start mb-2 text-capitalize">
            {categoria_producto}
          </span>
          <h5 className="card-title">{nombre_producto}</h5>
          <p className="card-text text-muted small flex-grow-1">
            {descripcion_producto.substring(0, 80)}...
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fs-5 fw-bold text-dark">
              ${precio_formateado}
            </span>
            <Link
              to={`/producto/${id_producto}`}
              className="btn btn-outline-success btn-sm"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
