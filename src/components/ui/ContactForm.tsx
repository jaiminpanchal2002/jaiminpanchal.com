"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#E6ECF2] outline-none transition-colors placeholder:text-white/25 focus:border-[#C81FB4]";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Failed to send.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send.");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-14 text-center">
        <CheckCircle2 className="text-emerald-400" size={40} />
        <div>
          <p className="text-lg font-semibold text-white">Message sent</p>
          <p className="mt-1 text-sm text-white/50">
            Thanks — I&apos;ll get back to you soon.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-white/45">
            Name
          </span>
          <input name="name" required placeholder="Your name" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-white/45">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className={field}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[0.7rem] uppercase tracking-widest text-white/45">
          Subject
        </span>
        <input
          name="subject"
          placeholder="What’s this about?"
          className={field}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[0.7rem] uppercase tracking-widest text-white/45">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell me about the project, role, or idea…"
          className={`${field} resize-y`}
        />
      </label>

      {status === "error" && error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{
          background:
            "linear-gradient(123deg, #18011F 7%, #C81FB4 37%, #7A3BFF 72%, #FF6A3D 100%)",
        }}
      >
        {status === "sending" ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send size={15} /> Send message
          </>
        )}
      </button>
    </form>
  );
}
