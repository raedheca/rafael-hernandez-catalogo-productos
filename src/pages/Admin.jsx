import { useEffect, useState } from 'react'
import { Alert, Button, Modal, Spinner, Table } from 'react-bootstrap'
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa6'
import {
  actualizar_producto,
  crear_producto,
  eliminar_producto,
  obtener_productos,
} from '../services/productos_service.js'
import FormularioProducto from '../components/FormularioProducto/FormularioProducto.jsx'
import ModalConfirmacion from '../components/ModalConfirmacion/ModalConfirmacion.jsx'
import Seo from '../components/Seo/Seo.jsx'

const Admin = () => {
  const [lista_productos, set_lista_productos] = useState([])
  const [esta_cargando, set_esta_cargando] = useState(true)
  const [mensaje_error, set_mensaje_error] = useState(null)
  const [mensaje_exito, set_mensaje_exito] = useState(null)

  const [producto_en_edicion, set_producto_en_edicion] = useState(null)
  const [mostrar_formulario, set_mostrar_formulario] = useState(false)
  const [producto_a_eliminar, set_producto_a_eliminar] = useState(null)

  const cargar_productos = async () => {
    set_esta_cargando(true)
    try {
      const productos = await obtener_productos()
      set_lista_productos(productos)
      set_mensaje_error(null)
    } catch (error) {
      set_mensaje_error(error.message)
    } finally {
      set_esta_cargando(false)
    }
  }

  useEffect(() => {
    // Carga inicial de productos al montar el panel.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar_productos()
  }, [])

  const abrir_formulario_nuevo = () => {
    set_producto_en_edicion(null)
    set_mostrar_formulario(true)
  }

  const abrir_formulario_edicion = (producto) => {
    set_producto_en_edicion(producto)
    set_mostrar_formulario(true)
  }

  const manejar_guardar = async (datos_producto) => {
    if (producto_en_edicion) {
      await actualizar_producto(producto_en_edicion.id_producto, datos_producto)
      set_mensaje_exito('Producto actualizado correctamente.')
    } else {
      await crear_producto(datos_producto)
      set_mensaje_exito('Producto creado correctamente.')
    }
    set_mostrar_formulario(false)
    await cargar_productos()
  }

  const confirmar_eliminacion = async () => {
    try {
      await eliminar_producto(producto_a_eliminar.id_producto)
      set_mensaje_exito('Producto eliminado correctamente.')
      set_producto_a_eliminar(null)
      await cargar_productos()
    } catch (error) {
      set_mensaje_error(error.message)
      set_producto_a_eliminar(null)
    }
  }

  return (
    <section>
      <Seo
        titulo="Administracion"
        descripcion="Panel de gestion de productos del catalogo de RafuShop."
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Administracion de productos</h2>
        <Button variant="warning" onClick={abrir_formulario_nuevo}>
          <FaPlus className="me-2" />
          Nuevo producto
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
      ) : lista_productos.length === 0 ? (
        <p className="text-secondary">Todavia no hay productos cargados.</p>
      ) : (
        <div className="table-responsive">
          <Table className="align-middle bg-white shadow-sm">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista_productos.map((producto) => (
                <tr key={producto.id_producto}>
                  <td style={{ width: '60px' }}>
                    <img
                      src={producto.imagen_producto}
                      alt={producto.nombre_producto}
                      className="object-fit-contain"
                      style={{ width: '50px', height: '50px' }}
                    />
                  </td>
                  <td>{producto.nombre_producto}</td>
                  <td className="text-capitalize">{producto.categoria_producto}</td>
                  <td>${producto.precio_producto.toLocaleString('es-AR')}</td>
                  <td>{producto.stock_producto}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => abrir_formulario_edicion(producto)}
                        aria-label={`Editar ${producto.nombre_producto}`}
                      >
                        <FaPen />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => set_producto_a_eliminar(producto)}
                        aria-label={`Eliminar ${producto.nombre_producto}`}
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
          <Modal.Title>
            {producto_en_edicion ? 'Editar producto' : 'Nuevo producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioProducto
            producto={producto_en_edicion}
            onGuardar={manejar_guardar}
            onCancelar={() => set_mostrar_formulario(false)}
          />
        </Modal.Body>
      </Modal>

      <ModalConfirmacion
        mostrar={!!producto_a_eliminar}
        titulo="Eliminar producto"
        mensaje={`Estas seguro de que queres eliminar "${producto_a_eliminar?.nombre_producto}"? Esta accion no se puede deshacer.`}
        texto_confirmar="Eliminar"
        variante="danger"
        onConfirmar={confirmar_eliminacion}
        onCancelar={() => set_producto_a_eliminar(null)}
      />
    </section>
  )
}

export default Admin
