"use client";

import { useFormState } from "react-dom";
import { Input, Textarea, SubmitButton, FormError } from "./form-fields";
import { FileUpload } from "./FileUpload";
import type { SettingsFormState } from "@/app/admin/(panel)/settings/actions";

export interface SettingsFormValues {
  siteName: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
}

export function SettingsForm({
  action,
  settings,
}: {
  action: (
    prev: SettingsFormState,
    formData: FormData,
  ) => Promise<SettingsFormState>;
  settings?: SettingsFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <Input
        label="Site name"
        name="siteName"
        defaultValue={settings?.siteName}
        placeholder="Jaimin Panchal"
      />
      <Input
        label="SEO title"
        name="seoTitle"
        defaultValue={settings?.seoTitle}
        placeholder="Jaimin Panchal — Full-Stack & AI Engineer"
        hint="browser tab + search result title"
      />
      <Textarea
        label="SEO description"
        name="seoDescription"
        rows={3}
        defaultValue={settings?.seoDescription}
        hint="search result + social preview description"
      />
      <FileUpload
        label="OG image"
        name="ogImageUrl"
        defaultValue={settings?.ogImageUrl}
        hint="social sharing preview (1200×630 recommended)"
      />

      <FormError message={state.error} />
      {state.ok ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Settings saved.
        </p>
      ) : null}
      <div className="pt-2">
        <SubmitButton>Save settings</SubmitButton>
      </div>
    </form>
  );
}
