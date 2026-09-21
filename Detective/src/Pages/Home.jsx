import { useState } from 'react'
import { Link } from 'react-router-dom'
import office from '../assets/images/dino-office.png'
import CaseCard from '../Components/CaseCard'
import DetectiveStats from '../Components/DetectiveStats'
import DinoAssistant from '../Components/DinoAssistant'
import StatusPanel from '../Components/StatusPanel'
import Icon from '../Components/Icon'
import useResource from '../Hooks/useResource'
import useGame from '../Hooks/useGame'
import { getCases } from '../Services/caseService'
import { getScores } from '../Services/scoreService'

const equipment = [
  { name: 'Lupa Cuántica', icon: 'search', label: 'INSPECCIÓN DE PÍXELES Y METADATOS', text: 'Examina correos electrónicos para detectar errores tipográficos y direcciones sospechosas.', tone: 'cyan' },
  { name: 'Descifrador Cuántico', icon: 'shield', label: 'DESEMPAQUETADOR HEXADECIMAL', text: 'Busca pistas en mensajes ocultos y analiza las contraseñas del expediente.', tone: 'lavender' },
  { name: 'Analizador IMAP', icon: 'file', label: 'RASTREO DE SERVIDORES RELAY', text: 'Inspecciona las cabeceras del correo y sus resultados de autenticación.', tone: 'yellow' },
  { name: 'Biolab de Peluche', icon: 'bulb', label: 'SENSOR TÁCTIL ANTIESTRÉS', text: 'Una pausa junto a Rex y sus pompones para observar cada evidencia con atención.', tone: 'pink' },
]
export default function Home() {
  const [filter, setFilter] = useState('Todos')
  const cases = useResource(getCases)
  const scores = useResource(getScores)
  const { player } = useGame()
  const records = (scores.data || []).filter(item => item.player === player && !item.demo)
  const total = records.reduce((sum, item) => sum + item.score, 0)
  const solved = new Set(records.filter(item => item.status === 'won').map(item => item.caseId)).size
  const visible = (cases.data || []).filter(item => filter === 'Todos' || item.category === filter)
  return <main id="contenido" tabIndex={-1}>
    <div className="agency-strip"><span>● AGENCIA CENTRAL DE CIBERINVESTIGACIÓN // NEO-PANGEA [TERMINAL_SEC_07]</span><span>CANAL ENCRIPTADO 256-BIT · MONITOREO ACTIVO</span></div>
    <section className="home-hero container" aria-labelledby="hero-title"><div className="hero-copy">
      <span className="eyebrow pill"><Icon name="shield" size={16} /> CASO DESTACADO #001 ACTIVO</span>
      <h1 id="hero-title">DINO <span>DETECTIVE</span></h1><p className="hero-tagline">Small Dino. Big Mysteries. <span className="pompoms" aria-hidden="true"><i /><i /><i /><i /><i /></span></p>
      <p className="hero-description">La megalópolis de Neo-Pangea está sumergida en sombras digitales y ciberataques sigilosos. Analiza paquetes de datos cifrados, rastrea remitentes fraudulentos, examina archivos binarios sospechosos y ayuda al detective más tierno, blandito y sagaz a resolver los enigmas de la red.</p>
      <div className="hero-actions"><Link className="button primary" to="/case/001"><Icon name="search" /> Iniciar investigación (jugar)</Link><Link className="button secondary" to="/cases"><Icon name="folder" /> Expedientes</Link><Link className="button secondary" to="/leaderboard"><Icon name="trophy" /> Ranking global</Link></div>
      {scores.error ? <StatusPanel error={scores.error} onRetry={scores.reload} /> : <DetectiveStats name={player} score={total} solved={solved} total={cases.data?.length || 3} loading={scores.loading} />}
    </div><div className="hero-scene"><figure className="office-frame"><figcaption><span>● ● ●</span> SALA FORENSE // SECTOR 07 [EN VIVO]</figcaption><div className="office-image"><img src={office} alt="Rex de peluche investiga en su escritorio cyber-noir." width="1024" height="768" fetchPriority="high" /><span className="scene-badge">◎ DETECTIVE REX // EN TURNO</span></div></figure><DinoAssistant message="¡Ponte la gabardina, novato! Hay un correo malicioso intentando vulnerar la red bancaria central. ¿Listo para examinar las evidencias y rastrear las cabeceras?" voice /></div></section>
    <section id="expedientes" className="case-section" aria-labelledby="cases-title"><div className="container"><div className="section-heading"><div><span className="eyebrow">● TERMINAL DE CASOS ABIERTOS</span><h2 id="cases-title">Modos de juego &amp; expedientes rápidos</h2><p>Selecciona un caso pendiente para cargar las bitácoras forenses en tu estación de trabajo táctica.</p></div><div className="case-filters" role="group" aria-label="Filtrar por modalidad">{['Todos', 'Phishing', 'Malware', 'Encriptación'].map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === 'Todos' && cases.data ? ` (${cases.data.length})` : ''}</button>)}</div></div><StatusPanel {...cases} onRetry={cases.reload} /><div className="case-grid">{visible.map(item => <CaseCard key={item.id} caseData={item} />)}</div></div></section>
    <section id="herramientas" className="tools-section container" aria-labelledby="tools-title"><span className="eyebrow lavender">● EQUIPAMIENTO DE TERRENO Y LABORATORIO</span><h2 id="tools-title">Herramientas forenses disponibles</h2><div className="tools-grid">{equipment.map(tool => <article className={`tool-card ${tool.tone}`} key={tool.name}><span className="tool-symbol"><Icon name={tool.icon} size={28} /></span><h3>{tool.name}</h3><small>{tool.label}</small><p>{tool.text}</p><Link to="/instructions">Consultar protocolo →</Link></article>)}</div></section>
    <div className="agency-strip"><span>● BITÁCORA DE LA AGENCIA</span><span>OBSERVA · CONTRASTA · DEDUCE · RESUELVE</span></div>
  </main>
}
