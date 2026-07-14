import ItemList from '../components/ItemList/ItemList.jsx'
import Seo from '../components/Seo/Seo.jsx'

const Productos = () => {
  return (
    <>
      <Seo
        titulo="Productos"
        descripcion="Explora el catalogo completo de productos de RafuShop."
      />
      <ItemList titulo_seccion="Catalogo de Productos" />
    </>
  )
}

export default Productos
