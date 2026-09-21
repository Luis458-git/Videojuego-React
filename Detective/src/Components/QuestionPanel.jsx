import { useState } from 'react'
import Icon from './Icon'
export default function QuestionPanel({ question, onAnswer, number, total, feedback }) {
  const [selected, setSelected] = useState('')
  return <section className="question-panel surface-card"><div className="panel-heading"><Icon name="bulb" /><h2>Deducción crítica</h2><span className="tag lavender">FASE {number}/{total}</span></div>
    <form onSubmit={event => { event.preventDefault(); if (selected) onAnswer(question.id, selected) }}>
      <fieldset><legend><small className="cyan">PREGUNTA CLAVE DEL DETECTIVE:</small><strong>{question.title}</strong></legend><div className="question-options">{question.options.map((option, index) => <label className={`answer-option ${selected === option.id ? 'chosen' : ''}`} key={option.id}><input type="radio" name={question.id} value={option.id} checked={selected === option.id} onChange={() => setSelected(option.id)} /><span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{option.text}</span></label>)}</div></fieldset>
      {feedback && <p className="answer-feedback" role="status">{feedback}</p>}
      <button className="button purple full-width" disabled={!selected} type="submit"><Icon name="shield" /> Confirmar conclusión forense</button>
    </form>
  </section>
}
