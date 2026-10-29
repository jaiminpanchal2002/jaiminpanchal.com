/**
 * Writes the seed documents to Sanity through the API (createOrReplace, one transaction).
 *
 *   npm run seed:push                              (everything)
 *   npm run seed:push -- --only=service,navigation  (only these _types / _ids)
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN.
 * Re-running is safe: documents with the same _id are replaced, nothing else is touched.
 * Edits made in the Studio to these same documents WILL be overwritten, so run it only for
 * the initial import or deliberately.
 */
import { createClient } from "next-sanity";
import { buildDocs } from "./seed-docs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN (see .env.example).");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-10-01", useCdn: false });
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
const docs = buildDocs().filter((d) => !only || only.includes(d._type) || only.includes(d._id));
const tx = client.transaction();
for (const d of docs) tx.createOrReplace(d);
tx.commit({ visibility: "sync" }).then((res) => console.log(`Wrote ${docs.length} documents to ${projectId}/${dataset} (${docs.filter((d) => d._id.startsWith("drafts.")).length} drafts). Transaction ${res.transactionId}`));
