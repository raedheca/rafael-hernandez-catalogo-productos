import { Link } from 'react-router-dom'
import Icono from '../components/Icono/Icono.jsx'

const equipo = [
  {
    id_persona: 1,
    nombre_persona: 'Rafael Hernandez',
    rol_persona: 'Fundador y CEO',
    descripcion_persona:
      'Apasionado por el comercio electronico y la atencion al cliente. Lidera la vision de RafuShop.',
    imagen_persona: 'https://stardewvalleywiki.com/mediawiki/images/3/31/Clint.png'
  },
  {
    id_persona: 2,
    nombre_persona: 'Lucia Gomez',
    rol_persona: 'Encargada de Logistica',
    descripcion_persona:
      'Coordina envios a todo el pais y se asegura de que cada pedido llegue en tiempo y forma.',
    imagen_persona: 'https://stardewvalleywiki.com/mediawiki/images/1/1b/Haley.png'
  },
  {
    id_persona: 3,
    nombre_persona: 'Martin Diaz',
    rol_persona: 'Soporte al Cliente',
    descripcion_persona:
      'Disponible 24/7 para responder consultas y acompanar a cada cliente en su compra.',
    imagen_persona: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-A_19AuefHMxTC2m0VaobaCKS2t1RRcyce3FH&s=0',
  },
]

const Bienvenida = () => {
  return (
    <section>
      <div className="text-center py-4 mb-4">
        <h1 className="fw-bold">Bienvenido a RafuShop</h1>
        <p className="text-secondary mb-3">
          Tu tienda online con los mejores productos seleccionados.
        </p>
        <Link to="/productos" className="btn btn-outline-warning">
          <Icono name="bag" className="me-2" />
          Ver catalogo
        </Link>
      </div>

      <h2 className="h4 mb-3">Nuestro equipo</h2>
      <div className="row g-4">
        {equipo.map((persona) => (
          <div className="col-md-4" key={persona.id_persona}>
            <div className="card border-0 shadow-sm h-100 text-center">
              <img
                src={persona.imagen_persona}
                alt={persona.nombre_persona}
                className="rounded-circle border border-4 border-primary object-fit-cover d-block mx-auto mt-4"
                style={{ width: '140px', height: '140px' }}
              />
              <div className="card-body">
                <h5 className="card-title mb-1">{persona.nombre_persona}</h5>
                <span className="badge bg-primary mb-2">
                  {persona.rol_persona}
                </span>
                <p className="card-text text-muted small">
                  {persona.descripcion_persona}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Bienvenida
