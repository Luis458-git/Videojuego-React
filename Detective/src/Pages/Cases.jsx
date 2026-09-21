import { useState } from 'react'
import CaseCard from '../Components/CaseCard'
import StatusPanel from '../Components/StatusPanel'
import useResource from '../Hooks/useResource'
import useGame from '../Hooks/useGame'
import { getCases } from '../Services/caseService'
import '../Styles/cases.css'
export default function Cases() {
  const resource = useResource(getCases)
  const { player, setPlayer } = useGame()
  const [difficulty, setDifficulty] = useState('Todas')
  const [search, setSearch] = useState('')
  const visible = (resource.data || []).filter(item => (difficulty === 'Todas' || item.difficulty === difficulty) && item.title.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')))
  return <main id="contenido" className="container page-shell">
    <span className="eyebrow">● AGENCIA CENTRAL // ARCHIVO DE INVESTIGACIONES</span><h1 className="page-title">Elige tu próximo <span className="cyan">expediente</span></h1><p className="page-intro">Cada pista cuenta. Selecciona una misión, examina sus evidencias y resuelve el misterio antes de que termine el tiempo.</p>
    <section className="case-controls surface-card" aria-label="Preparar investigación"><label>IDENTIFICACIÓN DEL DETECTIVE<input value={player} onChange={event => setPlayer(event.target.value)} maxLength={30} placeholder="Tu nombre de detective" /></label><label>BUSCAR EXPEDIENTE<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Título del caso…" /></label><label>DIFICULTAD<select value={difficulty} onChange={event => setDifficulty(event.target.value)}>{['Todas','Fácil','Media','Difícil'].map(value => <option key={value}>{value}</option>)}</select></label></section>
    <StatusPanel {...resource} onRetry={resource.reload} /><div className="case-grid">{visible.map(item => <CaseCard key={item.id} caseData={item} />)}</div>{!resource.loading && !resource.error && !visible.length && <p className="empty-state">No hay expedientes que coincidan con tu búsqueda.</p>}
    <div className="case-notice surface-card"><h2>Protocolo de campo</h2><p>+100 por evidencia nueva · +200 por respuesta correcta · −50 por error o pista · +300 al resolver el caso.</p><p>Dos conclusiones incorrectas o el tiempo agotado cierran la investigación. Puedes reintentarlo desde el resultado.</p></div>
  </main>
}
