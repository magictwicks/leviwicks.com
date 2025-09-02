import { readJson /*, signedUrl*/ } from "@/lib/gcs";

export const dynamic = "force-dynamic"; // always fresh; switch to revalidate if you cache

export async function GET() {
  // Expecting posts/index.json in the bucket
  const items = await readJson("posts/index.json");

  // If images are private and you need signed URLs, uncomment:
  // for (const item of items) {
  //   if (item.cover_image) {
  //     item.cover_signed = await signedUrl(item.cover_image, 60);
  //   }
  // }

  return Response.json({ items });
}
