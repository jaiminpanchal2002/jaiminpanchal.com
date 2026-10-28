import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity GROQ webhook → on-demand revalidation.
 * Configure in sanity.io/manage → API → Webhooks:
 *   URL: https://<site>/api/revalidate   Projection: {_type}   Secret: SANITY_REVALIDATE_SECRET
 * The signature is verified, so only Sanity can trigger it.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "Revalidation is not configured" }, { status: 501 });
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    if (!body?._type) return NextResponse.json({ ok: false, error: "Missing _type" }, { status: 400 });
    revalidateTag(body._type, "max");
    return NextResponse.json({ ok: true, revalidated: body._type });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
