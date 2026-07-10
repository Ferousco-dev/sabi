/**
 * Single source of truth for site navigation.
 * Previously NAV_LINKS + scrollTo were duplicated verbatim in both Hero.tsx
 * and StickyNav.tsx, which is how the "Partners"/"About" duplicate-target bug
 * crept in. Import from here in both places.
 */

export type NavLink = { label: string; target: string };

/** Primary nav. Each label maps to a distinct on-page section id. */
export const NAV_LINKS: NavLink[] = [
  { label: "Features", target: "features" },
  { label: "Roadmap", target: "roadmap" },
  { label: "Personas", target: "stakeholders" },
  { label: "About", target: "about" },
];

/**
 * Hero pill → section id. Kept beside NAV_LINKS so a new persona (e.g. Parents)
 * added to PILL_LINKS in content.ts resolves without a second edit site.
 * Any label not listed falls back to the stakeholders section.
 */
export const PILL_LINK_TARGETS: Record<string, string> = {
  Schools: "stakeholders",
  Teachers: "stakeholders",
  Students: "stakeholders",
  Parents: "stakeholders",
  Creators: "stakeholders",
};

export function pillTarget(label: string): string {
  return PILL_LINK_TARGETS[label] ?? "stakeholders";
}

/** Smooth-scroll to a section by id. No-op if the id isn't on the page. */
export function scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
