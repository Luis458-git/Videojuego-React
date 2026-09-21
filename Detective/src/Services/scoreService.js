import { request } from './api'

export const getScores = (signal) => request('/scores', { signal })

// Un id por partida evita duplicados al reintentar después de un fallo de red.
export async function saveScore(result) {
  try {
    return await request(`/scores/${encodeURIComponent(result.id)}`)
  } catch (error) {
    if (error.status !== 404) throw error
  }
  return request('/scores', { method: 'POST', body: JSON.stringify(result) })
}
