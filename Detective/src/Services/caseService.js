import { request } from './api'

export const getCases = (signal) => request('/cases', { signal })
export const getCase = (id, signal) => request(`/cases/${encodeURIComponent(id)}`, { signal })
