import { test, expect } from '@playwright/test'

test('partida completa: evidencias, pista, tablero, victoria y guardado único', async ({ page, request }) => {
  await page.goto('/cases')
  await page.getByLabel('IDENTIFICACIÓN DEL DETECTIVE').fill('Prueba Victoria')
  await page.getByRole('link', { name: 'Investigar' }).first().click()
  await expect(page.getByRole('heading', { name: 'CASO #001: El Correo Misterioso' })).toBeVisible()
  for (const name of ['Correo Sospechoso','Cabeceras del Mensaje','Enlace Señuelo (Redirect)','Perfil del Remitente']) {
    await page.locator('.evidence-list').getByRole('button', { name: new RegExp(name.replace(/[()]/g, '\\$&')) }).click()
  }
  await page.locator('.evidence-list').getByRole('button', { name: /Correo Sospechoso/ }).click()
  await expect(page.locator('.hud-grid')).toContainText('400 PTS')
  await page.getByRole('button', { name: /Solicitar pista táctica/ }).click()
  await expect(page.locator('.hud-grid')).toContainText('350 PTS')
  await page.locator('.view-switch').getByRole('link', { name: 'Tablero de evidencias' }).click()
  await expect(page.locator('.board-node')).toHaveCount(4)
  await page.getByLabel('Vectores de ataque (rojo)').uncheck()
  await expect(page.locator('.thread.attack')).toHaveCount(0)
  await page.locator('.view-switch').getByRole('link', { name: 'Estación de trabajo' }).click()
  for (const answer of ['El dominio del remitente no corresponde al dominio oficial del banco.','SPF falla y no existe firma DKIM.','Reportar phishing y verificar la cuenta desde el canal oficial.']) {
    await page.getByLabel(answer, { exact: true }).check()
    await page.getByRole('button', { name: 'Confirmar conclusión forense' }).click()
  }
  await expect(page.getByRole('dialog')).toContainText('¡Caso resuelto!')
  await expect(page.getByRole('dialog')).toContainText('1250')
  await expect(page.getByRole('dialog')).toContainText('Puntuación guardada')
  const game = await page.evaluate(() => JSON.parse(localStorage.getItem('dino-game')))
  await page.reload()
  await expect(page.getByRole('dialog')).toContainText('Puntuación guardada')
  const scores = await (await request.get('http://127.0.0.1:3002/scores')).json()
  expect(scores.filter(score => score.id === game.id)).toHaveLength(1)
  await page.getByRole('link', { name: 'Ver ranking', exact: true }).click()
  await page.getByRole('searchbox', { name: 'Buscar detective' }).fill('Prueba Victoria')
  await expect(page.locator('tbody')).toContainText('Prueba Victoria')
})

test('derrota por errores y reintento reinician tiempo, respuestas y puntuación', async ({ page }) => {
  await page.goto('/case/001')
  for (let index = 0; index < 2; index++) {
    await page.getByLabel('El mensaje contiene el nombre del cliente.', { exact: true }).check()
    await page.getByRole('button', { name: 'Confirmar conclusión forense' }).click()
  }
  await expect(page).toHaveURL(/game-over/)
  await expect(page.getByRole('heading', { name: 'GAME OVER', exact: true })).toBeVisible()
  await expect(page.locator('.failure-reason')).toContainText('Conclusión crítica incorrecta')
  await expect(page.locator('.save-status')).toContainText('Resultado guardado')
  await page.getByRole('button', { name: 'Reintentar investigación' }).click()
  await expect(page.locator('.hud-grid')).toContainText('0 PTS')
  await expect(page.locator('.hud-grid')).toContainText('0/2 ERRORES')
  await expect(page.locator('.question-panel')).toContainText('FASE 1/3')
})

test('derrota por tiempo y restauración del reloj al recargar', async ({ page }) => {
  await page.clock.install()
  await page.goto('/case/001')
  await expect(page.getByRole('timer')).toBeVisible()
  await page.clock.fastForward(30000)
  await page.reload()
  await expect(page.getByRole('timer')).not.toContainText('03:00')
  await page.clock.fastForward(181000)
  await expect(page).toHaveURL(/game-over/)
  await expect(page.locator('.failure-reason')).toContainText('Tiempo agotado')
})

test('API fallida muestra error recuperable y expediente desconocido muestra 404', async ({ page }) => {
  await page.route('http://127.0.0.1:3002/cases', route => route.abort())
  await page.goto('/cases')
  await expect(page.getByRole('alert')).toContainText('No se pudo conectar')
  await page.unroute('http://127.0.0.1:3002/cases')
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click()
  await expect(page.locator('.case-card')).toHaveCount(3)
  await page.goto('/case/no-existe')
  await expect(page.getByRole('alert')).toContainText('No se encontró')
})

test('guardado fallido se puede reintentar sin perder el resultado', async ({ page }) => {
  await page.route('http://127.0.0.1:3002/scores', route => route.request().method() === 'POST' ? route.abort() : route.continue())
  await page.goto('/case/001')
  for (let index = 0; index < 2; index++) {
    await page.getByLabel('El mensaje contiene el nombre del cliente.', { exact: true }).check()
    await page.getByRole('button', { name: 'Confirmar conclusión forense' }).click()
  }
  await expect(page.getByRole('button', { name: 'Reintentar guardado' })).toBeVisible()
  await page.unroute('http://127.0.0.1:3002/scores')
  await page.getByRole('button', { name: 'Reintentar guardado' }).click()
  await expect(page.locator('.save-status')).toContainText('Resultado guardado')
})

for (const width of [375, 768, 1440]) test(`pantallas sin desbordes a ${width}px y navegación móvil`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const path of ['/', '/cases', '/case/001', '/case/001/board', '/instructions', '/leaderboard', '/game-over']) {
    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
    await page.waitForTimeout(200)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
    expect(overflow, `Desborde en ${path}`).toBe(false)
    const images = await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))
    expect(images, `Imágenes en ${path}`).toBe(true)
    if (width === 1440 || width === 375) await page.screenshot({ path: `test-results/screens/${width}-${path.replaceAll('/', '_') || 'home'}.png`, fullPage: true })
  }
  if (width < 1100) {
    await page.getByRole('button', { name: 'Menú', exact: true }).click()
    await page.getByRole('navigation').getByRole('link', { name: 'Manual de instrucciones' }).click()
    await expect(page).toHaveURL(/instructions/)
  }
  expect(errors).toEqual([])
})
