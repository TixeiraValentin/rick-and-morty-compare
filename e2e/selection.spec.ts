import { es, param } from "./labels";
import { expect, test } from "./fixtures";

test.describe("selection controls", () => {
  test("disables a character in the other column once it is selected", async ({ page }) => {
    await page.goto("/");
    const column1 = page.getByTestId("column-1");
    const column2 = page.getByTestId("column-2");

    await column1.getByTestId("character-card").first().click();
    await expect(page).toHaveURL(param("c1", 1));
    await expect(column2.getByTestId("character-card").first()).toBeDisabled();
  });

  test("swaps the two columns", async ({ page }) => {
    await page.goto("/?c1=1&c2=2");
    await expect(page.getByTestId("compare-results")).toBeVisible();

    await page.getByRole("button", { name: es.swap }).click();
    await expect(page).toHaveURL(param("c1", 2));
    await expect(page).toHaveURL(param("c2", 1));
    await expect(page.getByTestId("compare-results")).toBeVisible();
  });

  test("clears the whole selection", async ({ page }) => {
    await page.goto("/?c1=1&c2=2");
    await expect(page.getByTestId("compare-results")).toBeVisible();

    await page.getByRole("button", { name: es.clearSelection }).click();
    await expect(page).not.toHaveURL(/c1=/);
    await expect(page).not.toHaveURL(/c2=/);
    await expect(page.getByTestId("compare-results")).toHaveCount(0);
  });
});
