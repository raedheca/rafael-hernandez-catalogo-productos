import { Form, InputGroup } from 'react-bootstrap'
import { FaMagnifyingGlass } from 'react-icons/fa6'

const BarraBusqueda = ({ termino_busqueda, set_termino_busqueda }) => {
  return (
    <InputGroup className="mb-4">
      <InputGroup.Text className="bg-white">
        <FaMagnifyingGlass className="text-secondary" />
      </InputGroup.Text>
      <Form.Control
        type="search"
        placeholder="Buscar por nombre o categoria..."
        value={termino_busqueda}
        onChange={(evento) => set_termino_busqueda(evento.target.value)}
        aria-label="Buscar productos"
      />
    </InputGroup>
  )
}

export default BarraBusqueda
