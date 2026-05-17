import { NavLink } from 'react-router-dom'
import Icono from '../Icono/Icono.jsx'

const NavBar = () => {
  const get_nav_class = ({ isActive }) =>
    'nav-link text-white' + (isActive ? ' active fw-semibold' : '')

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary shadow-sm">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav_principal"
          aria-controls="nav_principal"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav_principal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" end className={get_nav_class}>
                <Icono name="house" className="me-1" />
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/productos" className={get_nav_class}>
                <Icono name="bag" className="me-1" />
                Productos
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
