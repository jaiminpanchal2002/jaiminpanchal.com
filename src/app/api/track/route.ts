import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// Privacy-conscious event logging: no IP, no cookies, no PII — just an event
// type and (optionally) a path. Used for aggregate portfolio metrics.
const ALLOWED_TYPES = new Set([
  "page_view",
  "resume_view",
  "project_open",
  "resume_download",
  "contact_submit",
  "external_link",
]);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      type?: unknown;
      path?: unknown;
    };
    const type = String(body.type ?? "");
    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const path =
      typeof body.path === "string" ? body.path.slice(0, 300) : null;

    await prisma.analyticsEvent.create({ data: { type, path } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
