/**
 * Core navigation e2e suite.
 *
 * Covers the journeys described in issue #261:
 *   – Landing page loads and links to the Dashboard
 *   – Dashboard page renders without console errors
 *   – Navigation to Bridges renders the page heading
 *   – Navigation to Watchlist renders the page heading
 *   – A primary data page (Analytics) renders without console errors
 *
 * Selectors are role/text-based throughout to stay resilient to cosmetic changes.
 */

import { test, expect, type Page, type ConsoleMessage } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Collect browser-side console errors produced while running an action. */
function collectErrors(page: Page): () => string[] {
  const errors: string[] = [];
  const handler = (msg: ConsoleMessage) => {
    if (msg.type() === "error") {
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
 * Stub both primary API endpoints so the app renders data-free but without
 * network errors or indefinite loading states.
 */
async function stubApis(page: Page) {
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

  test("Dashboard page renders without console errors", async ({ page }) => {
    await stubApis(page);

    const getErrors = collectErrors(page);
    await page.goto("/dashboard");

    // Wait for the heading to confirm the page is rendered.
    await expect(
      page.getByRole("heading", { name: "Dashboard", level: 1 }),
    ).toBeVisible();

    const errors = getErrors();
    expect(errors, `Unexpected console errors on Dashboard: ${errors.join("; ")}`).toHaveLength(0);
  });

  test("Bridges page renders and shows its heading", async ({ page }) => {
    await stubApis(page);
    await page.goto("/bridges");

    await expect(
      page.getByRole("heading", { name: "Bridges", level: 1 }),
    ).toBeVisible();

    // The table or empty-state should be present.
    // Either the performance table caption or the empty-state text is visible.
    const perfTable = page.getByRole("table", {
      name: /bridge performance/i,
    });
    const emptyState = page.getByText(/no bridges/i);
    await expect(perfTable.or(emptyState)).toBeVisible();
  });

  test("navigate from Dashboard to Bridges via nav link", async ({ page }) => {
    await stubApis(page);
    await page.goto("/dashboard");

    // Layout renders a sidebar/nav — find the Bridges link by role and name.
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

  test("Analytics page renders without console errors", async ({ page }) => {
    await stubApis(page);

    const getErrors = collectErrors(page);
    await page.goto("/analytics");

    await expect(
      page.getByRole("heading", { name: /analytics/i, level: 1 }),
    ).toBeVisible();

    const errors = getErrors();
    expect(errors, `Unexpected console errors on Analytics: ${errors.join("; ")}`).toHaveLength(0);
  });
});
