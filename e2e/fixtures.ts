import { test as base, expect } from "@playwright/test";

// The episode-comparison batch (`/episode/1,2,3,…`) is the one heavy third-party
// request in the app. We serve it deterministically so specs never depend on the
// live API being fast or unthrottled — the character list still renders from the
// real (fixed, server-cached) dataset, but the buckets are computed offline.
function fakeEpisode(id: number) {
  return {
    id,
    name: `Episode ${id}`,
    air_date: "December 2, 2013",
    episode: `S01E${String(id).padStart(2, "0")}`,
  };
}

export const test = base.extend({
  page: async ({ page }, run) => {
    await page.route("**/api/rm/episode/**", async (route) => {
      const path = new URL(route.request().url()).pathname;
      const ids = decodeURIComponent(path.split("/episode/")[1] ?? "")
        .split(",")
        .map(Number)
        .filter((id) => Number.isFinite(id) && id > 0);
      const body = ids.length === 1 ? fakeEpisode(ids[0]) : ids.map(fakeEpisode);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
    await run(page);
  },
});

export { expect };
