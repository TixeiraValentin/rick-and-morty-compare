import { expect, test } from "@playwright/test";

/**
 * Smoke test for the core flow against the real API: pick one character in each
 * column and assert the three episode sections render. Playwright is the
 * recommended tool for exercising async RSC flows (Golden Rule 14).
 */
test("selecting a character in each column reveals the three episode sections", async ({
  page,
}) => {
  await page.goto("/");

  const column1 = page.getByRole("region", { name: "Character #1" });
  const column2 = page.getByRole("region", { name: "Character #2" });

  // The gate: no comparison until both are selected.
  await expect(page.getByTestId("compare-results")).toHaveCount(0);

  // Pick the first character in column #1.
  await column1.getByTestId("character-card").first().click();
  await expect(page).toHaveURL(/c1=/);
  await expect(page.getByTestId("compare-results")).toHaveCount(0);

  // Pick a different character in column #2 (the first is disabled there).
  await column2.getByTestId("character-card").nth(1).click();
  await expect(page).toHaveURL(/c2=/);

  // The three sections now render.
  const results = page.getByTestId("compare-results");
  await expect(results).toBeVisible();
  await expect(results.getByTestId("episode-section")).toHaveCount(3);
});
