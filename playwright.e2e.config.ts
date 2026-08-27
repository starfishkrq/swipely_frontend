import { defineConfig, devices } from "@playwright/test";
import { dirname } from "path";
import { fileURLToPath } from "url";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
const configDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],
  ],
  use: {
    baseURL,
    headless: true,
    locale: "en-US",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    cwd: configDir,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
