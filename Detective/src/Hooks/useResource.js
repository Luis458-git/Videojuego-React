import { useEffect, useState } from 'react'

export default function useResource(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    loader(controller.signal).then(data => {
      if (!controller.signal.aborted) setState({ data, loading: false, error: '' })
    }).catch(error => {
      if (!controller.signal.aborted) setState({ data: null, loading: false, error: error.message })
    })
    return () => controller.abort()
  }, [loader, attempt])
  function reload() {
    setState({ data: null, loading: true, error: '' })
    setAttempt(value => value + 1)
  }
  return { ...state, reload }
}
