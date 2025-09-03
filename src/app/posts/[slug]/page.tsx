import BlogPost from "@/components/BlogPost";
import { readMarkdown } from "@/lib/gcs.server";

export const dynamic = "force-dynamic"; // always read fresh from GCS (adjust if you cache)

export default async function Page({ params }: { params: { slug: string } }) {
  // Expect URLs like /posts/2025-09-15-rome.md (or strip .md if you prefer)
  const slug = params.slug.endsWith(".md") ? params.slug : `${params.slug}.md`;
  const md = await readMarkdown(slug);
  return (
    <main className="px-6 py-8">
      <BlogPost body={md} />
    </main>
  );
}
