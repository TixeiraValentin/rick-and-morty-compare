import { expect, test } from "@playwright/test";
import { es } from "./labels";

test.describe("preferences", () => {
  test("persists the theme across a reload", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: es.theme }).click();
    const theme = await page.locator("html").getAttribute("data-theme");
    expect(theme).toBeTruthy();

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme as string);
  });

  test("switches language and keeps it in the URL across a reload", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "en", exact: true }).click();
    await expect(page).toHaveURL(/lang=en/);
    await expect(page.getByRole("heading", { name: /Character Compare/ })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: /Character Compare/ })).toBeVisible();
  });
});
