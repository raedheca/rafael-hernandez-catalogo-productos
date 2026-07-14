import { useEffect, useMemo, useState } from 'react'
import { Alert, Row, Spinner } from 'react-bootstrap'
import { FaTriangleExclamation } from 'react-icons/fa6'
import Item from '../Item/Item.jsx'
import BarraBusqueda from '../BarraBusqueda/BarraBusqueda.jsx'
import Paginador from '../Paginador/Paginador.jsx'
import { obtener_productos } from '../../services/productos_service.js'

const PRODUCTOS_POR_PAGINA = 6

const ItemList = ({ titulo_seccion = 'Nuestros Productos' }) => {
  const [lista_productos, set_lista_productos] = useState([])
  const [esta_cargando, set_esta_cargando] = useState(true)
  const [mensaje_error, set_mensaje_error] = useState(null)
  const [termino_busqueda, set_termino_busqueda] = useState('')
  const [pagina_actual, set_pagina_actual] = useState(1)

  useEffect(() => {
    obtener_productos()
      .then((productos) => {
        set_lista_productos(productos)
        set_mensaje_error(null)
      })
      .catch((error) => {
        set_mensaje_error(error.message)
      })
      .finally(() => set_esta_cargando(false))
  }, [])

  const productos_filtrados = useMemo(() => {
    const termino = termino_busqueda.trim().toLowerCase()
    if (!termino) return lista_productos

    return lista_productos.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(termino) ||
        producto.categoria_producto.toLowerCase().includes(termino)
    )
  }, [lista_productos, termino_busqueda])

  const total_paginas = Math.max(
    1,
    Math.ceil(productos_filtrados.length / PRODUCTOS_POR_PAGINA)
  )

  const productos_pagina_actual = useMemo(() => {
    const inicio = (pagina_actual - 1) * PRODUCTOS_POR_PAGINA
    return productos_filtrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA)
  }, [productos_filtrados, pagina_actual])

  const manejar_busqueda = (valor) => {
    set_termino_busqueda(valor)
    set_pagina_actual(1)
  }

  if (esta_cargando) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3 text-secondary">Cargando productos...</p>
      </div>
    )
  }

  if (mensaje_error) {
    return (
      <Alert variant="danger">
        <FaTriangleExclamation className="me-2" />
        {mensaje_error}
      </Alert>
    )
  }

  return (
    <section>
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0">{titulo_seccion}</h2>
      </div>

      <BarraBusqueda termino_busqueda={termino_busqueda} set_termino_busqueda={manejar_busqueda} />

      {productos_filtrados.length === 0 ? (
        <p className="text-secondary text-center py-4">
          No se encontraron productos para "{termino_busqueda}".
        </p>
      ) : (
        <>
          <Row className="g-4">
            {productos_pagina_actual.map((producto) => (
              <Item key={producto.id_producto} producto={producto} />
            ))}
          </Row>

          <Paginador
            pagina_actual={pagina_actual}
            total_paginas={total_paginas}
            set_pagina_actual={set_pagina_actual}
          />
        </>
      )}
    </section>
  )
}

export default ItemList
