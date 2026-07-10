import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy, SabiHub",
  description:
    "How SabiHub collects, uses and protects data, and our NDPR compliance commitments.",
};

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="Last updated: July 2026"
      sections={[
        {
          heading: "Our commitment",
          body: "SabiHub is built for Nigeria's students, many of whom are minors. Protecting their data is not a feature, it is a precondition of everything we do. This page will hold our full privacy policy ahead of the Phase 1 pilot.",
        },
        {
          id: "ndpr",
          heading: "NDPR compliance",
          body: "SabiHub is being built to comply with the Nigeria Data Protection Regulation (NDPR). We are finalising our data-processing agreements, retention schedules and the appointment of a Data Protection Officer. Schools evaluating SabiHub for a pilot can request our current compliance documentation directly.",
        },
        {
          heading: "Contact",
          body: "Questions about data and privacy? Email us at sabihub@omobile.world and we will respond with the details relevant to your school or role.",
        },
      ]}
    />
  );
}
