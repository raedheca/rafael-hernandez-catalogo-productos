import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import NavBar from './NavBar.jsx'
import Footer from './Footer.jsx'

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <NavBar />
      <main className="flex-grow-1 py-4">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
