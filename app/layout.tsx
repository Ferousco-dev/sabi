import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// One modern font family for the whole product (premium, neutral, funded-startup
// feel). Exposed as --font-sans; --font-display aliases to it in globals.css.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const SITE_URL = "https://sabihub.ng";
const TITLE = "SabiHub, the all-in-one platform for Nigerian schools";
const DESCRIPTION =
  "Run your whole school on one platform. Lessons, grading, attendance, analytics and parent updates, offline-first, WAEC-aligned, and built for the devices Nigerian schools already own.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · SabiHub",
  },
  description: DESCRIPTION,
  applicationName: "SabiHub",
  keywords: [
    "SabiHub",
    "Nigerian schools",
    "school management",
    "EdTech Nigeria",
    "offline learning",
    "WAEC",
    "NECO",
    "OMobile",
  ],
  openGraph: {
    type: "website",
    siteName: "SabiHub",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
