const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

export async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: options.signal || AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('No se pudo conectar con la agencia. Comprueba que la API esté disponible e inténtalo otra vez.', { cause: error })
  }
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'No se encontró el expediente solicitado.' : `La agencia no pudo procesar la solicitud (${response.status}).`)
    error.status = response.status
    throw error
  }
  return response.json()
}
