import { useState } from 'react'
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap'

const valores_iniciales_vacios = {
  nombre_producto: '',
  descripcion_producto: '',
  precio_producto: '',
  imagen_producto: '',
  stock_producto: '',
  categoria_producto: '',
}

const FormularioProducto = ({ producto = null, onGuardar, onCancelar }) => {
  const [valores, set_valores] = useState(
    producto
      ? {
          nombre_producto: producto.nombre_producto ?? '',
          descripcion_producto: producto.descripcion_producto ?? '',
          precio_producto: producto.precio_producto ?? '',
          imagen_producto: producto.imagen_producto ?? '',
          stock_producto: producto.stock_producto ?? '',
          categoria_producto: producto.categoria_producto ?? '',
        }
      : valores_iniciales_vacios
  )
  const [errores_campos, set_errores_campos] = useState({})
  const [esta_guardando, set_esta_guardando] = useState(false)
  const [mensaje_error, set_mensaje_error] = useState(null)

  const manejar_cambio = (evento) => {
    const { name, value } = evento.target
    set_valores((valores_actuales) => ({ ...valores_actuales, [name]: value }))
  }

  const validar = () => {
    const errores = {}

    if (!valores.nombre_producto.trim()) {
      errores.nombre_producto = 'El nombre es obligatorio.'
    }

    const precio_numerico = Number(valores.precio_producto)
    if (!valores.precio_producto || Number.isNaN(precio_numerico) || precio_numerico <= 0) {
      errores.precio_producto = 'El precio debe ser un numero mayor a 0.'
    }

    const stock_numerico = Number(valores.stock_producto)
    if (
      valores.stock_producto === '' ||
      !Number.isInteger(stock_numerico) ||
      stock_numerico < 0
    ) {
      errores.stock_producto = 'El stock debe ser un numero entero mayor o igual a 0.'
    }

    if (valores.descripcion_producto.trim().length < 10) {
      errores.descripcion_producto = 'La descripcion debe tener al menos 10 caracteres.'
    }

    if (!valores.imagen_producto.trim()) {
      errores.imagen_producto = 'La URL de la imagen es obligatoria.'
    }

    if (!valores.categoria_producto.trim()) {
      errores.categoria_producto = 'La categoria es obligatoria.'
    }

    set_errores_campos(errores)
    return Object.keys(errores).length === 0
  }

  const manejar_envio = async (evento) => {
    evento.preventDefault()
    set_mensaje_error(null)

    if (!validar()) return

    const datos_producto = {
      nombre_producto: valores.nombre_producto.trim(),
      descripcion_producto: valores.descripcion_producto.trim(),
      precio_producto: Number(valores.precio_producto),
      imagen_producto: valores.imagen_producto.trim(),
      stock_producto: Number(valores.stock_producto),
      categoria_producto: valores.categoria_producto.trim().toLowerCase(),
    }

    set_esta_guardando(true)
    try {
      await onGuardar(datos_producto)
    } catch (error) {
      set_mensaje_error(error.message)
    } finally {
      set_esta_guardando(false)
    }
  }

  return (
    <Form noValidate onSubmit={manejar_envio}>
      {mensaje_error && <Alert variant="danger">{mensaje_error}</Alert>}

      <Form.Group className="mb-3" controlId="nombre_producto">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre_producto"
          value={valores.nombre_producto}
          onChange={manejar_cambio}
          isInvalid={!!errores_campos.nombre_producto}
        />
        <Form.Control.Feedback type="invalid">
          {errores_campos.nombre_producto}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="descripcion_producto">
        <Form.Label>Descripcion</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descripcion_producto"
          value={valores.descripcion_producto}
          onChange={manejar_cambio}
          isInvalid={!!errores_campos.descripcion_producto}
        />
        <Form.Control.Feedback type="invalid">
          {errores_campos.descripcion_producto}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="precio_producto">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="precio_producto"
              value={valores.precio_producto}
              onChange={manejar_cambio}
              isInvalid={!!errores_campos.precio_producto}
            />
            <Form.Control.Feedback type="invalid">
              {errores_campos.precio_producto}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="stock_producto">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              step="1"
              name="stock_producto"
              value={valores.stock_producto}
              onChange={manejar_cambio}
              isInvalid={!!errores_campos.stock_producto}
            />
            <Form.Control.Feedback type="invalid">
              {errores_campos.stock_producto}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="categoria_producto">
        <Form.Label>Categoria</Form.Label>
        <Form.Control
          type="text"
          name="categoria_producto"
          value={valores.categoria_producto}
          onChange={manejar_cambio}
          isInvalid={!!errores_campos.categoria_producto}
        />
        <Form.Control.Feedback type="invalid">
          {errores_campos.categoria_producto}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="imagen_producto">
        <Form.Label>URL de la imagen</Form.Label>
        <Form.Control
          type="text"
          name="imagen_producto"
          value={valores.imagen_producto}
          onChange={manejar_cambio}
          isInvalid={!!errores_campos.imagen_producto}
        />
        <Form.Control.Feedback type="invalid">
          {errores_campos.imagen_producto}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex gap-2 justify-content-end">
        <Button variant="outline-secondary" onClick={onCancelar} disabled={esta_guardando}>
          Cancelar
        </Button>
        <Button variant="warning" type="submit" disabled={esta_guardando}>
          {esta_guardando ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </Form>
  )
}

export default FormularioProducto
