// app/api/image/route.ts
import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const path = u.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "missing path" }, { status: 400 });

  const bucketName = process.env.BLOG_BUCKET!;
  const { Storage } = await import("@google-cloud/storage");
  const storage = new Storage();

  const file = storage.bucket(bucketName).file(path);
  const [meta] = await file.getMetadata();
  const [buf] = await file.download(); // Node Buffer (a Uint8Array subclass)

  // Give NextResponse a web-friendly body (Uint8Array)
  const bytes = new Uint8Array(buf);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": meta.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
