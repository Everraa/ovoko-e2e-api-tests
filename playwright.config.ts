import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 60_000,
  expect: {
    timeout: 30_000,
    toHaveScreenshot: {
      pathTemplate: '{testDir}/e2e/visuals/{arg}-{projectName}-{platform}{ext}',
    },
  },
  use: {
    baseURL: env.BASE_URL,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    headless: !!process.env.CI,
    testIdAttribute: 'data-test-id',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: env.PETSTORE_BASE_URL,
      },
    },
    {
      name: 'chromium',
      testIgnore: /tests\/api\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /tests\/api\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /tests\/api\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
  ],
  outputDir: path.join('test-results'),
});
