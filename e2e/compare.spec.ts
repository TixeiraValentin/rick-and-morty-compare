import { es, param } from "./labels";
import { expect, test } from "./fixtures";

test.describe("core comparison flow", () => {
  test("keeps the three sections hidden until a character is chosen in BOTH columns", async ({
    page,
  }) => {
    await page.goto("/");

    const column1 = page.getByTestId("column-1");
    const column2 = page.getByTestId("column-2");

    await expect(page.getByText(es.prompt)).toBeVisible();
    await expect(page.getByTestId("compare-results")).toHaveCount(0);

    await column1.getByTestId("character-card").first().click();
    await expect(page).toHaveURL(/c1=/);
    // One column selected is NOT enough — the validation gate stays closed.
    await expect(page.getByTestId("compare-results")).toHaveCount(0);
    await expect(page.getByText(es.onlyOne)).toBeVisible();

    await column2.getByTestId("character-card").nth(1).click();
    await expect(page).toHaveURL(/c2=/);

    const results = page.getByTestId("compare-results");
    await expect(results).toBeVisible();
    await expect(results.getByTestId("episode-section")).toHaveCount(3);
  });

  test("restores a deep-linked selection on load and buckets shared episodes", async ({ page }) => {
    // Rick (1) and Morty (2) appear together in many episodes → shared is non-empty.
    await page.goto("/?c1=1&c2=2");

    const results = page.getByTestId("compare-results");
    await expect(results).toBeVisible();

    const sections = results.getByTestId("episode-section");
    await expect(sections).toHaveCount(3);
    await expect(sections.nth(1).getByRole("listitem").first()).toBeVisible();
  });

  test("toggles a character off when its selected card is clicked again", async ({ page }) => {
    await page.goto("/?c1=1&c2=2");
    await expect(page.getByTestId("compare-results")).toBeVisible();

    await page.getByTestId("column-1").getByTestId("character-card").first().click();

    await expect(page).not.toHaveURL(param("c1", 1));
    await expect(page.getByTestId("compare-results")).toHaveCount(0);
  });
});
