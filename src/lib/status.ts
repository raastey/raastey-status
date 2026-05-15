import componentsData from "../../status-data/components.json";
import incidentsRaw from "../../status-data/incidents.json";
import releasesData from "../../status-data/releases.json";
import type { ComponentStatus, Incident, Release, StatusComponent } from "./types";

const STATUS_RANK: Record<ComponentStatus, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  partial_outage: 3,
  outage: 4,
};

export type OverallStatus = ComponentStatus;

export const components = componentsData.components as StatusComponent[];
export const statusUpdatedAt = componentsData.updatedAt;

const incidentsPayload = incidentsRaw as Incident[] | { incidents?: Incident[] };
export const incidents: Incident[] = Array.isArray(incidentsPayload)
  ? incidentsPayload
  : (incidentsPayload.incidents ?? []);

export const releases = (releasesData.releases ?? []) as Release[];

export function deriveOverallStatus(list: StatusComponent[]): OverallStatus {
  if (!list.length) return "operational";
  let worst: ComponentStatus = "operational";
  for (const c of list) {
    if (STATUS_RANK[c.status] > STATUS_RANK[worst]) worst = c.status;
  }
  return worst;
}

export const overallStatus = deriveOverallStatus(components);

const OVERALL_HEADLINE: Record<OverallStatus, string> = {
  operational: "All systems operational",
  degraded: "Some systems degraded",
  partial_outage: "Partial system outage",
  outage: "Major system outage",
  maintenance: "Scheduled maintenance",
};

const COMPONENT_LABEL: Record<ComponentStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  partial_outage: "Partial outage",
  outage: "Major outage",
  maintenance: "Maintenance",
};

export function overallHeadline(status: OverallStatus): string {
  return OVERALL_HEADLINE[status];
}

export function statusLabel(status: ComponentStatus): string {
  return COMPONENT_LABEL[status];
}

export function formatUpdatedAt(iso?: string): string {
  if (!iso) return "unknown";
  return (
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(iso)) + " UTC"
  );
}

export function heroClass(status: OverallStatus): string {
  if (status === "operational") return "operational";
  if (status === "outage") return "outage";
  if (status === "maintenance") return "maintenance";
  return "degraded";
}
