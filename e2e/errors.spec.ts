import { expect, test } from "@playwright/test";

test.describe("error handling", () => {
  test("surfaces an error state when the episode request fails", async ({ page }) => {
    // The comparison's episode batch is fetched client-side through the proxy,
    // so we can force it to fail and assert the differentiated error UI.
    await page.route("**/api/rm/episode/**", (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: "{}" }),
    );

    await page.goto("/?c1=1&c2=2");

    await expect(page.getByRole("alert")).toBeVisible();
  });
});
