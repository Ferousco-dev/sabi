import { test, expect } from "@playwright/test";

/**
 * UI smoke tests for the unified app. These cover the public marketing and auth
 * routes, which render without authentication. The role dashboards under
 * /admin, /teacher, /parent, /student are auth-gated and fetch from the API, so
 * they are exercised by end-to-end tests against a running backend, not here.
 */

const ROUTES = [
  { path: "/", name: "landing" },
  { path: "/login", name: "login" },
  { path: "/signup", name: "signup" },
];

for (const route of ROUTES) {
  test(`${route.name} renders without page errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const res = await page.goto(route.path, { waitUntil: "domcontentloaded" });
    expect(res?.ok(), `${route.path} should respond 2xx`).toBeTruthy();

    await expect(page.locator("body")).toContainText(/SabiHub/i);
    expect(errors, `no uncaught errors on ${route.path}`).toEqual([]);
  });
}

test("unknown route returns a 404", async ({ page }) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
});
