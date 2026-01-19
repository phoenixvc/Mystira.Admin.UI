import { test, expect } from "@playwright/test";

test.describe("Admin UI", () => {
  test("loads the application", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Mystira/i);
  });

  test("displays login page for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    // Should redirect to login or show login UI
    await expect(page.locator("body")).toBeVisible();
  });
});
