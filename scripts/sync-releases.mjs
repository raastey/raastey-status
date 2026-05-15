#!/usr/bin/env node
/**
 * Parse ../the-ways/RELEASE_NOTES.md into status-data/releases.json.
 * Run from repo root: npm run sync-releases
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DEFAULT_SOURCE = resolve(ROOT, "../the-ways/RELEASE_NOTES.md");
const OUT = join(ROOT, "status-data/releases.json");

const sourcePath = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_SOURCE;

if (!existsSync(sourcePath)) {
  console.error(`Source not found: ${sourcePath}`);
  console.error("Usage: node scripts/sync-releases.mjs [path/to/RELEASE_NOTES.md]");
  process.exit(1);
}

const md = readFileSync(sourcePath, "utf8");
const releases = parseReleaseNotes(md);

const payload = {
  updatedAt: new Date().toISOString(),
  releases,
};

writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`Wrote ${releases.length} release(s) to ${OUT}`);

/** @param {string} text */
function parseReleaseNotes(text) {
  /** @type {Array<{ version: string; title: string; date: string; linearId?: string; summary: string; sections: Array<{ heading: string; paragraphs: string[] }> }>} */
  const releases = [];

  const blocks = text.split(/\n---\n/);
  for (const block of blocks) {
    const header = block.match(
      /^## v([\d.]+)\s+—\s+\*([^*]+)\*\s+—\s+(\d{4}-\d{2}-\d{2})/m,
    );
    if (!header) continue;

    const [, version, title, date] = header;
    const body = block.slice(header.index + header[0].length).trim();

    const linearMatch = body.match(/\[RAA-\d+\]/);
    const linearId = linearMatch ? linearMatch[0].slice(1, -1) : undefined;

    const sections = [];
    let current = null;

    for (const line of body.split("\n")) {
      const h3 = line.match(/^### (.+)$/);
      if (h3) {
        if (current) sections.push(current);
        current = { heading: h3[1], paragraphs: [] };
        continue;
      }
      if (!current) continue;
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("Tracked under")) continue;
      if (trimmed.startsWith("[")) continue;
      current.paragraphs.push(trimmed);
    }
    if (current) sections.push(current);

    const flat = sections.flatMap((s) => s.paragraphs);
    const summary = flat[0] ?? `Release v${version}`;

    releases.push({
      version,
      title,
      date,
      ...(linearId ? { linearId } : {}),
      summary: summary.length > 280 ? summary.slice(0, 277) + "…" : summary,
      sections,
    });
  }

  return releases;
}
