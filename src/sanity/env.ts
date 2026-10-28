// Public Sanity config. Safe to expose: project id + dataset are not secrets.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-10-01";
export const studioUrl = "/studio";

/** True once a Sanity project id is configured. Until then the site renders local seed content. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
