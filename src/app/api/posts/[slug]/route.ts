// app/api/posts/[slug]/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // ensure Node runtime (not Edge)
export const dynamic = "force-dynamic";   // or: export const revalidate = 60;

async function readMarkdownFromGCS(filename: string) {
  const bucketName = process.env.BLOG_BUCKET;
  if (!bucketName) throw new Error("BLOG_BUCKET env var not set");

  const { Storage } = await import("@google-cloud/storage");
  const storage = new Storage();
  const filePath = `posts/${filename}`;
  const [buf] = await storage.bucket(bucketName).file(filePath).download();
  return buf.toString("utf8");
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const slug = params.slug || "";
    const filename = slug.endsWith(".md") ? slug : `${slug}.md`;
    const md = await readMarkdownFromGCS(filename);

    return new NextResponse(md, {
      status: 200,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  } catch (err: any) {
    // 404 if the object is missing; 500 otherwise
    const message = String(err?.message || "");
    const notFound =
      message.includes("No such object") ||
      message.includes("Not Found") ||
      message.includes("ENOENT");
    if (notFound) {
      return NextResponse.json(
        { error: "Post not found", detail: message },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Failed to read post", detail: message },
      { status: 500 },
    );
  }
}
