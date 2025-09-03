import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readJsonFromGCS(objectPath: string) {
  const bucketName = process.env.BLOG_BUCKET;
  if (!bucketName) throw new Error("BLOG_BUCKET env var not set");

  const { Storage } = await import("@google-cloud/storage");
  const storage = new Storage();
  const [buf] = await storage.bucket(bucketName).file(objectPath).download();
  return JSON.parse(buf.toString("utf8"));
}

export async function GET(_req: NextRequest) {
  try {
    const items = await readJsonFromGCS("posts/index.json");
    return NextResponse.json({ items }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to read posts index", detail: err?.message },
      { status: 500 }
    );
  }
}
