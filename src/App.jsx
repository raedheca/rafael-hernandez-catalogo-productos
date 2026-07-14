import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Bienvenida from './pages/Bienvenida.jsx'
import Productos from './pages/Productos.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import Carrito from './pages/Carrito.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Admin from './pages/Admin.jsx'
import RutaProtegida from './components/RutaProtegida/RutaProtegida.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Bienvenida />} />
        <Route path="productos" element={<Productos />} />
        <Route path="producto/:id_producto" element={<ProductoDetalle />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route
          path="admin"
          element={
            <RutaProtegida>
              <Admin />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
