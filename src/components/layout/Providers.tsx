"use client";

import { ThemeProvider } from "next-themes";
import { ExperienceProvider } from "./ExperienceProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AmbientSound } from "@/components/motion/AmbientSound";

export function Providers({ children, defaultTheme }: { children: React.ReactNode; defaultTheme: "dark" | "light" | "system" }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme={defaultTheme} enableSystem disableTransitionOnChange>
      <ExperienceProvider>
        <SmoothScroll />
        <AmbientSound />
        {children}
      </ExperienceProvider>
    </ThemeProvider>
  );
}
