import { expect, test } from "@playwright/test";
import { es, param } from "./labels";

test.describe("filters", () => {
  test("filters a column by name and persists it in the URL", async ({ page }) => {
    await page.route("**/api/rm/character**", (route) =>
      /[?&]name=rick/i.test(route.request().url())
        ? route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              info: { count: 1, pages: 1, next: null, prev: null },
              results: [
                {
                  id: 1,
                  name: "Rick Sanchez",
                  status: "Alive",
                  species: "Human",
                  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
                  episode: ["https://rickandmortyapi.com/api/episode/1"],
                },
              ],
            }),
          })
        : route.continue(),
    );

    await page.goto("/");
    const column1 = page.getByTestId("column-1");

    await column1.getByLabel(es.search).fill("rick");
    await expect(page).toHaveURL(/name1=rick/);
    await expect(column1.getByText("Rick Sanchez").first()).toBeVisible();
  });

  test("resets to page 1 when a filter changes", async ({ page }) => {
    await page.goto("/?p1=3");
    const column1 = page.getByTestId("column-1");
    await expect(page).toHaveURL(param("p1", 3));

    await column1.getByLabel(es.search).fill("morty");
    await expect(page).toHaveURL(/name1=morty/);
    await expect(page).not.toHaveURL(param("p1", 3));
  });

  test("shows an empty state when nothing matches", async ({ page }) => {
    // The R&M API answers 404 for a no-match name (→ empty page). Mock it so the
    // empty state is deterministic instead of racing a live request.
    await page.route("**/api/rm/character**", (route) =>
      /[?&]name=zzz/i.test(route.request().url())
        ? route.fulfill({
            status: 404,
            contentType: "application/json",
            body: '{"error":"There is nothing here"}',
          })
        : route.continue(),
    );

    await page.goto("/");
    const column1 = page.getByTestId("column-1");

    await column1.getByLabel(es.search).fill("zzzzznotacharacter");
    await expect(column1.getByText(es.noMatch)).toBeVisible();
  });

  test("filters by status and by species, then clears every filter", async ({ page }) => {
    await page.goto("/");
    const column1 = page.getByTestId("column-1");

    await column1.getByLabel(es.status).selectOption("Dead");
    await expect(page).toHaveURL(/status1=Dead/);

    await column1.getByLabel(es.species).fill("Alien");
    await expect(page).toHaveURL(/species1=Alien/);

    await column1.getByRole("button", { name: es.clearFilters }).click();
    await expect(page).not.toHaveURL(/status1=Dead/);
    await expect(page).not.toHaveURL(/species1=Alien/);
  });

  test("keeps the two columns' filters independent", async ({ page }) => {
    await page.goto("/");
    const column1 = page.getByTestId("column-1");
    const column2 = page.getByTestId("column-2");

    await column1.getByLabel(es.search).fill("rick");
    await expect(page).toHaveURL(/name1=rick/);
    await expect(page).not.toHaveURL(/name2=/);

    await column2.getByLabel(es.search).fill("beth");
    await expect(page).toHaveURL(/name2=beth/);
    await expect(page).toHaveURL(/name1=rick/);
  });
});
