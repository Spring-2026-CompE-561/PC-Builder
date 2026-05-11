import { expect, test } from "@playwright/test";

const TEST_EMAIL = "housain_test2@example.com";
const TEST_PASSWORD = "TestPass123!";

test("parts page loads backend data", async ({ page }) => {
  await page.goto("/parts");

  await expect(page.getByRole("heading", { name: "PC Components" })).toBeVisible();
  await expect(page.getByText("Browse and select components for your build")).toBeVisible();

  await expect(page.getByText("Loading parts...")).not.toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/Showing \d+ parts/)).toBeVisible({ timeout: 15000 });
});

test("user can sign up and create a manual build", async ({ page }) => {
  const unique = Date.now();
  const email = `playwright_${unique}@example.com`;
  const username = `playwright_${unique}`;
  const password = "TestPass123!";

  await page.goto("/sign-up");

  await page.getByLabel(/^Name$/).fill("Playwright User");
  await page.getByLabel(/^Username$/).fill(username);
  await page.getByLabel(/^Email$/).fill(email);
  await page.getByLabel(/^Password$/).fill(password);
  await page.getByLabel("Confirm Password").fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL(/\/$/, { timeout: 15000 });

  await page.goto("/builds/new");

  await expect(
    page.getByRole("heading", { name: "Build from Scratch" })
  ).toBeVisible();

  const inputs = page.locator("input");
  await inputs.nth(0).fill("Playwright Manual Build"); // Build Name
  await inputs.nth(1).fill("1500"); // Budget

  const selects = page.locator("select");
  await selects.nth(0).selectOption("gaming"); // Use Case
  await selects.nth(1).selectOption({ index: 1 }); // CPU
  await selects.nth(2).selectOption({ index: 1 }); // GPU
  await selects.nth(3).selectOption({ index: 1 }); // Motherboard
  await selects.nth(4).selectOption({ index: 1 }); // RAM


  await page.getByRole("button", { name: "Save Manual Build" }).click();

  await expect(page).toHaveURL(/\/builds\/\d+$/, { timeout: 15000 });
  await expect(page.getByRole("heading", { name: "Build Details" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Selected Parts" })).toBeVisible();
});

