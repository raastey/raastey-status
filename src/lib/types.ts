export type ComponentStatus =
  | "operational"
  | "degraded"
  | "partial_outage"
  | "outage"
  | "maintenance";

export interface StatusComponent {
  id: string;
  name: string;
  description: string;
  status: ComponentStatus;
  url?: string;
}

export interface ComponentsData {
  updatedAt: string;
  components: StatusComponent[];
}

export interface IncidentUpdate {
  at: string;
  status?: "investigating" | "identified" | "monitoring" | "resolved";
  body: string;
}

export interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  impact: "none" | "minor" | "major" | "critical";
  affectedComponents?: string[];
  createdAt: string;
  resolvedAt?: string;
  updates: IncidentUpdate[];
}

export interface ReleaseSection {
  heading: string;
  paragraphs: string[];
}

export interface Release {
  version: string;
  title: string;
  date: string;
  linearId?: string;
  summary: string;
  sections?: ReleaseSection[];
}

export interface ReleasesData {
  updatedAt: string;
  releases: Release[];
}
