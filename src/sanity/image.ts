import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "./env";
import type { SanityImage } from "@/content/types";

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null;

export function imageUrl(img: SanityImage | undefined, width = 1600): string | null {
  if (!img?.asset || !builder) return img?.asset?.url ?? null;
  return builder.image(img).width(width).auto("format").fit("max").url();
}
