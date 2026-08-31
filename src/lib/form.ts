// Helpers for parsing FormData in server actions.

export function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export function optionalStr(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return value === "" ? null : value;
}

export function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export function int(formData: FormData, key: string, fallback = 0): number {
  const parsed = parseInt(str(formData, key), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function optionalDate(formData: FormData, key: string): Date | null {
  const value = str(formData, key);
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Comma-separated string -> trimmed non-empty array. */
export function commaList(formData: FormData, key: string): string[] {
  return str(formData, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Newline-separated string -> trimmed non-empty array (for URL lists). */
export function lineList(formData: FormData, key: string): string[] {
  return str(formData, key)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
