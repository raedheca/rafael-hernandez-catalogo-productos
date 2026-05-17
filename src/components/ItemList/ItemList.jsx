import { useEffect, useState } from 'react'
import Item from '../Item/Item.jsx'
import Icono from '../Icono/Icono.jsx'

const ItemList = ({ titulo_seccion = 'Nuestros Productos' }) => {
  const [lista_productos, set_lista_productos] = useState([])
  const [esta_cargando, set_esta_cargando] = useState(true)
  const [mensaje_error, set_mensaje_error] = useState(null)

  useEffect(() => {
    set_esta_cargando(true)
    fetch('/productos.json')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los productos')
        }
        return respuesta.json()
      })
      .then((datos) => {
        set_lista_productos(datos)
        set_mensaje_error(null)
      })
      .catch((error) => {
        set_mensaje_error(error.message)
      })
      .finally(() => set_esta_cargando(false))
  }, [])

  if (esta_cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-secondary">Cargando productos...</p>
      </div>
    )
  }

  if (mensaje_error) {
    return (
      <div className="alert alert-danger" role="alert">
        <Icono name="exclamation-triangle" className="me-2" />
        {mensaje_error}
      </div>
    )
  }

  return (
    <section>
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0">{titulo_seccion}</h2>
      </div>

      <div className="row g-4">
        {lista_productos.map((producto) => (
          <Item key={producto.id_producto} producto={producto} />
        ))}
      </div>
    </section>
  )
}

export default ItemList
