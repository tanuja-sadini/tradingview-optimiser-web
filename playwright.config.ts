import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  reporter: 'list',

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  expect: {
    timeout: 15000,
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
