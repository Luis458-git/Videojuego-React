import { useState } from 'react'
import { Link } from 'react-router-dom'
import rex from '../assets/images/rex-board.png'
import Icon from './Icon'

const types = { correlation: 'Hilos de correlación', attack: 'Vectores de ataque (rojo)', validated: 'Pistas validadas (verde)' }
export default function EvidenceBoard({ game, onInspect }) {
  const [filters, setFilters] = useState({ correlation: true, attack: true, validated: true })
  const [zoom, setZoom] = useState(false)
  const inspected = game.caseData.evidence.find(item => item.id === game.activeEvidence)
  return <>
    <div className="board-layout"><section className="board-workspace" aria-label="Mapa de conexiones forenses">
      <div className="board-toolbar"><span className="eyebrow">● TABLERO TÁCTIL // MATRIZ CORK-01</span><button onClick={() => setZoom(!zoom)} className="tool-action">{zoom ? 'Recentrar' : 'Zoom +'}</button></div>
      <div className="board-scroll"><div className={`board-canvas ${zoom ? 'zoomed' : ''}`}>
        <svg className="board-threads" viewBox="0 0 800 640" preserveAspectRatio="none" aria-hidden="true">{game.caseData.evidence.map((item, index) => filters[item.connection] && <path key={item.id} className={`thread ${item.connection}`} d={['M400 320 Q200 330 175 125', 'M400 320 Q590 340 625 125', 'M400 320 Q180 400 175 520', 'M400 320 Q600 410 625 520'][index]} />)}</svg>
        <div className="board-root"><span className="pin yellow" /><small className="yellow">EXPEDIENTE RAÍZ #{game.caseId}</small><h3>{game.caseData.title}</h3><span className="tag cyan">{game.inspected.length} / {game.caseData.evidence.length} INSPECCIONADAS</span></div>
        {game.caseData.evidence.map((item, index) => <button key={item.id} className={`board-node node-${index} ${item.connection} ${game.activeEvidence === item.id ? 'selected' : ''}`} onClick={() => onInspect(item.id)} aria-pressed={game.activeEvidence === item.id}><span className="pin" /><small>{item.code}</small><strong>{item.title}</strong><p>{item.summary}</p><span className="tag">{game.inspected.includes(item.id) ? '✓ COMPROBADA' : 'INSPECCIONAR →'}</span></button>)}
      </div></div><div className="board-legend"><span className="cyan">━ HILO CORRELACIÓN</span><span className="pink">━ VECTOR ATAQUE</span><span className="green">━ PISTA VALIDADA</span></div>
    </section><aside className="board-sidebar"><section className="surface-card"><div className="panel-heading"><img className="rex-avatar" src={rex} alt="Rex" /><div><h2>Detective Rex</h2><small className="cyan">ESPECIALISTA EN CIBERDELITOS BLANDOS</small></div></div><blockquote>“¡Mira cómo se conectan los hilos! Inspecciona cada nodo y contrasta las pistas. Una buena deducción necesita evidencias.”</blockquote><Link className="button purple full-width" to={`/case/${game.caseId}`}><Icon name="board" /> Emitir deducción final</Link></section><section className="surface-card"><h2>Filtros de hilos</h2>{Object.entries(types).map(([key, label]) => <label className="thread-filter" key={key}><span>{label}</span><input type="checkbox" checked={filters[key]} onChange={() => setFilters(current => ({ ...current, [key]: !current[key] }))} /></label>)}</section><section className="surface-card"><small className="muted">NODO INSPECCIONADO</small><h2>{inspected.title}</h2><p>{game.inspected.includes(inspected.id) ? inspected.detail : 'Selecciona el nodo para examinar su evidencia.'}</p><span className="eyebrow">ESTADO: {game.inspected.includes(inspected.id) ? 'COMPROBADO' : 'PENDIENTE'}</span></section></aside></div>
    <section className="timeline"><h2>Bitácora forense // Timeline de evidencias</h2><div className="timeline-grid">{game.log.map(entry => <article className="surface-card" key={entry.id}><small className="cyan">{new Date(entry.time).toLocaleTimeString('es')}</small><p>{entry.text}</p><small className="green">● REGISTRADO</small></article>)}</div></section>
  </>
}
