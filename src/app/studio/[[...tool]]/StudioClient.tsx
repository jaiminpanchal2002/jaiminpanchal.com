"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export function StudioClient() {
  if (!isSanityConfigured) {
    return (
      <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#070b14", color: "#f6f8ff", fontFamily: "system-ui", padding: 24 }}>
        <div style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Sanity Studio is not configured yet</h1>
          <p style={{ color: "#a9b8d0", lineHeight: 1.6 }}>
            Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> in your environment, then reload. See DEPLOYMENT.md for the full setup.
          </p>
        </div>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
