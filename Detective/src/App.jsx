import { BrowserRouter } from 'react-router-dom'
import GameProvider from './Components/GameProvider'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import AppRoutes from './Routes/AppRoutes'
import './Styles/home.css'

export default function App() {
  return <BrowserRouter><GameProvider>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Navbar /><AppRoutes /><Footer />
  </GameProvider></BrowserRouter>
}
