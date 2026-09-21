import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://127.0.0.1:5174',
    browserName: 'chromium',
    channel: 'msedge',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: [
    { command: 'node tests/api.cjs', url: 'http://127.0.0.1:3002/cases', reuseExistingServer: false },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174', reuseExistingServer: false,
      env: { VITE_API_URL: 'http://127.0.0.1:3002', VITE_N8N_WEBHOOK_URL: '' },
    },
  ],
})
