import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/rm/[...path]/route";
import { SERVER_REVALIDATE_SECONDS } from "@/infrastructure/config/cache";
import { env } from "@/infrastructure/config/env";

function call(url: string, path: string[]) {
  return GET(new NextRequest(url), { params: Promise.resolve({ path }) });
}

describe("GET /api/rm/[...path] (upstream proxy)", () => {
  const fetchMock = vi.fn();
  beforeEach(() => vi.stubGlobal("fetch", fetchMock));
  afterEach(() => vi.unstubAllGlobals());

  it("404s a resource outside the allowlist without touching upstream", async () => {
    const res = await call("http://localhost/api/rm/secret", ["secret"]);
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("404s a dot-segment traversal attempt even under an allowed resource", async () => {
    const res = await call("http://localhost/api/rm/character", ["character", "..", "..", "secret"]);
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards an allowed resource (with its query) upstream and mirrors status + body", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const res = await call("http://localhost/api/rm/character?page=2&name=rick", ["character"]);

    expect(fetchMock).toHaveBeenCalledWith(
      `${env.apiBaseUrl}/character?page=2&name=rick`,
      expect.objectContaining({ next: { revalidate: SERVER_REVALIDATE_SECONDS } }),
    );
    expect(res.status).toBe(200);
    expect(await res.text()).toBe(JSON.stringify({ ok: true }));
    expect(res.headers.get("cache-control")).toContain("s-maxage=3600");
  });

  it("mirrors an upstream error status back to the caller", async () => {
    fetchMock.mockResolvedValue(
      new Response('{"error":"nope"}', {
        status: 404,
        headers: { "content-type": "application/json" },
      }),
    );

    const res = await call("http://localhost/api/rm/episode/999999", ["episode", "999999"]);
    expect(res.status).toBe(404);
  });
});
