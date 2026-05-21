#!/usr/bin/env node
/**
 * Merge status-data/*.json into public/status.json for in-app polling.
 * Run before `astro build` (see package.json).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const STATUS_RANK = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  partial_outage: 3,
  outage: 4,
};

function deriveOverall(components) {
  if (!components.length) return "operational";
  let worst = "operational";
  for (const c of components) {
    if (STATUS_RANK[c.status] > STATUS_RANK[worst]) worst = c.status;
  }
  return worst;
}

const componentsPayload = JSON.parse(
  readFileSync(join(ROOT, "status-data/components.json"), "utf8"),
);
const incidentsPayload = JSON.parse(
  readFileSync(join(ROOT, "status-data/incidents.json"), "utf8"),
);

const incidents = Array.isArray(incidentsPayload)
  ? incidentsPayload
  : (incidentsPayload.incidents ?? []);

const activeIncidents = incidents.filter((i) => i.status !== "resolved");

const snapshot = {
  updatedAt: componentsPayload.updatedAt,
  overall: deriveOverall(componentsPayload.components),
  components: componentsPayload.components,
  incidents: activeIncidents,
};

const out = join(ROOT, "public/status.json");
writeFileSync(out, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
console.log(`Wrote ${out} (${snapshot.components.length} components, ${activeIncidents.length} active incidents)`);
