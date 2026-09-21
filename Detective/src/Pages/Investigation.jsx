import { useCallback, useEffect } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import useResource from '../Hooks/useResource'
import useGame from '../Hooks/useGame'
import { getCase } from '../Services/caseService'
import { MAX_ERRORS } from '../Services/gameRules'
import StatusPanel from '../Components/StatusPanel'
import Timer from '../Components/Timer'
import EvidenceCard from '../Components/EvidenceCard'
import QuestionPanel from '../Components/QuestionPanel'
import DinoAssistant from '../Components/DinoAssistant'
import ResultModal from '../Components/ResultModal'
import EvidenceBoard from '../Components/EvidenceBoard'
import Icon from '../Components/Icon'
import office from '../assets/images/dino-office.png'
import '../Styles/investigation.css'

export default function Investigation() {
  const { id } = useParams()
  const load = useCallback(signal => getCase(id, signal), [id])
  return <InvestigationLoader key={id} load={load} />
}
function InvestigationLoader({ load }) {
  const resource = useResource(load)
  const { game, startGame, act } = useGame()
  const { pathname } = useLocation()
  useEffect(() => {
    if (!resource.data) return
    const timer = setTimeout(() => startGame(resource.data), 0)
    return () => clearTimeout(timer)
  }, [resource.data, startGame])
  if (resource.loading || resource.error) return <main id="contenido" className="container page-shell"><StatusPanel {...resource} onRetry={resource.reload} /><Link to="/cases">Volver a expedientes</Link></main>
  if (!game || game.caseId !== resource.data.id) return <main id="contenido" className="container page-shell"><StatusPanel loading /></main>
  if (game.status === 'lost') return <Navigate to="/game-over" replace />
  const data = game.caseData
  const evidence = data.evidence.find(item => item.id === game.activeEvidence) || data.evidence[0]
  const question = data.questions[game.answers.length]
  const board = pathname.endsWith('/board')
  const inspect = id => act({ type: 'inspect', id })
  return <main id="contenido" className="investigation-page container">
    <section className="case-hud surface-card"><div className="panel-heading"><Icon name="folder" size={30} /><div><span className="eyebrow">EXPEDIENTE ACTIVO / FORENSE DIGITAL</span><h1>CASO #{data.id}: {data.title}</h1></div></div><div className="hud-grid"><Timer seconds={game.remaining} /><div className="hud-stat lavender"><Icon name="trophy" /><div><small>PUNTUACIÓN</small><strong>{game.score} PTS</strong></div></div><div className="hud-stat cyan"><Icon name="search" /><div><small>EVIDENCIAS</small><strong>{game.inspected.length} / {data.evidence.length} DETECTADAS</strong></div></div><div className="hud-stat threat"><Icon name="warning" /><div><small>NIVEL DE AMENAZA</small><strong>{game.errors ? 'CRÍTICO' : 'EN INVESTIGACIÓN'} // {game.errors}/{MAX_ERRORS} ERRORES</strong></div></div></div></section>
    <div className="view-switch"><Link className={`button ${board ? 'secondary' : 'primary'}`} to={`/case/${data.id}`}><Icon name="file" /> Estación de trabajo</Link><Link className={`button ${board ? 'primary' : 'secondary'}`} to={`/case/${data.id}/board`}><Icon name="board" /> Tablero de evidencias</Link></div>
    {board ? <EvidenceBoard game={game} onInspect={inspect} /> : <div className="workstation-grid">
      <aside className="case-sidebar"><section className="surface-card evidence-list"><div className="panel-heading"><Icon name="folder" /><h2>Expedientes del caso</h2><small>{data.evidence.length} ARCHIVOS</small></div>{data.evidence.map(item => <EvidenceCard key={item.id} evidence={item} active={item.id === evidence.id} inspected={game.inspected.includes(item.id)} onInspect={inspect} />)}</section>
        <section className="surface-card hint-panel"><span className="pompoms" aria-hidden="true"><i /><i /><i /><i /><i /></span><DinoAssistant message="¡Detecto algo sospechoso! Contrasta las evidencias antes de emitir tu conclusión." /><button className="button warning-button full-width" disabled={game.hints.length >= data.hints.length || game.status !== 'playing'} onClick={() => act({ type: 'hint' })}><Icon name="bulb" /> Solicitar pista táctica (−50 pts)</button><div aria-live="polite">{data.hints.map((hint, index) => <div className={`hint-note ${index >= game.hints.length ? 'locked' : ''}`} key={index}><small>PISTA {index + 1}: {index < game.hints.length ? 'DESBLOQUEADA' : 'BLOQUEADA'}</small><p>{index < game.hints.length ? hint : 'Solicita una pista a Rex para revelar este dato.'}</p></div>)}</div></section>
      </aside>
      <section className="terminal surface-card" aria-label="Visor de evidencia"><div className="terminal-bar"><span className="window-dots">● ● ●</span><strong>TERMINAL FORENSE // INSPECTOR V4.2</strong></div><div className="evidence-display" key={evidence.id}>{evidence.type === 'email' ? <><div className="email-headers"><small>DE:</small><strong>{evidence.sender}</strong><span className="tag pink">DOMINIO PENDIENTE DE VALIDACIÓN</span><p>PARA: {evidence.recipient}</p><p>ASUNTO: <b className="yellow">{evidence.subject}</b></p></div><div className="email-body"><h2>Sistema bancario global</h2><small>COMUNICADO AUTOMATIZADO DE SEGURIDAD</small><p>{evidence.content}</p><div className="urgency-banner"><Icon name="warning" /> ACCIÓN REQUERIDA INMEDIATA: 15 MINUTOS</div><div className="phish-link"><span>ENLACE DEL MENSAJE · SIMULACIÓN</span><button onClick={() => inspect('url')}>[ VERIFICAR CUENTA AHORA ]</button><code>Destino: bank-security.example/login-phish</code></div></div></> : <><span className="eyebrow">{evidence.code}</span><h2>{evidence.title}</h2><pre>{evidence.content}</pre><div className="forensic-note"><Icon name="search" /><p>{evidence.summary}</p></div></>}
        <div className="forensic-tools"><small className="cyan">HERRAMIENTAS FORENSES INTERACTIVAS:</small><div>{data.evidence.map(item => <button key={item.id} className="tool-action" onClick={() => inspect(item.id)}><Icon name={item.kind} size={16} />{item.type === 'email' ? 'Inspeccionar correo' : item.title}</button>)}</div><p role="status" className="terminal-status">{game.inspected.includes(evidence.id) ? `✓ EVIDENCIA REGISTRADA · ${evidence.detail}` : 'SISTEMA LISTO. Selecciona el archivo o una herramienta para inspeccionar y registrar la evidencia.'}</p></div></div>
      </section>
      <aside className="deduction-column">{question && <QuestionPanel key={`${question.id}-${game.errors}`} question={question} number={game.answers.length + 1} total={data.questions.length} feedback={game.feedback} onAnswer={(questionId, optionId) => act({ type: 'answer', questionId, optionId })} />}<figure className="rex-monitor"><img src={office} alt="Rex supervisa la investigación desde la central." /><figcaption>HABITACIÓN 04 // CENTRAL <span>EN LÍNEA</span></figcaption></figure></aside>
    </div>}
    {game.status === 'won' && <ResultModal game={game} />}
  </main>
}
