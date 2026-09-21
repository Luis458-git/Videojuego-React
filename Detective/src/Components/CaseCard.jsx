import { Link } from 'react-router-dom'
import Icon from './Icon'
export default function CaseCard({ caseData }) {
  return <article className={`case-card ${caseData.tone}`}>
    <div className="case-meta"><span>CASO #{caseData.id}</span><span>DIFICULTAD: {caseData.difficulty}</span></div>
    <h3>{caseData.title}</h3><small>MODALIDAD: {caseData.category}</small><p>{caseData.description}</p>
    <div className="case-tags">{caseData.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    <div className="case-bottom"><small>TIEMPO LÍMITE<br /><b>{caseData.duration / 60} MIN · +300 BONUS</b></small><Link className="button secondary" to={`/case/${caseData.id}`}>Investigar <Icon name="arrow" size={16} /></Link></div>
  </article>
}
