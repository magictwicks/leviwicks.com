import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const path = u.searchParams.get("path"); // e.g. images/posts/rome/hero.jpg
  if (!path) return NextResponse.json({ error: "missing path" }, { status: 400 });

  const bucket = process.env.BLOG_BUCKET!;
  const { Storage } = await import("@google-cloud/storage");
  const storage = new Storage();
  const file = storage.bucket(bucket).file(path);
  const [meta] = await file.getMetadata();
  const [buf] = await file.download();

  return new NextResponse(buf, {
    headers: { "Content-Type": meta.contentType || "application/octet-stream" },
  });
}
