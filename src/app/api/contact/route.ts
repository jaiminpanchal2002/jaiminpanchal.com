import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const EMAIL_RE = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const name = String(body.name ?? "").trim().slice(0, 120);
    const email = String(body.email ?? "").trim().slice(0, 200);
    const subject = String(body.subject ?? "").trim().slice(0, 200);
    const message = String(body.message ?? "").trim().slice(0, 5000);
    const company = String(body.company ?? ""); // honeypot

    // Bot honeypot — silently succeed without storing.
    if (company) return NextResponse.json({ ok: true });

    if (!name || !EMAIL_RE.test(email) || message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Please provide a name, a valid email, and a message." },
        { status: 400 },
      );
    }

    await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message, status: "unread" },
    });
    await prisma.analyticsEvent.create({
      data: { type: "contact_submit", path: "/#contact" },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please email me directly." },
      { status: 500 },
    );
  }
}
