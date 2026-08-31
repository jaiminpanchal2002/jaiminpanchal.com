"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, FileText, Loader2 } from "lucide-react";

function isPdf(url: string) {
  return /\.pdf($|\?)/i.test(url);
}

export function FileUpload({
  name,
  label,
  defaultValue,
  accept = "image/*",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  accept?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Upload failed.");
      setUrl(json.url);
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

      {/* URL is submitted through this hidden field. */}
      <input type="hidden" name={name} value={url} readOnly />

      {url ? (
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          {isPdf(url) ? (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/60">
              <FileText size={20} />
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="h-14 w-14 shrink-0 rounded-md object-cover"
            />
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate font-mono text-xs text-white/50 hover:text-white"
          >
            {url}
          </a>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setError(null);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 hover:bg-white/5 hover:text-white"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) void upload(f);
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-sm transition-colors ${
            dragOver
              ? "border-[#C81FB4]/60 bg-[#C81FB4]/5 text-white"
              : "border-white/15 bg-white/[0.02] text-white/50 hover:border-white/30 hover:text-white/70"
          }`}
        >
          {busy ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <UploadCloud size={20} />
              <span>
                Drop a file or <span className="text-[#C81FB4]">browse</span>
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = "";
        }}
      />

      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
