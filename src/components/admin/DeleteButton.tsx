"use client";

import { Trash2 } from "lucide-react";

/**
 * Delete control. `action` is a server action already bound to the target id.
 * Confirms before submitting so an accidental click can't destroy data.
 */
export function DeleteButton({
  action,
  label = "Delete",
  compact = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
  compact?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this item? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className={
          compact
            ? "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-red-300/80 transition-colors hover:bg-red-500/10 hover:text-red-300"
            : "flex items-center gap-2 rounded-lg border border-red-500/30 px-3.5 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10"
        }
      >
        <Trash2 size={compact ? 13 : 15} />
        {label}
      </button>
    </form>
  );
}
