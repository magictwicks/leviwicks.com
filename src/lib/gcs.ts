import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const bucket = storage.bucket(process.env.BLOG_BUCKET!);

export async function readMarkdown(filename: string) {
  const file = bucket.file(`posts/${filename}`);
  const [buf] = await file.download();
  return buf.toString("utf8");
}

export async function listMarkdown(prefix = "posts/") {
  const [files] = await bucket.getFiles({ prefix });
  return files
    .map(f => f.name.replace(prefix, ""))
    .filter(name => name && name.endsWith(".md"));
}

// NEW: read a small JSON index for the map
export async function readJson(objectPath: string) {
  const [buf] = await bucket.file(objectPath).download();
  return JSON.parse(buf.toString("utf8"));
}

// (optional) if your images are private and you want to show thumbnails on the map
export async function signedUrl(objectPath: string, minutes = 10) {
  const [url] = await bucket.file(objectPath).getSignedUrl({
    action: "read",
    expires: Date.now() + minutes * 60 * 1000,
  });
  return url;
}
