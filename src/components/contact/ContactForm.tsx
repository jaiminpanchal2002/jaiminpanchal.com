"use client";
/* eslint-disable react-hooks/refs -- react-hook-form register() returns a ref callback; the compiler lint misreads it as reading a ref during render. */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { contactSchema, inquiryTypes, type ContactInput } from "@/lib/contact-schema";
import { buttonClass } from "@/components/ui/styles";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const fieldClass =
  "w-full rounded-[var(--radius-md)] border border-line-strong bg-bg/60 px-4 py-3 text-fg placeholder:text-fg-3 transition-colors focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 aria-[invalid=true]:border-danger";

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label} {optional && <span className="font-normal text-fg-3">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ fallbackEmail }: { fallbackEmail?: string }) {
  const startedAt = useRef(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Record when the visitor first saw the form (anti-spam timing). Set after mount, not during render.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: "hiring", website: "", startedAt: 1 } as Partial<ContactInput>,
    mode: "onTouched",
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> };
      if (res.ok && json.ok) {
        setStatus({ kind: "sent" });
        reset();
        return;
      }
      if (json.fieldErrors) {
        for (const [k, v] of Object.entries(json.fieldErrors)) setError(k as keyof ContactInput, { message: v?.[0] });
      }
      setStatus({ kind: "error", message: json.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please check your connection and try again." });
    }
  };

  if (status.kind === "sent") {
    return (
      <div role="status" className="grid gap-4 rounded-[var(--radius-lg)] border border-line-strong bg-surface/60 p-8">
        <span className="grid size-11 place-items-center rounded-full bg-success/15 text-success">
          <Check className="size-5" aria-hidden />
        </span>
        <p className="font-display text-[length:var(--step-2)] text-fg">Message received.</p>
        <p className="text-fg-2">Thank you for reaching out. I read every message and will reply to the email you provided.</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className={buttonClass("secondary", "md", "justify-self-start")}>
          Send another message
        </button>
      </div>
    );
  }

  const err = (k: keyof ContactInput) => errors[k]?.message as string | undefined;
  const aria = (k: keyof ContactInput, id: string) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `${id}-error` : undefined });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5" aria-describedby="contact-privacy">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={err("name")}>
          <input id="name" autoComplete="name" className={fieldClass} {...aria("name", "name")} {...register("name")} />
        </Field>
        <Field id="email" label="Email" error={err("email")}>
          <input id="email" type="email" autoComplete="email" inputMode="email" className={fieldClass} {...aria("email", "email")} {...register("email")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label="Company" optional error={err("company")}>
          <input id="company" autoComplete="organization" className={fieldClass} {...aria("company", "company")} {...register("company")} />
        </Field>
        <Field id="inquiryType" label="Inquiry type" error={err("inquiryType")}>
          <select id="inquiryType" className={cn(fieldClass, "appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat")} {...aria("inquiryType", "inquiryType")} {...register("inquiryType")}>
            {inquiryTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="subject" label="Subject" error={err("subject")}>
        <input id="subject" className={fieldClass} {...aria("subject", "subject")} {...register("subject")} />
      </Field>
      <Field id="message" label="Message" error={err("message")}>
        <textarea id="message" rows={6} className={cn(fieldClass, "resize-y min-h-36")} {...aria("message", "message")} {...register("message")} />
      </Field>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-fg-2">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" {...aria("consent", "consent")} {...register("consent")} />
          <span>I agree that the details above are used only to reply to this message.</span>
        </label>
        {err("consent") && (
          <p id="consent-error" role="alert" className="text-sm text-danger">
            {err("consent")}
          </p>
        )}
      </div>

      {status.kind === "error" && (
        <p role="alert" className="rounded-[var(--radius-md)] border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {status.message}
          {fallbackEmail && (
            <>
              {" "}
              You can also email <a className="underline" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
            </>
          )}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p id="contact-privacy" className="max-w-[40ch] text-xs text-fg-3">
          Your message is sent privately and never published.
        </p>
        <button type="submit" disabled={status.kind === "sending"} className={buttonClass("primary", "lg")}>
          {status.kind === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending
            </>
          ) : (
            <>
              Send message <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
