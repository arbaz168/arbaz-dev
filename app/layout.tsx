import type { Metadata, Viewport } from "next";
import { Anybody, Instrument_Sans } from "next/font/google";
import "./globals.css";

// Anybody's width axis is what the hero name animates; Instrument Sans carries everything else.
const display = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });

const title = "Arbaz Khan, Senior Full Stack Engineer";
const description =
  "Senior full stack engineer. ASP.NET Core, React and AWS. I build and run production SaaS, with a focus on payments, webhooks and real-time systems.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://arbaz-dev.vercel.app"),
  openGraph: { title, description, type: "website", url: "/" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0a0d2c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
