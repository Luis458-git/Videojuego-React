import Icon from './Icon'
export default function Timer({ seconds }) {
  const value = Math.max(0, seconds)
  const formatted = `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`
  return <div className={`hud-stat timer-stat ${value <= 30 ? 'urgent' : ''}`} role="timer" aria-label={`Tiempo restante: ${formatted}`}><Icon name="clock" /><div><small>TIEMPO RESTANTE</small><strong>{formatted}</strong></div></div>
}
