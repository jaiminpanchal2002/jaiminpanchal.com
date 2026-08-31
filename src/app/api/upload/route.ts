import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export async function POST(req: NextRequest) {
  // Admin-only.
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file provided." },
        { status: 400 },
      );
    }

    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { ok: false, error: "Unsupported file type. Use PNG, JPG, WebP, GIF, SVG, AVIF or PDF." },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "File is too large (max 10MB)." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

    // Production: persist to Vercel Blob (survives redeploys). The token is set
    // automatically once a Blob store is connected to the Vercel project.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${name}`, bytes, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    }

    // Local dev fallback: write to disk, serve via the /media route handler.
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
    return NextResponse.json({ ok: true, url: `/media/${name}` });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { ok: false, error: "Upload failed. Try again." },
      { status: 500 },
    );
  }
}
