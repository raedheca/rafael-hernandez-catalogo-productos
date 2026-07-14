import { Helmet } from '@dr.pogodin/react-helmet'

const NOMBRE_SITIO = 'RafuShop'

const Seo = ({ titulo, descripcion }) => {
  return (
    <Helmet>
      <title>{titulo ? `${titulo} | ${NOMBRE_SITIO}` : NOMBRE_SITIO}</title>
      {descripcion && <meta name="description" content={descripcion} />}
    </Helmet>
  )
}

export default Seo
