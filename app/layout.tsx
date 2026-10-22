import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

// Bricolage Grotesque's width axis is what the hero name animates; Instrument Sans carries everything else.
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["wdth", "opsz"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });

const title = "Arbaz Khan, Senior Full Stack Engineer";
const description =
  "Senior engineer who builds the software behind your business: payments, live features and cloud setup that keeps the bill low. $700K+ processed, AWS bill cut by about 35%.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://arbaz-dev.vercel.app"),
  openGraph: { title, description, type: "website", url: "/" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0b0b1e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
