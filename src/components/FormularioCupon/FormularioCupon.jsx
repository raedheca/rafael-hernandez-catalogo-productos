import { useState } from 'react'
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap'

const valores_iniciales_vacios = {
  codigo_cupon: '',
  tipo_descuento: 'porcentaje',
  valor_descuento: '',
  fecha_vencimiento: '',
  activo: true,
}

const FormularioCupon = ({ cupon = null, onGuardar, onCancelar }) => {
  const [valores, set_valores] = useState(
    cupon
      ? {
          codigo_cupon: cupon.codigo_cupon ?? '',
          tipo_descuento: cupon.tipo_descuento ?? 'porcentaje',
          valor_descuento: cupon.valor_descuento ?? '',
          fecha_vencimiento: cupon.fecha_vencimiento ?? '',
          activo: cupon.activo ?? true,
        }
      : valores_iniciales_vacios
  )
  const [errores_campos, set_errores_campos] = useState({})
  const [esta_guardando, set_esta_guardando] = useState(false)
  const [mensaje_error, set_mensaje_error] = useState(null)

  const manejar_cambio = (evento) => {
    const { name, value, type, checked } = evento.target
    set_valores((valores_actuales) => ({
      ...valores_actuales,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validar = () => {
    const errores = {}

    if (!valores.codigo_cupon.trim()) {
      errores.codigo_cupon = 'El codigo es obligatorio.'
    } else if (/\s/.test(valores.codigo_cupon.trim())) {
      errores.codigo_cupon = 'El codigo no puede tener espacios.'
    }

    const valor_numerico = Number(valores.valor_descuento)
    if (!valores.valor_descuento || Number.isNaN(valor_numerico) || valor_numerico <= 0) {
      errores.valor_descuento = 'El valor debe ser un numero mayor a 0.'
    } else if (valores.tipo_descuento === 'porcentaje' && valor_numerico > 100) {
      errores.valor_descuento = 'El porcentaje no puede ser mayor a 100.'
    }

    set_errores_campos(errores)
    return Object.keys(errores).length === 0
  }

  const manejar_envio = async (evento) => {
    evento.preventDefault()
    set_mensaje_error(null)

    if (!validar()) return

    const datos_cupon = {
      codigo_cupon: valores.codigo_cupon.trim().toUpperCase(),
      tipo_descuento: valores.tipo_descuento,
      valor_descuento: Number(valores.valor_descuento),
      fecha_vencimiento: valores.fecha_vencimiento || null,
      activo: valores.activo,
    }

    set_esta_guardando(true)
    try {
      await onGuardar(datos_cupon)
    } catch (error) {
      set_mensaje_error(error.message)
    } finally {
      set_esta_guardando(false)
    }
  }

  return (
    <Form noValidate onSubmit={manejar_envio}>
      {mensaje_error && <Alert variant="danger">{mensaje_error}</Alert>}

      <Form.Group className="mb-3" controlId="codigo_cupon">
        <Form.Label>Codigo</Form.Label>
        <Form.Control
          type="text"
          name="codigo_cupon"
          value={valores.codigo_cupon}
          onChange={manejar_cambio}
          className="text-uppercase"
          isInvalid={!!errores_campos.codigo_cupon}
        />
        <Form.Control.Feedback type="invalid">
          {errores_campos.codigo_cupon}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="tipo_descuento">
            <Form.Label>Tipo de descuento</Form.Label>
            <Form.Select
              name="tipo_descuento"
              value={valores.tipo_descuento}
              onChange={manejar_cambio}
            >
              <option value="porcentaje">Porcentaje</option>
              <option value="monto_fijo">Monto fijo</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="valor_descuento">
            <Form.Label>
              Valor {valores.tipo_descuento === 'porcentaje' ? '(%)' : '($)'}
            </Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="valor_descuento"
              value={valores.valor_descuento}
              onChange={manejar_cambio}
              isInvalid={!!errores_campos.valor_descuento}
            />
            <Form.Control.Feedback type="invalid">
              {errores_campos.valor_descuento}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="fecha_vencimiento">
        <Form.Label>Fecha de vencimiento (opcional)</Form.Label>
        <Form.Control
          type="date"
          name="fecha_vencimiento"
          value={valores.fecha_vencimiento}
          onChange={manejar_cambio}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="activo">
        <Form.Check
          type="switch"
          name="activo"
          label="Cupon activo"
          checked={valores.activo}
          onChange={manejar_cambio}
        />
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

export default FormularioCupon
