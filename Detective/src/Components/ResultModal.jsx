import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import useGame from '../Hooks/useGame'
import { getRank } from '../Services/gameRules'
import Icon from './Icon'
export default function ResultModal({ game }) {
  const dialog = useRef(null)
  const { saving, retrySave } = useGame()
  useEffect(() => { dialog.current?.showModal() }, [])
  return <dialog ref={dialog} className="result-modal" aria-labelledby="result-title" onCancel={event => event.preventDefault()}><span className="eyebrow">● AMENAZA NEUTRALIZADA // EXPEDIENTE RESUELTO</span><Icon name="trophy" size={52} /><h2 id="result-title">¡Caso resuelto!</h2><p>{game.caseData.title}</p><div className="result-score">{game.score} <small>PTS</small></div><p className="lavender">{getRank(game.score)}</p><p>{game.inspected.length} evidencias · {game.errors} errores · {game.hints.length} pistas</p><p role="status">{saving.status === 'saved' ? 'Puntuación guardada en la agencia.' : saving.status === 'error' ? saving.error : 'Guardando puntuación…'}</p>{saving.status === 'error' && <button className="button secondary" onClick={retrySave}>Reintentar guardado</button>}{saving.webhook && <><p role="status">{saving.webhook}</p><button className="button secondary" onClick={retrySave}>Reintentar envío a n8n</button></>}<div className="hero-actions"><Link className="button primary" to="/leaderboard">Ver ranking</Link><Link className="button secondary" to="/cases">Elegir otro caso</Link><Link className="button secondary" to="/game-over">Resumen</Link></div></dialog>
}
