import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service, SabiHub",
  description: "The terms that govern the use of SabiHub by schools, educators, students and creators.",
};

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="Last updated: July 2026"
      sections={[
        {
          heading: "Ahead of launch",
          body: "SabiHub is preparing for its Phase 1 pilot. Our full terms of service, covering acceptable use, school and creator agreements, content ownership and liability, will be published here before onboarding begins.",
        },
        {
          heading: "Pilot participants",
          body: "Schools and creators joining the early-access pilot will receive a dedicated pilot agreement outlining commitments, timelines and what SabiHub provides. Nothing on this marketing site constitutes a binding contract.",
        },
        {
          heading: "Contact",
          body: "For questions about pilot terms, email sabihub@omobile.world.",
        },
      ]}
    />
  );
}
