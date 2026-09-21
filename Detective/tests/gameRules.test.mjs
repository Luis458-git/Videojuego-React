import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { newGame, updateGame, toResult, getRank } from '../src/Services/gameRules.js'
const { cases } = JSON.parse(readFileSync(new URL('../db.json', import.meta.url), 'utf8'))

test('cada evidencia suma una sola vez y las pistas se limitan a dos', () => {
  let game = newGame(cases[0], 'Prueba', 1000, 'test')
  game = updateGame(game, { type: 'inspect', id: 'email' }, 2000)
  game = updateGame(game, { type: 'inspect', id: 'email' }, 3000)
  assert.equal(game.score, 100)
  for (let i = 0; i < 3; i++) game = updateGame(game, { type: 'hint' }, 4000)
  assert.equal(game.hints.length, 2)
  assert.equal(game.score, 0)
})
test('dos errores terminan la partida y no admiten más puntuación', () => {
  let game = newGame(cases[0], 'Prueba', 1000, 'test')
  for (let i = 0; i < 2; i++) game = updateGame(game, { type: 'answer', questionId: 'q1', optionId: 'b' }, 2000)
  assert.equal(game.status, 'lost')
  assert.equal(game.errors, 2)
  assert.equal(game.score, 0)
  assert.deepEqual(updateGame(game, { type: 'inspect', id: 'email' }, 3000), game)
})
test('el reloj vence aunque la pestaña haya estado inactiva', () => {
  const game = newGame(cases[0], 'Prueba', 1000, 'test')
  const expired = updateGame(game, { type: 'answer', questionId: 'q1', optionId: 'a' }, 182000)
  assert.equal(expired.status, 'lost')
  assert.equal(expired.reason, 'Tiempo agotado')
  assert.equal(expired.score, 0)
})
for (const data of cases) test(`caso ${data.id}: se resuelve, suma bonus una vez y genera resultado`, () => {
  let game = newGame(data, 'Prueba', 1000, `test-${data.id}`)
  for (const evidence of data.evidence) game = updateGame(game, { type: 'inspect', id: evidence.id }, 2000)
  for (const question of data.questions) game = updateGame(game, { type: 'answer', questionId: question.id, optionId: question.correct }, 5000)
  assert.equal(game.status, 'won')
  assert.equal(game.score, 1300)
  const result = toResult(game)
  assert.equal(result.time, 4)
  assert.equal(result.caseId, data.id)
  assert.equal(result.status, 'won')
  assert.equal(result.rank, getRank(1300))
})
test('una respuesta repetida de una pregunta anterior no afecta la siguiente', () => {
  const action = { type: 'answer', questionId: 'q1', optionId: 'a' }
  let game = newGame(cases[0], 'Prueba', 1000, 'test')
  game = updateGame(game, action, 2000)
  const repeated = updateGame(game, action, 2000)
  assert.equal(repeated.answers.length, 1)
  assert.equal(repeated.score, 200)
})
