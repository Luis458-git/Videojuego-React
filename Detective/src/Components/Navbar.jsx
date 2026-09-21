import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useGame from '../Hooks/useGame'
import Icon from './Icon'
import badge from '../assets/images/dino-badge.png'
import '../Styles/navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { game, player } = useGame()
  const { pathname } = useLocation()
  const active = game?.caseId || '001'
  const links = [ ['/', 'Inicio'], [`/case/${active}`, 'Estación de trabajo'], ['/cases', 'Expedientes'], [`/case/${active}/board`, 'Tablero de evidencias'], ['/leaderboard', 'Top detectives'], ['/instructions', 'Manual de instrucciones'] ]
  const inCase = pathname.startsWith('/case/')
  return <header className="site-header"><div className="nav-shell">
    <Link className="brand" to="/" onClick={() => setOpen(false)}><img src={badge} alt="" width="48" height="48" /><span><strong>DINO<br />DETECTIVE</strong><small>SMALL DINO. BIG MYSTERIES.</small></span></Link>
    <span className="pompoms" aria-label="Cinco pompones de la agencia"><i /><i /><i /><i /><i /></span>
    <button className="menu-toggle button secondary" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? 'Cerrar menú' : 'Menú'}</button>
    <nav id="main-nav" className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">{links.map(([to, label]) => <NavLink end key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav>
    <span className="nav-player"><Icon name="user" /><span>DETECTIVE<br /><b>{player || 'NOVATO'}</b></span></span>
    <Link className={`button ${inCase ? 'secondary' : 'purple'} new-case`} to="/cases">{inCase ? 'Salir del caso' : 'Nuevo caso'}</Link>
  </div></header>
}
