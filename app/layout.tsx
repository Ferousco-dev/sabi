import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SabiHub — No Dey Dull, Learn Well-Well!",
  description: "OMobile's Education Persona Consolidator. One platform for schools, teachers, students, parents and creators across Nigeria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
