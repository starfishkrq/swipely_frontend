/**
 * Core navigation e2e suite.
 *
 * Covers the journeys described in issue #261:
 *   – Landing page loads and links to the Dashboard
 *   – Dashboard page renders without application errors
 *   – Navigation to Bridges renders the page heading
 *   – Navigation to Watchlist renders the page heading
 *   – A primary data page (Analytics) renders without application errors
 *
 * Selectors are role/text-based throughout to stay resilient to cosmetic changes.
 */

import { test, expect, type Page, type ConsoleMessage } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Known infrastructure console errors that are expected in CI where no backend
 * server is running. These are not application bugs — they are network-level
 * failures caused by the absence of the API/WebSocket backend.
 */
const INFRA_ERROR_PATTERNS: RegExp[] = [
  /WebSocket connection.*failed/i,
  /ERR_CONNECTION_REFUSED/i,
  /Failed to load resource.*500/i,
  /net::ERR_/i,
];

function isInfraError(msg: string): boolean {
  return INFRA_ERROR_PATTERNS.some((re) => re.test(msg));
}

/** Collect application-level console errors (not infra noise) while running an action. */
function collectAppErrors(page: Page): () => string[] {
  const errors: string[] = [];
  const handler = (msg: ConsoleMessage) => {
    if (msg.type() === "error" && !isInfraError(msg.text())) {
      errors.push(msg.text());
    }
  };
  page.on("console", handler);
  return () => {
    page.off("console", handler);
    return errors;
  };
}

/**
 * Stub all API endpoints so the app renders without network errors or
 * indefinite loading states. Uses a catch-all pattern so every /api/v1/*
 * call returns a safe empty response regardless of path.
 */
async function stubApis(page: Page) {
  // Primary data endpoints
  await page.route("**/api/v1/assets**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ assets: [], total: 0 }),
    }),
  );

  await page.route("**/api/v1/bridges**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ bridges: [] }),
    }),
  );

  // Catch-all for any remaining /api/v1/* calls (incidents, anomaly-detection,
  // external-dependencies, health, prices, etc.)
  await page.route("**/api/v1/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    }),
  );

  // Health endpoints used by the service-health widget
  await page.route("**/health**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "ok" }),
    }),
  );
}

/**
 * If a dashboard tour overlay is present (aria-label="Skip tour"), dismiss it
 * so subsequent interactions are not blocked.
 */
async function dismissTourIfPresent(page: Page) {
  const skipBtn = page.getByRole("button", { name: /skip tour/i });
  if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skipBtn.click();
  }
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

test.describe("core navigation journeys", () => {
  test("landing page loads and shows the Launch App link", async ({ page }) => {
    await page.goto("/");

    // The landing page heading describes the product.
    await expect(
      page.getByRole("heading", { name: /bridge and asset/i }),
    ).toBeVisible();

    // The primary CTA navigates to the dashboard.
    const launchLink = page.getByRole("link", { name: /launch app/i });
    await expect(launchLink).toBeVisible();
    await expect(launchLink).toHaveAttribute("href", "/dashboard");
  });

  test("landing page → Dashboard navigation works", async ({ page }) => {
    await stubApis(page);
    await page.goto("/");

    // Click the primary CTA in the hero.
    await page.getByRole("link", { name: "Open Dashboard" }).first().click();

    // Should land on /dashboard with the Dashboard heading.
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible();
  });

  test("Dashboard page renders without application errors", async ({ page }) => {
    await stubApis(page);

    const getErrors = collectAppErrors(page);
    await page.goto("/dashboard");

    // Wait for the heading to confirm the page is rendered.
    await expect(
      page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible();

    const errors = getErrors();
    expect(
      errors,
      `Unexpected application errors on Dashboard: ${errors.join("; ")}`,
    ).toHaveLength(0);
  });

  test("Bridges page renders and shows its heading", async ({ page }) => {
    await stubApis(page);
    await page.goto("/bridges");

    await expect(
      page.getByRole("heading", { name: "Bridges", level: 1 }),
    ).toBeVisible();

    // The performance table is always rendered on this page regardless of data.
    await expect(
      page.getByRole("table", { name: /bridge performance/i }),
    ).toBeVisible();
  });

  test("navigate from Dashboard to Bridges via nav link", async ({ page }) => {
    await stubApis(page);
    await page.goto("/dashboard");

    // Wait for the page to settle, then dismiss tour overlay if present.
    await expect(
      page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible();
    await dismissTourIfPresent(page);

    // Find the Bridges nav link in the sidebar and click it.
    const bridgesLink = page
      .getByRole("link", { name: /^bridges$/i })
      .first();
    await expect(bridgesLink).toBeVisible();
    await bridgesLink.click();

    await expect(page).toHaveURL(/\/bridges/);
    await expect(
      page.getByRole("heading", { name: "Bridges", level: 1 }),
    ).toBeVisible();
  });

  test("Watchlist page renders and shows its heading", async ({ page }) => {
    await stubApis(page);
    await page.goto("/watchlist");

    await expect(
      page.getByRole("heading", { name: /watchlist/i, level: 1 }),
    ).toBeVisible();
  });

  test("Analytics page renders without application errors", async ({ page }) => {
    await stubApis(page);

    const getErrors = collectAppErrors(page);
    await page.goto("/analytics");

    await expect(
      page.getByRole("heading", { name: /analytics/i, level: 1 }),
    ).toBeVisible();

    const errors = getErrors();
    expect(
      errors,
      `Unexpected application errors on Analytics: ${errors.join("; ")}`,
    ).toHaveLength(0);
  });
});
