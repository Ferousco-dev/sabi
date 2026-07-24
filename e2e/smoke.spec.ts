import { test, expect } from "@playwright/test";

/**
 * UI smoke tests. These are intentionally broad: they prove the key routes
 * render, are titled, and throw no uncaught page errors on load. Route-specific
 * assertions live beside each dashboard as those screens land.
 */

const ROUTES = [
  { path: "/", name: "landing" },
  { path: "/login", name: "login" },
  { path: "/signup", name: "signup" },
  { path: "/admin", name: "admin overview" },
  { path: "/teacher", name: "teacher overview" },
  { path: "/parent", name: "parent overview" },
  { path: "/student", name: "student overview" },
];

for (const route of ROUTES) {
  test(`${route.name} renders without page errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const res = await page.goto(route.path, { waitUntil: "domcontentloaded" });
    expect(res?.ok(), `${route.path} should respond 2xx`).toBeTruthy();

    // The brand name is present somewhere on every SabiHub page.
    await expect(page.locator("body")).toContainText(/SabiHub/i);
    expect(errors, `no uncaught errors on ${route.path}`).toEqual([]);
  });
}

test("admin overview shows nav and key metrics", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Overview", level: 1 })).toBeVisible();
  await expect(page.getByText("Total students")).toBeVisible();
  await expect(page.getByText("Attendance this week")).toBeVisible();
});

test("admin students table filters by search", async ({ page }) => {
  await page.goto("/admin/students");
  await expect(page.getByText("Adaeze Okafor")).toBeVisible();
  await page.getByPlaceholder("Search by name, admission no, or guardian").fill("Fatima");
  await expect(page.getByText("Fatima Bello")).toBeVisible();
  await expect(page.getByText("Adaeze Okafor")).toBeHidden();
});

test("unknown route returns a 404", async ({ page }) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
});
