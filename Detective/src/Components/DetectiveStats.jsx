import { getRank } from '../Services/gameRules'
export default function DetectiveStats({ name, score, solved, total, loading }) {
  const progress = total > 0 ? Math.round(solved / total * 100) : 0
  return <section className="detective-stats" aria-label="Estado del detective" aria-busy={loading}>
    <div className="stats-top"><div><strong>{name}</strong><small>RANGO: {getRank(score)}</small></div><div><small>PUNTOS XP</small><b className="yellow">{loading ? '…' : score.toLocaleString('es')}</b></div><div><small>RESOLUCIÓN</small><b className="cyan">{loading ? '…' : `${solved}/${total}`}</b></div></div>
    <div className="progress-label"><span>PROGRESO DE CASOS TEMPORADA 01</span><span>{progress}% COMPLETADO</span></div><progress value={solved} max={total || 1} aria-label="Casos resueltos" /><div className="progress-label"><span className="pompoms" aria-hidden="true"><i /><i /><i /><i /><i /></span><span>INSIGNIAS DE LA AGENCIA</span></div>
  </section>
}
