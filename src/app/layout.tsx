import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, KEYWORDS, SITE_URL } from "@/lib/site";

// One family, two widths. Reading text: Archivo (normal width). Display/nav: static expanded
// instances of Archivo (wdth 125), self-hosted so no browser has to apply a width axis.
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const archivoExpanded = localFont({
  src: [
    { path: "../fonts/archivo-expanded-500.woff2", weight: "500" },
    { path: "../fonts/archivo-expanded-600.woff2", weight: "600" },
    { path: "../fonts/archivo-expanded-800.woff2", weight: "800" },
  ],
  variable: "--font-archivo-expanded",
  display: "swap",
});
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | Jaimin Panchal" },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  category: "technology",
  publisher: "Jaimin Panchal",
  formatDetection: { telephone: false, address: false, email: false },
  // Search Console / Bing Webmaster verification: set the env vars after adding the property.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
  applicationName: "JAIMIN / BEYOND CODE",
  authors: [{ name: "Jaimin Panchal", url: SITE_URL }],
  creator: "Jaimin Panchal",
  openGraph: { siteName: "Jaimin Panchal", locale: "en_IN", type: "website", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, url: "/" },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
    { media: "(prefers-color-scheme: light)", color: "#eeeff1" },
  ],
  colorScheme: "dark light",
};

// Applies the stored motion preference before first paint (prevents an animation flash
// for visitors who chose "Reduced" in the settings panel).
// Also covers the home page before first paint when the intro will play (first visit this
// session, motion allowed). A 5s safety timeout guarantees the cover can never trap anyone.
const motionBootScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var p=JSON.parse(localStorage.getItem("jp-experience")||"{}");if(p.motion&&p.motion!=="system")d.setAttribute("data-motion",p.motion);var rm=p.motion==="reduced"||(p.motion!=="full"&&matchMedia("(prefers-reduced-motion: reduce)").matches);if(location.pathname==="/"&&!rm&&!sessionStorage.getItem("jp-intro-seen")){d.setAttribute("data-intro","");setTimeout(function(){d.removeAttribute("data-intro")},5000)}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${archivo.variable} ${archivoExpanded.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
