import { clsx, type ClassValue } from "clsx";
import { SITE_URL } from "./site";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }); // "Sep 2026" (en-GB gives "Sept")
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function formatMonth(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso.length === 7 ? `${iso}-01` : iso);
  return Number.isNaN(d.getTime()) ? null : monthFmt.format(d);
}

export function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : dayFmt.format(d);
}

/** "Mar 2022 - Present", or null when no dates are recorded yet. */
export function formatRange(start?: string, end?: string, current?: boolean) {
  const s = formatMonth(start);
  if (!s) return current ? "Current" : formatMonth(end);
  const e = current ? "Present" : formatMonth(end);
  return e ? `${s} - ${e}` : s;
}

export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
