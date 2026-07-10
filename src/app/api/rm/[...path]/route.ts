import { type NextRequest, NextResponse } from "next/server";
import { SERVER_REVALIDATE_SECONDS } from "@/infrastructure/config/cache";
import { env } from "@/infrastructure/config/env";

const ALLOWED_RESOURCES = new Set(["character", "episode", "location"]);

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const segments = path.filter(Boolean);

  if (!ALLOWED_RESOURCES.has(segments[0])) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const target = `${env.apiBaseUrl}/${segments.join("/")}${request.nextUrl.search}`;

  const upstream = await fetch(target, {
    headers: { accept: "application/json" },
    next: { revalidate: SERVER_REVALIDATE_SECONDS },
  });

  return new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
