"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a single, cookieless page-view event. Honors Do Not Track and never
 * sends any personal data — just the event type and path.
 */
export function PageBeacon({
  type = "page_view",
  path,
}: {
  type?: string;
  path?: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const dnt =
      navigator.doNotTrack === "1" ||
      (window as unknown as { doNotTrack?: string }).doNotTrack === "1";
    if (dnt) return;

    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, path: path ?? location.pathname }),
      keepalive: true,
    }).catch(() => {
      /* analytics is best-effort */
    });
  }, [type, path]);

  return null;
}
