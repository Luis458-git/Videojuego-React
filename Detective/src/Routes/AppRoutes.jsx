import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from '../Pages/Home'
import Cases from '../Pages/Cases'
import Investigation from '../Pages/Investigation'
import Leaderboard from '../Pages/Leaderboard'
import Instructions from '../Pages/Instructions'
import GameOver from '../Pages/GameOver'

export default function AppRoutes() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cases" element={<Cases />} />
    <Route path="/case/:id/*" element={<Investigation />} />
    <Route path="/leaderboard" element={<Leaderboard />} />
    <Route path="/instructions" element={<Instructions />} />
    <Route path="/game-over" element={<GameOver />} />
    <Route path="*" element={<main id="contenido" className="container page-shell"><h1>Expediente no encontrado</h1><p>Esta dirección no pertenece a la agencia.</p><Link to="/cases" className="button primary">Volver a expedientes</Link></main>} />
  </Routes>
}
