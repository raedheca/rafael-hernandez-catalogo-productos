import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'
import Seo from '../components/Seo/Seo.jsx'

const email_es_valido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const Registro = () => {
  const { registrar_usuario } = useAuth()
  const navigate = useNavigate()

  const [email, set_email] = useState('')
  const [password, set_password] = useState('')
  const [confirmar_password, set_confirmar_password] = useState('')
  const [errores_campos, set_errores_campos] = useState({})
  const [mensaje_error, set_mensaje_error] = useState(null)
  const [esta_enviando, set_esta_enviando] = useState(false)

  const validar = () => {
    const errores = {}
    if (!email_es_valido(email)) {
      errores.email = 'Ingresa un email valido.'
    }
    if (password.length < 6) {
      errores.password = 'La contrasena debe tener al menos 6 caracteres.'
    }
    if (confirmar_password !== password) {
      errores.confirmar_password = 'Las contrasenas no coinciden.'
    }
    set_errores_campos(errores)
    return Object.keys(errores).length === 0
  }

  const manejar_envio = async (evento) => {
    evento.preventDefault()
    set_mensaje_error(null)

    if (!validar()) return

    set_esta_enviando(true)
    try {
      await registrar_usuario(email, password)
      navigate('/', { replace: true })
    } catch (error) {
      set_mensaje_error(error.message)
    } finally {
      set_esta_enviando(false)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Seo
        titulo="Crear cuenta"
        descripcion="Crea una cuenta en RafuShop para acceder al panel de administracion."
      />
      <Card className="border-0 shadow-sm" style={{ maxWidth: '420px', width: '100%' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Crear cuenta</h2>

          {mensaje_error && <Alert variant="danger">{mensaje_error}</Alert>}

          <Form noValidate onSubmit={manejar_envio}>
            <Form.Group className="mb-3" controlId="registro_email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(evento) => set_email(evento.target.value)}
                isInvalid={!!errores_campos.email}
                autoComplete="email"
              />
              <Form.Control.Feedback type="invalid">
                {errores_campos.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registro_password">
              <Form.Label>Contrasena</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(evento) => set_password(evento.target.value)}
                isInvalid={!!errores_campos.password}
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {errores_campos.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="registro_confirmar_password">
              <Form.Label>Confirmar contrasena</Form.Label>
              <Form.Control
                type="password"
                value={confirmar_password}
                onChange={(evento) => set_confirmar_password(evento.target.value)}
                isInvalid={!!errores_campos.confirmar_password}
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {errores_campos.confirmar_password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100" disabled={esta_enviando}>
              {esta_enviando ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Creando cuenta...
                </>
              ) : (
                'Registrarme'
              )}
            </Button>
          </Form>

          <p className="text-center small text-secondary mt-3 mb-0">
            Ya tenes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Registro
