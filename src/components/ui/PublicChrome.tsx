"use client";

import { CustomCursor } from "./CustomCursor";
import { ScrollProgress } from "./ScrollProgress";
import { IntroCurtain } from "./IntroCurtain";
import { PageBeacon } from "./PageBeacon";

/** Public-site-only overlays (kept out of the admin). */
export function PublicChrome() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <IntroCurtain />
      <ScrollProgress />
      <CustomCursor />
      <PageBeacon />
    </>
  );
}
