import type { Metadata } from "next";
import { Kanit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaimin Panchal — Full-Stack & AI Engineer",
  description:
    "Cinematic personal-brand portfolio of Jaimin Panchal — full-stack developer, AI engineer, and creative technologist building intelligent digital experiences.",
  metadataBase: new URL("https://jaiminpanchal.com"),
  openGraph: {
    title: "Jaimin Panchal — Full-Stack & AI Engineer",
    description:
      "Full-stack developer, AI engineer, and creative technologist building intelligent digital experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${kanit.variable} ${mono.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://motionsites.ai"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://images.higgs.ai"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://shrug-person-78902957.figma.site"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#0C0C0C]">{children}</body>
    </html>
  );
}
