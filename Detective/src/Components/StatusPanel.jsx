export default function StatusPanel({ loading, error, onRetry }) {
  if (loading) return <div className="status-panel" role="status"><span className="loading-dot" /> Conectando con la agencia…</div>
  if (error) return <div className="status-panel error-panel" role="alert"><h2>Conexión interrumpida</h2><p>{error}</p>{onRetry && <button className="button primary" onClick={onRetry}>Reintentar</button>}</div>
  return null
}
