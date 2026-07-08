import { expect, test } from "@playwright/test";

test("selecting a character in each column reveals the three episode sections", async ({
  page,
}) => {
  await page.goto("/");

  const column1 = page.getByTestId("column-1");
  const column2 = page.getByTestId("column-2");

  await expect(page.getByTestId("compare-results")).toHaveCount(0);

  await column1.getByTestId("character-card").first().click();
  await expect(page).toHaveURL(/c1=/);
  await expect(page.getByTestId("compare-results")).toHaveCount(0);

  await column2.getByTestId("character-card").nth(1).click();
  await expect(page).toHaveURL(/c2=/);

  const results = page.getByTestId("compare-results");
  await expect(results).toBeVisible();
  await expect(results.getByTestId("episode-section")).toHaveCount(3);
});
