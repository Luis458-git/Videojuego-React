import Icon from './Icon'
export default function EvidenceCard({ evidence, active, inspected, onInspect }) {
  return <button className={`evidence-card ${active ? 'selected' : ''}`} onClick={() => onInspect(evidence.id)} aria-pressed={active}><Icon name={evidence.kind} /><span><strong>{evidence.title}</strong><small>{evidence.code}</small></span><span className={inspected ? 'green' : 'muted'} aria-label={inspected ? 'Inspeccionada' : 'Sin inspeccionar'}>{inspected ? '✓' : '→'}</span></button>
}
