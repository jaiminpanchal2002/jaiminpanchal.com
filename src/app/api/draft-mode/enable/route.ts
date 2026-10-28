import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client, readToken } from "@/sanity/client";

/**
 * Called by the Sanity Presentation tool. next-sanity validates a short-lived secret that
 * the Studio creates (requires a logged-in Studio user), so draft mode can't be enabled
 * by guessing a URL.
 */
export const { GET } = defineEnableDraftMode({ client: client.withConfig({ token: readToken }) });
