import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { createClient } from "next-sanity";
import { contactSchema, inquiryTypes, MIN_FILL_MS } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  const h = await headers();

  // CSRF: browsers always send Origin on cross-site POSTs; reject anything not from this site.
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  }

  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const rl = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages from this connection. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors: z.flattenError(parsed.error).fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  // Bots: honeypot filled or submitted faster than a human could. Respond as success so they learn nothing.
  if (data.website || Date.now() - data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const inquiryLabel = inquiryTypes.find((t) => t.value === data.inquiryType)?.label ?? data.inquiryType;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  let delivered = false;
  let stored = false;

  if (resendKey && to) {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: data.email,
      subject: `[${inquiryLabel}] ${data.subject}`,
      text: `From: ${data.name} <${data.email}>\nCompany: ${data.company || "-"}\nType: ${inquiryLabel}\n\n${data.message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;<br/><strong>Company:</strong> ${escapeHtml(data.company || "-")}<br/><strong>Type:</strong> ${escapeHtml(inquiryLabel)}</p><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
    });
    if (error) console.error("[contact] Resend error", error.name);
    else delivered = true;
  }

  if (isSanityConfigured && writeToken) {
    try {
      // IDs containing "." live under a private path in Sanity: never readable without a token,
      // so submissions can't leak through the public dataset API.
      const writer = createClient({ projectId, dataset, apiVersion, token: writeToken, useCdn: false });
      await writer.create({
        _id: `leads.${crypto.randomUUID()}`,
        _type: "contactSubmission",
        name: data.name,
        email: data.email,
        company: data.company || undefined,
        inquiryType: data.inquiryType,
        subject: data.subject,
        message: data.message,
        status: "new",
        submittedAt: new Date().toISOString(),
      });
      stored = true;
    } catch (err) {
      console.error("[contact] Sanity store failed", (err as Error).message);
    }
  }

  if (!delivered && !stored) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] No delivery configured (dev). Submission received:", { ...data, message: `${data.message.slice(0, 80)}...` });
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ ok: false, error: "The contact service is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
