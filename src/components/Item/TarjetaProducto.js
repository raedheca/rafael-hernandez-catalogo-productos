import styled from 'styled-components'
import { Card } from 'react-bootstrap'

// Envoltorio con styled-components sobre Card de react-bootstrap: agrega un
// hover sutil (sombra + leve elevacion) manteniendo la paleta actual.
const TarjetaProducto = styled(Card)`
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.1) !important;
  }
`

export default TarjetaProducto
