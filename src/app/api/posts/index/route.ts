// app/api/posts/[slug]/route.ts
export const runtime = "nodejs";          // make sure this is NOT edge
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { readMarkdown } from "@/lib/gcs.server";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const filename = params.slug.endsWith(".md") ? params.slug : `${params.slug}.md`;
    const md = await readMarkdown(filename);
    return new NextResponse(md, {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to read post", detail: err?.message }, { status: 500 });
  }
}
