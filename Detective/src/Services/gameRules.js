export const POINTS = { answer: 200, evidence: 100, error: 50, hint: 50, bonus: 300 }
export const MAX_ERRORS = 2

export function getRank(score) {
  if (score >= 6000) return 'Leyenda Élite Prehistórica'
  if (score >= 3500) return 'Ciber-Maestro Rex'
  if (score >= 1500) return 'Detective de Asalto'
  if (score >= 500) return 'Rastreador de Huellas'
  return 'Novato Forense'
}

export function newGame(caseData, player, now = Date.now(), id = crypto.randomUUID()) {
  return {
    id, caseId: caseData.id, caseData, player, status: 'playing',
    score: 0, errors: 0, answers: [], inspected: [], hints: [],
    activeEvidence: caseData.evidence[0].id, startedAt: now,
    deadline: now + caseData.duration * 1000, remaining: caseData.duration,
    log: [{ id: 'start', text: 'Expediente abierto. Investigación iniciada.', time: now }],
  }
}

export function updateGame(game, action, now = Date.now()) {
  if (!game || game.status !== 'playing') return game
  const remaining = Math.max(0, Math.ceil((game.deadline - now) / 1000))
  if (remaining === 0) return { ...game, remaining: 0, status: 'lost', reason: 'Tiempo agotado', endedAt: now }
  const current = { ...game, remaining }
  const log = (id, text) => [...game.log, { id, text, time: now }]
  if (action.type === 'tick') return current
  if (action.type === 'inspect') {
    if (!game.caseData.evidence.some(item => item.id === action.id)) return current
    const already = game.inspected.includes(action.id)
    return { ...current, activeEvidence: action.id,
      inspected: already ? game.inspected : [...game.inspected, action.id],
      score: game.score + (already ? 0 : POINTS.evidence),
      log: already ? game.log : log(`evidence-${action.id}`, `Evidencia inspeccionada: ${game.caseData.evidence.find(item => item.id === action.id).title}`),
    }
  }
  if (action.type === 'hint') {
    if (game.hints.length >= game.caseData.hints.length) return current
    return { ...current, score: Math.max(0, game.score - POINTS.hint),
      hints: [...game.hints, game.caseData.hints[game.hints.length]],
      log: log(`hint-${game.hints.length}`, 'Pista táctica solicitada (−50 puntos).'),
    }
  }
  if (action.type === 'answer') {
    const question = game.caseData.questions[game.answers.length]
    if (!question || action.questionId !== question.id || !question.options.some(option => option.id === action.optionId)) return current
    if (question.correct !== action.optionId) {
      const errors = game.errors + 1
      return { ...current, errors, score: Math.max(0, game.score - POINTS.error),
        status: errors >= MAX_ERRORS ? 'lost' : 'playing',
        reason: errors >= MAX_ERRORS ? 'Conclusión crítica incorrecta' : '',
        endedAt: errors >= MAX_ERRORS ? now : undefined,
        feedback: 'La evidencia contradice esa conclusión. Revisa las pistas antes de responder otra vez.',
        log: log(`error-${errors}`, 'Deducción incorrecta (−50 puntos).'),
      }
    }
    const answers = [...game.answers, { questionId: question.id, optionId: action.optionId }]
    const won = answers.length === game.caseData.questions.length
    return { ...current, answers, feedback: 'Deducción validada. +200 puntos.',
      status: won ? 'won' : 'playing', score: game.score + POINTS.answer + (won ? POINTS.bonus : 0),
      endedAt: won ? now : undefined, log: log(`answer-${question.id}`, `Deducción validada: ${question.title}`),
    }
  }
  return current
}

export function toResult(game) {
  const answered = game.answers.length + game.errors
  const accuracy = answered ? Number(((game.answers.length / answered) * 100).toFixed(1)) : 0
  return {
    id: game.id, player: game.player, caseId: game.caseId, title: game.caseData.title,
    score: game.score, solvedCases: game.status === 'won' ? 1 : 0, accuracy,
    errors: game.errors, hints: game.hints.length,
    time: Math.round(((game.endedAt || game.startedAt) - game.startedAt) / 1000),
    status: game.status, difficulty: game.caseData.difficulty,
    date: new Date(game.endedAt || game.startedAt).toISOString(), season: '01',
    rank: getRank(game.score), demo: false,
  }
}
