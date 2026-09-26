import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const title = "Arbaz Khan, Senior Full Stack Engineer";
const description =
  "Senior full stack engineer. ASP.NET Core, React and AWS. I build and run production SaaS, with a focus on payments, webhooks and real-time systems.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://arbaz-dev.vercel.app"),
  openGraph: { title, description, type: "website", url: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0c1422",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide scroll-reveal content only when JS is there to reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
