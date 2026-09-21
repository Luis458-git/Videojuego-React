// La instancia y el workflow se configuran mediante VITE_N8N_WEBHOOK_URL.
export async function sendResultToN8n(result) {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL
  if (!url) return { configured: false }

  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
      signal: AbortSignal.timeout(10000),
    })
  } catch (error) {
    throw new Error('No se pudo conectar con el webhook de n8n. Comprueba que n8n este en ejecucion y que la URL sea correcta.', { cause: error })
  }
  if (!response.ok) throw new Error('La puntuacion esta guardada, pero n8n no pudo recibirla.')

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null
  return { configured: true, message: data?.message || data?.status || '' }
}
