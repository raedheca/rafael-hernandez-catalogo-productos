import { NavLink, useNavigate } from 'react-router-dom'
import { Badge, Container, Nav, Navbar } from 'react-bootstrap'
import {
  FaCartShopping,
  FaHouse,
  FaBagShopping,
  FaRightToBracket,
  FaRightFromBracket,
} from 'react-icons/fa6'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCarrito } from '../../context/CarritoContext.jsx'

const NavBar = () => {
  const { usuario, cerrar_sesion } = useAuth()
  const { cantidad_total } = useCarrito()
  const navigate = useNavigate()

  const get_nav_class = ({ isActive }) =>
    'nav-link text-white' + (isActive ? ' active fw-semibold' : '')

  const manejar_cerrar_sesion = async () => {
    await cerrar_sesion()
    navigate('/')
  }

  return (
    <Navbar expand="lg" variant="dark" bg="secondary" className="shadow-sm">
      <Container>
        <Navbar.Toggle aria-controls="nav_principal" />
        <Navbar.Collapse id="nav_principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end className={get_nav_class}>
              <FaHouse className="me-1" />
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/productos" className={get_nav_class}>
              <FaBagShopping className="me-1" />
              Productos
            </Nav.Link>
          </Nav>

          <Nav className="align-items-lg-center gap-lg-3">
            <Nav.Link as={NavLink} to="/carrito" className={get_nav_class}>
              <FaCartShopping className="me-1" />
              Carrito
              {cantidad_total > 0 && (
                <Badge bg="warning" text="dark" pill className="ms-1">
                  {cantidad_total}
                </Badge>
              )}
            </Nav.Link>

            {usuario ? (
              <>
                <Nav.Link as={NavLink} to="/admin" className={get_nav_class}>
                  Admin
                </Nav.Link>
                <span className="nav-link text-white-50 small d-none d-lg-inline">
                  {usuario.email}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={manejar_cerrar_sesion}
                >
                  <FaRightFromBracket className="me-1" />
                  Cerrar sesion
                </button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login" className={get_nav_class}>
                <FaRightToBracket className="me-1" />
                Iniciar sesion
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
