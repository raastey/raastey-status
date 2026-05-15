#!/usr/bin/env node
/**
 * Sync status-data/releases.json from the-ways/RELEASE_NOTES.md when available.
 * Run manually: npm run sync:releases
 * Runs automatically before build via prebuild.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outPath = join(root, "status-data", "releases.json");

const candidates = [
  resolve(root, "../the-ways/RELEASE_NOTES.md"),
  process.env.RELEASE_NOTES_PATH,
].filter(Boolean);

const sourcePath = candidates.find((p) => existsSync(p));
if (!sourcePath) {
  console.warn("[sync-releases] RELEASE_NOTES.md not found — keeping existing releases.json");
  process.exit(0);
}

const md = readFileSync(sourcePath, "utf8");
const releases = [];
const sectionRe = /^## v([\d.]+)\s+—\s+\*([^*]+)\*\s+—\s+(\d{4}-\d{2}-\d{2})/gm;
const matches = [...md.matchAll(sectionRe)];

for (let i = 0; i < matches.length; i++) {
  const [, version, title, date] = matches[i];
  const start = matches[i].index + matches[i][0].length;
  const end = i + 1 < matches.length ? matches[i + 1].index : md.length;
  let chunk = md.slice(start, end).trim();
  chunk = chunk.replace(/^---\s*$/gm, "").trim();
  const linearMatch = chunk.match(/\[RAA-\d+\]/);
  const paragraphs = chunk
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter((p) => p && !p.startsWith("### ") && !p.startsWith("Tracked under"));
  const summary = paragraphs[0]?.slice(0, 280) ?? "";
  const body = paragraphs.slice(0, 6);
  releases.push({
    version,
    title,
    date,
    summary,
    ...(linearMatch ? { linearId: linearMatch[0].slice(1, -1) } : {}),
    body,
  });
}

const existing = existsSync(outPath)
  ? JSON.parse(readFileSync(outPath, "utf8"))
  : {};

const payload = {
  source: sourcePath.replace(root + "/", ""),
  syncedAt: new Date().toISOString(),
  releases: releases.length ? releases : existing.releases ?? [],
};

writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
console.log(`[sync-releases] Wrote ${releases.length} releases → ${outPath}`);
