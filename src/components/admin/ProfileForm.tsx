"use client";

import { useFormState } from "react-dom";
import {
  Input,
  Textarea,
  Select,
  SubmitButton,
  FormError,
} from "./form-fields";
import { FileUpload } from "./FileUpload";
import type { ProfileFormState } from "@/app/admin/(panel)/profile/actions";

export interface ProfileFormValues {
  name: string;
  title: string;
  roles: string[];
  tagline: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  resumeUrl: string | null;
  availability: string | null;
  socials: { platform: string; url: string }[];
}

export function ProfileForm({
  action,
  profile,
}: {
  action: (
    prev: ProfileFormState,
    formData: FormData,
  ) => Promise<ProfileFormState>;
  profile?: ProfileFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          required
          defaultValue={profile?.name}
          placeholder="Jaimin Panchal"
        />
        <Input
          label="Title"
          name="title"
          required
          defaultValue={profile?.title}
          placeholder="Full-Stack & AI Engineer"
        />
      </div>

      <Input
        label="Hero roles"
        name="roles"
        defaultValue={profile?.roles.join(", ")}
        placeholder="Full-Stack Engineer, AI Developer, Product Engineer"
        hint="comma-separated — these rotate in the hero"
      />
      <Textarea
        label="Tagline"
        name="tagline"
        rows={2}
        defaultValue={profile?.tagline}
      />
      <Textarea label="Bio" name="bio" rows={3} defaultValue={profile?.bio} />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Location"
          name="location"
          defaultValue={profile?.location}
          placeholder="India · Remote"
        />
        <Select
          label="Availability"
          name="availability"
          defaultValue={profile?.availability ?? "open"}
          options={[
            { value: "open", label: "Available for select work" },
            { value: "available", label: "Actively looking" },
            { value: "unavailable", label: "Not available" },
          ]}
        />
        <Input
          label="Phone"
          name="phone"
          defaultValue={profile?.phone}
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        defaultValue={profile?.email}
      />
      <FileUpload
        label="Resume (PDF)"
        name="resumeUrl"
        accept="application/pdf"
        defaultValue={profile?.resumeUrl}
        hint="the hero Resume button links here"
      />
      <FileUpload
        label="Avatar image"
        name="avatarUrl"
        defaultValue={profile?.avatarUrl}
        hint="square works best"
      />

      <Textarea
        label="Social links"
        name="socials"
        rows={4}
        defaultValue={profile?.socials
          .map((s) => `${s.platform} | ${s.url}`)
          .join("\n")}
        hint="one per line — format: Label | URL"
        placeholder={
          "GitHub | https://github.com/you\nLinkedIn | https://linkedin.com/in/you\nEmail | mailto:you@mail.com"
        }
      />

      <FormError message={state.error} />
      {state.ok ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Profile saved.
        </p>
      ) : null}
      <div className="pt-2">
        <SubmitButton>Save profile</SubmitButton>
      </div>
    </form>
  );
}
