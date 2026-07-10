import { type NextRequest, NextResponse } from "next/server";
import { SERVER_REVALIDATE_SECONDS } from "@/infrastructure/config/cache";
import { env } from "@/infrastructure/config/env";

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const target = `${env.apiBaseUrl}/${path.filter(Boolean).join("/")}${request.nextUrl.search}`;

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
