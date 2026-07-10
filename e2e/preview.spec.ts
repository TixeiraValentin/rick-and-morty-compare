import { expect, test } from "@playwright/test";

test.describe("hover preview", () => {
  test("shows a preview tooltip after hovering a character card", async ({ page }) => {
    await page.goto("/");

    const card = page.getByTestId("column-1").getByTestId("character-card").first();
    await expect(card).toBeVisible();

    await card.hover();
    await expect(page.getByRole("tooltip")).toBeVisible({ timeout: 3000 });

    await page.mouse.move(0, 0);
    await expect(page.getByRole("tooltip")).toHaveCount(0);
  });
});
