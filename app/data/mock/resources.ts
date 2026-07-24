/**
 * Typed mock learning resources for the resources screens. Shared by the
 * student and teacher views (see docs/BACKEND.md for the planned endpoints).
 */

export type ResourceType = "note" | "link" | "file" | "video";

export type Resource = {
  id: string;
  title: string;
  subject: string;
  type: ResourceType;
  meta: string;
};

export const RESOURCE_SUBJECTS = ["Mathematics", "English", "Basic Science", "Social Studies"] as const;

export const RESOURCES: Resource[] = [
  { id: "r1", title: "Quadratic equations notes", subject: "Mathematics", type: "note", meta: "8 pages · updated Mon" },
  { id: "r2", title: "Khan Academy: fractions", subject: "Mathematics", type: "link", meta: "External link" },
  { id: "r3", title: "Comprehension passages", subject: "English", type: "file", meta: "PDF · 1.2 MB" },
  { id: "r4", title: "Photosynthesis explainer", subject: "Basic Science", type: "video", meta: "6 min video" },
  { id: "r5", title: "Map-reading worksheet", subject: "Social Studies", type: "file", meta: "PDF · 640 KB" },
  { id: "r6", title: "Grammar rules summary", subject: "English", type: "note", meta: "5 pages · updated Fri" },
  { id: "r7", title: "Ecosystems reading", subject: "Basic Science", type: "note", meta: "4 pages · updated Wed" },
  { id: "r8", title: "Nigeria states and capitals", subject: "Social Studies", type: "link", meta: "External link" },
];
