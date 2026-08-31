"use client";

import { useFormState } from "react-dom";
import { RefreshCw } from "lucide-react";
import { SubmitButton } from "./form-fields";
import { syncFromApify, type SyncState } from "@/app/admin/(panel)/jobs/actions";

const inputCls =
  "rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#B600A8]";

export function SyncJobsPanel() {
  const [state, formAction] = useFormState<SyncState, FormData>(
    syncFromApify,
    {},
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center gap-2">
        <RefreshCw size={16} className="text-white/50" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Discover jobs via Apify · Indeed
        </h2>
      </div>
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-[180px] flex-1 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            Role
          </span>
          <input
            name="query"
            required
            placeholder="AI Engineer"
            className={inputCls}
          />
        </label>
        <label className="flex min-w-[130px] flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            Location
          </span>
          <input name="location" placeholder="Remote / city" className={inputCls} />
        </label>
        <label className="flex w-20 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            Country
          </span>
          <select name="country" defaultValue="in" className={inputCls}>
            <option value="in" className="bg-[#0C0C0C]">IN</option>
            <option value="us" className="bg-[#0C0C0C]">US</option>
            <option value="gb" className="bg-[#0C0C0C]">GB</option>
            <option value="ca" className="bg-[#0C0C0C]">CA</option>
            <option value="au" className="bg-[#0C0C0C]">AU</option>
            <option value="de" className="bg-[#0C0C0C]">DE</option>
          </select>
        </label>
        <label className="flex w-28 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            Posted
          </span>
          <select name="datePosted" defaultValue="7" className={inputCls}>
            <option value="1" className="bg-[#0C0C0C]">24 hours</option>
            <option value="7" className="bg-[#0C0C0C]">7 days</option>
            <option value="14" className="bg-[#0C0C0C]">14 days</option>
            <option value="30" className="bg-[#0C0C0C]">30 days</option>
          </select>
        </label>
        <label className="flex w-20 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            Limit
          </span>
          <input name="limit" type="number" defaultValue={20} className={inputCls} />
        </label>
        <SubmitButton>Sync</SubmitButton>
      </form>
      <p className="mt-3 font-mono text-[0.7rem] text-white/30">
        Runs a live Indeed scrape on Apify — uses your account credits.
      </p>

      {state.error ? (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
