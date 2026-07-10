import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkError, NotFoundError, RateLimitError, UnknownError } from "@/core/errors/AppError";
import { httpGet } from "@/infrastructure/api/httpClient";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("httpGet", () => {
  const fetchMock = vi.fn();
  beforeEach(() => vi.stubGlobal("fetch", fetchMock));
  afterEach(() => vi.unstubAllGlobals());

  it("returns parsed JSON on a 2xx response", async () => {
    fetchMock.mockResolvedValue(json({ hello: "world" }));
    await expect(httpGet("http://x")).resolves.toEqual({ hello: "world" });
  });

  it("maps 404 to a typed NotFoundError", async () => {
    fetchMock.mockResolvedValue(json({}, 404));
    await expect(httpGet("http://x")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("maps 429 to a typed RateLimitError", async () => {
    fetchMock.mockResolvedValue(json({}, 429));
    await expect(httpGet("http://x")).rejects.toBeInstanceOf(RateLimitError);
  });

  it("maps any other non-OK status to UnknownError", async () => {
    fetchMock.mockResolvedValue(json({}, 500));
    await expect(httpGet("http://x")).rejects.toBeInstanceOf(UnknownError);
  });

  it("wraps a transport failure as NetworkError", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    await expect(httpGet("http://x")).rejects.toBeInstanceOf(NetworkError);
  });

  it("wraps an unparseable body as UnknownError", async () => {
    fetchMock.mockResolvedValue(new Response("not json", { status: 200 }));
    await expect(httpGet("http://x")).rejects.toBeInstanceOf(UnknownError);
  });

  it("forwards the revalidate hint to fetch when provided", async () => {
    fetchMock.mockResolvedValue(json({}));
    await httpGet("http://x", { revalidate: 3600 });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://x",
      expect.objectContaining({ next: { revalidate: 3600 } }),
    );
  });
});
