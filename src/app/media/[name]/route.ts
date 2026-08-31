import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  pdf: "application/pdf",
};

// Serves user-uploaded files from /public/uploads. Using a route handler (not
// static public serving) means files uploaded at runtime work under both
// `next dev` and `next start`.
export async function GET(
  _req: NextRequest,
  { params }: { params: { name: string } },
) {
  const name = params.name;
  // Only the generated filename shape — blocks path traversal.
  if (!/^[a-zA-Z0-9._-]+$/.test(name) || name.includes("..")) {
    return new Response("Bad request", { status: 400 });
  }

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const type = MIME[ext];
  if (!type) return new Response("Unsupported", { status: 400 });

  try {
    const buf = await readFile(
      path.join(process.cwd(), "public", "uploads", name),
    );
    return new Response(buf, {
      headers: {
        "content-type": type,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
