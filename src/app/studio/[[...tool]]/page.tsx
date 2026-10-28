import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { StudioClient } from "./StudioClient";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
  referrer: "same-origin",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

// Cache Components needs at least one param for dynamic routes; the Studio is a client SPA under /studio.
export function generateStaticParams() {
  return [{ tool: ["structure"] }];
}

// Reading params inside <Suspense> lets Next serve the shared App Shell for any Studio sub-path.
async function Studio({ params }: { params: PageProps<"/studio/[[...tool]]">["params"] }) {
  await params;
  return <StudioClient />;
}

/**
 * Embedded Sanity Studio. Access is protected by Sanity's own authentication: only users
 * invited to the Sanity project can sign in, and roles are managed at sanity.io/manage.
 */
export default function StudioPage(props: PageProps<"/studio/[[...tool]]">) {
  return (
    <Suspense fallback={null}>
      <Studio params={props.params} />
    </Suspense>
  );
}
