import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getScores } from '../Services/scoreService'
import { getRank } from '../Services/gameRules'
import useResource from '../Hooks/useResource'
import useGame from '../Hooks/useGame'
import StatusPanel from '../Components/StatusPanel'
import Icon from '../Components/Icon'
import gold from '../assets/images/rank-gold.png'
import silver from '../assets/images/rank-silver.png'
import bronze from '../assets/images/rank-bronze.png'
import avatar from '../assets/images/player-avatar.png'
import '../Styles/leaderboard.css'

export default function Leaderboard() {
  const resource = useResource(getScores)
  const { player } = useGame()
  const [season, setSeason] = useState('01')
  const [difficulty, setDifficulty] = useState('Todas')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  // useMemo evita reagrupar y ordenar el historial al abrir un dossier o paginar.
  const ranking = useMemo(() => {
    const grouped = new Map()
    for (const score of resource.data || []) {
      if ((season !== 'all' && score.season !== season) || (difficulty !== 'Todas' && score.difficulty !== difficulty)) continue
      const item = grouped.get(score.player) || { name: score.player, score: 0, solved: 0, errors: 0, attempts: 0, demo: true }
      item.score += score.score
      item.solved += score.solvedCases || Number(score.status === 'won')
      item.errors += score.errors || 0
      item.attempts += 1
      item.demo = item.demo && score.demo === true
      grouped.set(score.player, item)
    }
    return [...grouped.values()].sort((a,b) => b.score - a.score || a.name.localeCompare(b.name)).map((item,index) => ({ ...item, position: index + 1 }))
  }, [resource.data, season, difficulty])
  const filtered = ranking.filter(item => item.name.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')))
  const rows = filtered.slice(page * 7, page * 7 + 7)
  const myRecords = (resource.data || []).filter(item => item.player === player && !item.demo)
  const myScore = myRecords.reduce((total,item) => total + item.score, 0)
  const podium = [ranking[1],ranking[0],ranking[2]].filter(Boolean)
  function filter(setter, value) { setter(value); setPage(0); setSelected(null) }
  return <main id="contenido" className="container page-shell leaderboard-page">
    <span className="eyebrow">● AGENCIA FORENSE DIGITAL // SALÓN DE LA FAMA // NODO NEO_PANGEA_77</span><div className="ranking-heading"><div><span className="tag">PROTOCOLO SQUISH / HUD 04</span><h1 className="page-title">Top detectives <span className="cyan">//</span><br /><span className="lavender">Ranking global</span></h1><p className="page-intro">Clasificación de agentes en la resolución de incidentes cibernéticos y cibercrímenes en Neo-Pangea.</p></div><div className="ranking-totals"><div><small>DETECTIVES REGISTRADOS</small><strong className="cyan">{ranking.length}</strong></div><div><small>CASOS RESUELTOS</small><strong className="yellow">{ranking.reduce((sum,item) => sum + item.solved,0)}</strong></div></div></div>
    <div className="ranking-filters"><div className="case-filters" role="group" aria-label="Temporada"><button aria-pressed={season === '01'} onClick={() => filter(setSeason, '01')}>Temporada 1 (actual)</button><button aria-pressed={season === 'all'} onClick={() => filter(setSeason, 'all')}>Histórico</button></div><label>DIFICULTAD <select value={difficulty} onChange={event => filter(setDifficulty,event.target.value)}>{['Todas','Fácil','Media','Difícil'].map(item => <option key={item}>{item}</option>)}</select></label><button className="button secondary" onClick={resource.reload}>Actualizar ranking</button></div>
    <StatusPanel {...resource} onRetry={resource.reload} />
    {!resource.loading && !resource.error && <><p className="demo-note">Los perfiles marcados «Ejemplo» pertenecen a la maqueta de la agencia. Tus partidas guardadas aparecen en esta misma clasificación.</p><div className="podium">{podium.map(item => <article key={item.name} className={`podium-card place-${item.position}`}><span className="podium-place">{item.position}º LUGAR // {['ORO','PLATA','BRONCE'][item.position-1]}</span><div className="podium-top"><Icon name="trophy" size={30} /><span className="tag">{item.demo ? 'EJEMPLO' : 'DETECTIVE ACTIVO'}</span></div><img src={[gold,silver,bronze][item.position-1]} alt={`Dinosaurio detective del puesto ${item.position}`} /><h2>{item.name}</h2><small>RANGO: {getRank(item.score)}</small><div className="podium-stats"><div><small>PUNTUACIÓN TOTAL</small><strong>{item.score.toLocaleString('es')} <small>PTS</small></strong></div><div><small>CASOS RESUELTOS</small><strong>{item.solved}</strong></div></div><button className={`button ${item.position === 1 ? 'purple' : 'secondary'} full-width`} onClick={() => setSelected(item)}>Ver dossier forense</button></article>)}</div>{!ranking.length && <p className="empty-state">No hay puntuaciones para estos filtros. Resuelve un caso para inaugurar el ranking.</p>}
    {selected && <section className="surface-card dossier" aria-live="polite"><div><span className="eyebrow">EXPEDIENTE DEL DETECTIVE</span><h2>{selected.name}</h2><p>{getRank(selected.score)} · {selected.solved} casos resueltos · {selected.score.toLocaleString('es')} puntos</p><small>{selected.demo ? 'Registro de ejemplo de la agencia.' : `${selected.attempts} partidas registradas en esta clasificación.`}</small></div><button className="button secondary" onClick={() => setSelected(null)}>Cerrar dossier</button></section>}
    <section className="ranking-table surface-card"><div className="table-heading"><div><h2>Matriz de registro // Posiciones</h2><small>HISTORIAL DE RESULTADOS DE LA AGENCIA</small></div><label><span className="sr-only">Buscar detective</span><input type="search" placeholder="Buscar agente…" value={query} onChange={event => filter(setQuery,event.target.value)} /></label></div><div className="table-scroll"><table><thead><tr><th>Posición</th><th>Detective</th><th>Insignia pompones</th><th>Casos resueltos</th><th>Puntuación total</th><th>Registro</th><th>Acciones</th></tr></thead><tbody>{rows.map(item => <tr key={item.name} className={item.name === player ? 'my-row' : ''}><td>#{String(item.position).padStart(2,'0')}</td><td><strong>{item.name}</strong><small>{getRank(item.score)}</small></td><td><span className="pompoms" aria-label="Insignia de la agencia"><i /><i /><i /><i /><i /></span></td><td>{item.solved} casos</td><td className="cyan">{item.score.toLocaleString('es')} PTS</td><td>{item.demo ? 'Ejemplo' : 'Guardado'}</td><td><button className="icon-button" onClick={() => setSelected(item)} aria-label={`Ver dossier de ${item.name}`}><Icon name="search" size={16} /></button></td></tr>)}</tbody></table></div>{!rows.length && <p className="empty-state">No se encontraron detectives.</p>}<div className="pagination"><small>{filtered.length} DETECTIVES · PÁGINA {page + 1} DE {Math.max(1,Math.ceil(filtered.length / 7))}</small><button onClick={() => setPage(value => value-1)} disabled={page === 0}>Anterior</button><button onClick={() => setPage(value => value+1)} disabled={(page+1)*7 >= filtered.length}>Siguiente</button></div></section></>}
    <section className="personal-stats surface-card"><img src={avatar} alt="Avatar del detective" /><div><span className="eyebrow">EXPEDIENTE PERSONAL // {player}</span><h2>Estado de rendimiento</h2><p>{myScore.toLocaleString('es')} PTS · {getRank(myScore)}</p><small>{myRecords.filter(item => item.status === 'won').length} resoluciones · {myRecords.reduce((sum,item) => sum + item.hints,0)} pistas solicitadas</small></div><Link className="button primary" to="/cases">Jugar para subir en el ranking <Icon name="arrow" /></Link></section>
  </main>
}
