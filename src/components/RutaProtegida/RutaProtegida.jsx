import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext.jsx'

// IMPORTANTE: esto es solo una proteccion de UX (evita mostrar pantallas a
// usuarios sin sesion). La seguridad real vive en las reglas de Firestore
// (`allow write: if request.auth != null`), no aca.
const RutaProtegida = ({ children }) => {
  const { usuario, cargando_auth } = useAuth()
  const ubicacion = useLocation()

  if (cargando_auth) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" role="status">
          <span className="visually-hidden">Verificando sesion...</span>
        </Spinner>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ desde: ubicacion }} replace />
  }

  return children
}

export default RutaProtegida
