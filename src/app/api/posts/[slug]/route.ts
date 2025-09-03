import { NextResponse, NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readMarkdownFromGCS(filename: string) {
  const bucketName = process.env.BLOG_BUCKET;
  if (!bucketName) throw new Error("BLOG_BUCKET env var not set");

  const { Storage } = await import("@google-cloud/storage");
  const storage = new Storage();
  const [buf] = await storage.bucket(bucketName).file(`posts/${filename}`).download();
  return buf.toString("utf8");
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> } // <-- note Promise here
) {
  try {
    const { slug } = await context.params;       // <-- await it
    const filename = slug.endsWith(".md") ? slug : `${slug}.md`;
    const md = await readMarkdownFromGCS(filename);

    return new NextResponse(md, {
      status: 200,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  } catch (err: any) {
    const msg = String(err?.message || "");
    const notFound = msg.includes("No such object") || msg.includes("Not Found") || msg.includes("ENOENT");
    if (notFound) {
      return NextResponse.json({ error: "Post not found", detail: msg }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to read post", detail: msg }, { status: 500 });
  }
}

