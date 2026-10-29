/**
 * Uploads the portrait to Sanity and links GitHub + LinkedIn on the profile.
 * Patches only `portrait` and `socialLinks`, so other Studio edits are untouched.
 *
 *   npx tsx --env-file=.env.local scripts/set-profile-media.ts public/images/jaimin-panchal.png
 */
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { createClient } from "next-sanity";
import { profile } from "../src/content/seed";

const file = process.argv[2] ?? "public/images/jaimin-panchal.png";
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2026-10-01",
  useCdn: false,
});

async function main() {
  const asset = await client.assets.upload("image", readFileSync(file), { filename: basename(file) });
  const tx = client.transaction();
  for (const l of profile.socialLinks) {
    tx.createOrReplace({ _id: `socialLink-${l.platform}`, _type: "socialLink", platform: l.platform, label: l.label, url: l.url });
  }
  tx.patch("personalProfile", (p) =>
    p.set({
      portrait: { _type: "accessibleImage", asset: { _type: "reference", _ref: asset._id }, alt: "Portrait of Jaimin Panchal" },
      socialLinks: profile.socialLinks.map((l, i) => ({ _type: "reference", _ref: `socialLink-${l.platform}`, _key: `link${i}` })),
    }),
  );
  await tx.commit({ visibility: "sync" });
  console.log(`Portrait ${asset._id} (${asset.url}) set; links: ${profile.socialLinks.map((l) => l.label).join(", ")}`);
}

main();
