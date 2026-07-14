import { Link } from 'react-router-dom'
import { FaBagShopping } from 'react-icons/fa6'

const Header = () => {
  return (
    <div className="header_container bg-dark text-white py-2">
      <div className="container d-flex justify-content-between align-items-center">
        <Link
          to="/"
          className="text-decoration-none text-white fw-bold fs-5 d-inline-flex align-items-center"
        >
          <FaBagShopping size={20} className="me-2" />
          RafuShop
        </Link>
        <small className="text-white d-none d-md-block">
          Envios a todo el pais | Atencion 24/7
        </small>
      </div>
    </div>
  )
}

export default Header
