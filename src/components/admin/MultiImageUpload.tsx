"use client";

import { useRef, useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";

export function MultiImageUpload({
  name,
  label,
  defaultValue = [],
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  hint?: string;
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList) {
    setBusy(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error ?? "Upload failed.");
        uploaded.push(json.url);
      }
      setUrls((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-widest text-white/50">
          {label}
        </span>
        {hint ? <span className="text-[0.65rem] text-white/30">{hint}</span> : null}
      </span>

      {/* Newline-joined URLs consumed by lineList() in the action. */}
      <input type="hidden" name={name} value={urls.join("\n")} readOnly />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((u, i) => (
          <div
            key={`${u}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => setUrls((prev) => prev.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white/80 opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 font-mono text-[0.6rem] text-white/70">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-xs text-white/40 transition-colors hover:border-white/30 hover:text-white/70"
        >
          {busy ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Plus size={18} />
              Add
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void upload(e.target.files);
          e.target.value = "";
        }}
      />

      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
