/**
 * Exports src/content/seed.ts as Sanity NDJSON for `sanity dataset import`.
 *
 *   npm run seed:export   -> writes seed/initial-content.ndjson
 *
 * Prefer `npm run seed:push`, which writes the same documents through the API.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { buildDocs } from "./seed-docs";

const docs = buildDocs();
mkdirSync("seed", { recursive: true });
writeFileSync("seed/initial-content.ndjson", docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents to seed/initial-content.ndjson (${docs.filter((d) => d._id.startsWith("drafts.")).length} as drafts).`);
