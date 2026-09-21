import { useCallback, useEffect, useRef, useState } from 'react'
import { GameContext } from '../Context/GameContext'
import { newGame, toResult, updateGame } from '../Services/gameRules'
import { readStorage, writeStorage } from '../Services/storage'
import { saveScore } from '../Services/scoreService'
import { sendResultToN8n } from '../Services/n8nService'

export default function GameProvider({ children }) {
  const [player, setPlayerState] = useState(() => readStorage('dino-player', 'Agente Marcos'))
  const [game, setGame] = useState(() => {
    const saved = readStorage('dino-game')
    return saved?.caseData?.questions?.length && saved?.id ? updateGame(saved, { type: 'tick' }) : null
  })
  const [saving, setSaving] = useState({ id: '', status: 'idle', error: '', webhook: '' })
  const savingId = useRef(null)

  useEffect(() => { writeStorage('dino-game', game) }, [game])
  useEffect(() => { writeStorage('dino-player', player) }, [player])
  useEffect(() => {
    if (game?.status !== 'playing') return
    const timer = setInterval(() => setGame(current => updateGame(current, { type: 'tick' })), 500)
    return () => clearInterval(timer)
  }, [game?.status, game?.id])

  const persistResult = useCallback(async (finished) => {
    if (savingId.current === finished.id) return
    savingId.current = finished.id
    setSaving({ id: finished.id, status: 'saving', error: '', webhook: '' })
    const result = toResult(finished)
    try {
      await saveScore(result)
      setSaving({ id: finished.id, status: 'saved', error: '', webhook: '' })
      if (readStorage(`dino-n8n-${finished.id}`)) return
      try {
        const response = await sendResultToN8n(result)
        if (response.configured) {
          writeStorage(`dino-n8n-${finished.id}`, true)
          if (response.message) setSaving(current => ({ ...current, webhook: response.message }))
        } else {
          setSaving(current => ({ ...current, webhook: 'n8n no esta configurado: agrega VITE_N8N_WEBHOOK_URL al archivo .env y reinicia Vite.' }))
        }
      } catch (error) {
        setSaving(current => ({ ...current, webhook: error.message }))
      }
    } catch (error) {
      setSaving({ id: finished.id, status: 'error', error: error.message, webhook: '' })
    } finally {
      savingId.current = null
    }
  }, [])

  useEffect(() => {
    if (game && game.status !== 'playing') {
      // Se difiere para que StrictMode pueda cancelar su primera ejecución de prueba.
      const timer = setTimeout(() => persistResult(game), 0)
      return () => clearTimeout(timer)
    }
  }, [game, persistResult])

  const startGame = useCallback((caseData, restart = false) => {
    setGame(current => !restart && current?.caseId === caseData.id
      ? current : newGame(caseData, player.trim() || 'Detective Novato'))
  }, [player])
  const act = useCallback(action => setGame(current => updateGame(current, action)), [])
  function setPlayer(name) { setPlayerState(name.slice(0, 30)) }
  return <GameContext.Provider value={{ game, player, setPlayer, startGame, act, saving, retrySave: () => game && persistResult(game) }}>{children}</GameContext.Provider>
}
