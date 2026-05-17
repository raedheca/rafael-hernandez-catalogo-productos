import Icono from '../Icono/Icono.jsx'

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-4 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6">
            <h6 className="text-warning fw-bold mb-2">
              <Icono name="shop" size={18} className="me-2" />
              RafuShop
            </h6>
            <p className="small text-white-50 mb-0">
              Tienda online de productos seleccionados. Calidad, precios accesibles
              y atencion personalizada para todo el pais.
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <h6 className="text-warning fw-bold mb-2">Contacto</h6>
            <ul className="list-unstyled small text-white-50 mb-0">
              <li>Direccion: Av. Siempre Viva 1234, CABA</li>
              <li>Telefono: +54 11 5555-1234</li>
              <li>Email: contacto@rafushop.com</li>
              <li>Horario: Lun a Vie de 9 a 18 hs</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-3" />

        <div className="text-center small text-white-50">
          &copy; {new Date().getFullYear()} RafuShop. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer
