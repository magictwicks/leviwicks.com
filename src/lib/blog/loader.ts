import fs from "node:fs/promises";
import path from "node:path";
import type { BlogContent, BlogEntry, City, LoadedData } from "./types";

const BLOG_DIR    = path.join(process.cwd(), "public", "blogdata");
const ENTRIES_DIR = path.join(BLOG_DIR, "entries");

function parseDateToUnixMillis(dateStr: string, fname: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!m) throw new Error(`File ${fname}: invalid date '${dateStr}', expected YYYY-MM-DD`);
  const [, y, mo, d] = m;
  const t = new Date(Number(y), Number(mo) - 1, Number(d)).getTime();
  if (Number.isNaN(t)) {
    throw new Error(`File ${fname}: invalid date '${dateStr}', expected YYYY-MM-DD`);
  }
  return t;
}

function parseBlocks(contentRaw: string): BlogContent[] {
  if (!contentRaw.trim()) return [];
  const blocks = contentRaw.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  const out: BlogContent[] = [];
  for (const block of blocks) {
    if (block.startsWith("# ")) {
      out.push({ type: "BlogHeader", title: block.slice(2).trim() });
    } else if (block.startsWith("[") && block.endsWith("]")) {
      out.push({ type: "BlogImage", url: block.slice(1, -1).trim() });
    } else {
      out.push({ type: "BlogParagraph", text: block });
    }
  }
  return out;
}

export async function loadBlogData(): Promise<LoadedData> {
  // cities
  const citiesRaw = await fs.readFile(path.join(BLOG_DIR, "CITIES.json"), "utf8");
  const cities: City[] = JSON.parse(citiesRaw);
  const cityLookup = Object.fromEntries(cities.map(c => [c.name, c]));

  // entries
  const dirents = await fs.readdir(ENTRIES_DIR, { withFileTypes: true });
  const files = dirents.filter(d => d.isFile()).map(d => d.name);

  const entries: BlogEntry[] = [];
  for (const fname of files) {
    const fpath = path.join(ENTRIES_DIR, fname);
    const raw = (await fs.readFile(fpath, "utf8")).trim();
    if (!raw) continue;

    const lines = raw.split(/\r?\n/);
    const [titleLine, cityNameLine, dateLine, ...rest] = lines;

    if (!titleLine) throw new Error(`File ${fname}: missing title on line 1`);
    const title = titleLine.trim();

    const cityName = (cityNameLine ?? "").trim();
    const city = cityLookup[cityName];
    if (!city) throw new Error(`File ${fname}: city '${cityName}' not found in CITIES.json`);

    const unixMillis = parseDateToUnixMillis((dateLine ?? "").trim(), fname);
    const content = parseBlocks(rest.join("\n"));

    entries.push({
      slug: fname.replace(/\.[^.]+$/, ""),
      location: city,
      date: unixMillis,
      title,
      content,
    });
  }

  return { cities, entries };
}

// Convenience helpers for pages with dynamic routes
export async function getPostSlugs(): Promise<string[]> {
  const dirents = await fs.readdir(ENTRIES_DIR, { withFileTypes: true });
  return dirents.filter(d => d.isFile()).map(d => d.name.replace(/\.[^.]+$/, ""));
}

export async function getPost(slug: string): Promise<BlogEntry | null> {
  const data = await loadBlogData();
  return data.entries.find(e => e.slug === slug) ?? null;
}
