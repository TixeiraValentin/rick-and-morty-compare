import { expect, test } from "@playwright/test";
import { es, param } from "./labels";

test.describe("pagination", () => {
  test("paginates each column independently through the URL", async ({ page }) => {
    await page.goto("/");

    const column1 = page.getByTestId("column-1");
    const column2 = page.getByTestId("column-2");
    await expect(column1.getByTestId("character-card").first()).toBeVisible();

    await column1.getByRole("button", { name: es.next }).click();
    await expect(page).toHaveURL(param("p1", 2));
    await expect(page).not.toHaveURL(param("p2", 2));

    await column2.getByRole("button", { name: es.next }).click();
    await expect(page).toHaveURL(param("p2", 2));
    await expect(page).toHaveURL(param("p1", 2));
  });

  test("jumps to a page and clamps out-of-range input to the last page", async ({ page }) => {
    await page.goto("/");

    const column1 = page.getByTestId("column-1");
    const input = column1.getByLabel(es.pageInput);

    await input.fill("3");
    await input.press("Enter");
    await expect(page).toHaveURL(param("p1", 3));

    await input.fill("99999");
    await input.press("Enter");
    // Clamped onto the last page → the "next" control is disabled.
    await expect(column1.getByRole("button", { name: es.next })).toBeDisabled();
  });

  test("disables the previous control on the first page", async ({ page }) => {
    await page.goto("/");
    const column1 = page.getByTestId("column-1");
    await expect(column1.getByTestId("character-card").first()).toBeVisible();
    await expect(column1.getByRole("button", { name: es.previous })).toBeDisabled();
  });

  test("recovers from an out-of-range page via the reset action", async ({ page }) => {
    // A deep-linked page past the end yields an empty column with no pagination
    // control — the reset affordance is the only way back.
    await page.goto("/?p1=99999");
    const column1 = page.getByTestId("column-1");

    const reset = column1.getByRole("button", { name: es.resetPage });
    await expect(reset).toBeVisible();

    await reset.click();
    await expect(page).not.toHaveURL(/p1=99999/);
    await expect(column1.getByTestId("character-card").first()).toBeVisible();
  });
});
