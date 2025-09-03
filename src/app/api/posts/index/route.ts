// app/api/posts/index/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // ensure Node runtime (not Edge)
export const dynamic = "force-dynamic";   // always fetch fresh (change to revalidate if you cache)

async function readJsonFromGCS(objectPath: string) {
  const bucketName = process.env.BLOG_BUCKET;
  if (!bucketName) throw new Error("BLOG_BUCKET env var not set");

  // Import the SDK only at runtime (prevents build-time errors)
  const { Storage } = await import("@google-cloud/storage");
  const storage = new Storage();
  const [buf] = await storage.bucket(bucketName).file(objectPath).download();
  return JSON.parse(buf.toString("utf8"));
}

export async function GET(_req: Request) {
  try {
    // Expecting a small catalog file you maintain: posts/index.json
    const items = await readJsonFromGCS("posts/index.json");
    // Example item: { slug, title, lat, lng, cover_image? }
    return NextResponse.json({ items }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to read posts index", detail: err?.message },
      { status: 500 },
    );
  }
}
