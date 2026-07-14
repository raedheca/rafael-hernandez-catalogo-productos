import { Pagination } from 'react-bootstrap'

const Paginador = ({ pagina_actual, total_paginas, set_pagina_actual }) => {
  if (total_paginas <= 1) return null

  const paginas = Array.from({ length: total_paginas }, (_, indice) => indice + 1)

  return (
    <Pagination className="justify-content-center mt-4">
      <Pagination.Prev
        disabled={pagina_actual === 1}
        onClick={() => set_pagina_actual(pagina_actual - 1)}
      />
      {paginas.map((numero_pagina) => (
        <Pagination.Item
          key={numero_pagina}
          active={numero_pagina === pagina_actual}
          onClick={() => set_pagina_actual(numero_pagina)}
        >
          {numero_pagina}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={pagina_actual === total_paginas}
        onClick={() => set_pagina_actual(pagina_actual + 1)}
      />
    </Pagination>
  )
}

export default Paginador
