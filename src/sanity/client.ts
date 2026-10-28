import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId, studioUrl } from "./env";

export const client = createClient({
  projectId: isSanityConfigured ? projectId : "unconfigured",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: { studioUrl },
});

/** Read token is server-only. It is used for draft previews and never reaches the client bundle. */
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";
/** Write token is server-only and used solely to store contact submissions. */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN ?? "";

export function previewClient() {
  return client.withConfig({ token: readToken, useCdn: false, perspective: "drafts", stega: { enabled: true, studioUrl } });
}
