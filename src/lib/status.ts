import componentsData from "../../status-data/components.json";
import incidentsData from "../../status-data/incidents.json";
import releasesData from "../../status-data/releases.json";

export type ComponentStatus = "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";

export interface Component {
  id: string;
  name: string;
  description: string;
  status: ComponentStatus;
  url?: string;
}

export interface IncidentUpdate {
  at: string;
  status: ComponentStatus;
  body: string;
}

export interface Incident {
  id: string;
  title: string;
  impact: ComponentStatus;
  startedAt: string;
  resolvedAt?: string;
  components: string[];
  updates: IncidentUpdate[];
}

export interface Release {
  version: string;
  title: string;
  date: string;
  summary: string;
  linearId?: string;
  body: string[];
}

const STATUS_ORDER: ComponentStatus[] = [
  "major_outage",
  "partial_outage",
  "degraded",
  "maintenance",
  "operational",
];

export function worstStatus(statuses: ComponentStatus[]): ComponentStatus {
  for (const s of STATUS_ORDER) {
    if (statuses.includes(s)) return s;
  }
  return "operational";
}

export function statusLabel(status: ComponentStatus): string {
  switch (status) {
    case "operational":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "partial_outage":
      return "Partial outage";
    case "major_outage":
      return "Major outage";
    case "maintenance":
      return "Maintenance";
  }
}

export function overallHeadline(status: ComponentStatus): string {
  switch (status) {
    case "operational":
      return "All systems operational";
    case "degraded":
      return "Some systems degraded";
    case "partial_outage":
      return "Partial system outage";
    case "major_outage":
      return "Major system outage";
    case "maintenance":
      return "Scheduled maintenance";
  }
}

export const components = componentsData.components as Component[];
export const incidents = incidentsData.incidents as Incident[];
export const releases = releasesData.releases as Release[];
export const statusUpdatedAt = componentsData.updatedAt;

export const overallStatus = worstStatus(components.map((c) => c.status));
