import type { Metadata, Viewport } from "next";
import "./globals.css";

const description =
  "Senior full stack engineer. ASP.NET Core, React and AWS. I build and run production SaaS, with a focus on payments and real-time systems.";

export const metadata: Metadata = {
  title: "Arbaz Khan · Senior Full Stack Engineer",
  description,
  openGraph: {
    title: "Arbaz Khan · Senior Full Stack Engineer",
    description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e12" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
