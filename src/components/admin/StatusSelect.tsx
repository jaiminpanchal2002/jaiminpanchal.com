"use client";

import { useState, useTransition } from "react";
import { setApplicationStatus } from "@/app/admin/(panel)/applications/actions";
import { APPLICATION_STATUSES } from "@/lib/jobs/constants";

/** Keyboard-accessible status changer used in the applications table view. */
export function StatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        startTransition(() => {
          void setApplicationStatus(id, next);
        });
      }}
      className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none focus:border-[#B600A8] disabled:opacity-50"
    >
      {APPLICATION_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-[#0C0C0C]">
          {s}
        </option>
      ))}
    </select>
  );
}
