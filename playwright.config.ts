import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  reporter: 'list',

  use: {
    baseURL: process.env.BASE_URL ?? 'https://tradingviewoptimizer.com',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
