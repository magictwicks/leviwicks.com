// lib/gcs.server.ts
import "server-only";

// NOTE: no top-level access to env or bucket!
// and no top-level import of @google-cloud/storage either

type GcsFile = { download: () => Promise<[Buffer]> };
type GcsBucket = { file: (p: string) => GcsFile; getFiles: (o: { prefix: string }) => Promise<[ { name: string }[] ]> };

/** Resolve bucket at request time only */
async function getBucket(): Promise<GcsBucket> {
  const bucketName = process.env.BLOG_BUCKET;
  if (!bucketName) {
    // Don't crash build: throw only when actually called at runtime
    throw new Error("BLOG_BUCKET env var not set");
  }

  // Import the SDK only when we actually need it (runtime)
  const { Storage } = await import("@google-cloud/storage");
  const storage = new Storage();
  return storage.bucket(bucketName) as unknown as GcsBucket;
}

export async function readMarkdown(filename: string) {
  const bucket = await getBucket();
  const [buf] = await bucket.file(`posts/${filename}`).download();
  return buf.toString("utf8");
}

export async function listMarkdown(prefix = "posts/") {
  const bucket = await getBucket();
  const [files] = await bucket.getFiles({ prefix });
  return files.map(f => f.name.replace(prefix, "")).filter(Boolean);
}
