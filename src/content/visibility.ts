/**
 * Publishing gate for unverified facts.
 *
 * Production default: unverified records are hidden.
 * Local review: set CONTENT_PREVIEW_UNVERIFIED=true to see drafts, each marked
 * with a visible "Needs verification" badge so it can't be mistaken for final copy.
 */
export function showUnverified(): boolean {
  return process.env.CONTENT_PREVIEW_UNVERIFIED === "true";
}

export function isVisible<T extends { verified: boolean }>(item: T, preview = showUnverified()): boolean {
  return item.verified || preview;
}

export function visibleOnly<T extends { verified: boolean }>(items: T[], preview = showUnverified()): T[] {
  return items.filter((i) => isVisible(i, preview));
}
