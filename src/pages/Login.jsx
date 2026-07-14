import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'
import Seo from '../components/Seo/Seo.jsx'

const email_es_valido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const Login = () => {
  const { iniciar_sesion } = useAuth()
  const navigate = useNavigate()
  const ubicacion = useLocation()

  const [email, set_email] = useState('')
  const [password, set_password] = useState('')
  const [errores_campos, set_errores_campos] = useState({})
  const [mensaje_error, set_mensaje_error] = useState(null)
  const [esta_enviando, set_esta_enviando] = useState(false)

  const ruta_destino = ubicacion.state?.desde?.pathname ?? '/'

  const validar = () => {
    const errores = {}
    if (!email_es_valido(email)) {
      errores.email = 'Ingresa un email valido.'
    }
    if (password.length < 6) {
      errores.password = 'La contrasena debe tener al menos 6 caracteres.'
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
      await iniciar_sesion(email, password)
      navigate(ruta_destino, { replace: true })
    } catch (error) {
      set_mensaje_error(error.message)
    } finally {
      set_esta_enviando(false)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Seo
        titulo="Iniciar sesion"
        descripcion="Inicia sesion en tu cuenta de RafuShop para gestionar el catalogo."
      />
      <Card className="border-0 shadow-sm" style={{ maxWidth: '420px', width: '100%' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Iniciar sesion</h2>

          {mensaje_error && <Alert variant="danger">{mensaje_error}</Alert>}

          <Form noValidate onSubmit={manejar_envio}>
            <Form.Group className="mb-3" controlId="login_email">
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

            <Form.Group className="mb-4" controlId="login_password">
              <Form.Label>Contrasena</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(evento) => set_password(evento.target.value)}
                isInvalid={!!errores_campos.password}
                autoComplete="current-password"
              />
              <Form.Control.Feedback type="invalid">
                {errores_campos.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100" disabled={esta_enviando}>
              {esta_enviando ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </Form>

          <p className="text-center small text-secondary mt-3 mb-0">
            No tenes cuenta todavia? <Link to="/registro">Registrate</Link>
          </p>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login
