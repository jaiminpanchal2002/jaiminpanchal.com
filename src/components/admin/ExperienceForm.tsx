"use client";

import { useFormState } from "react-dom";
import {
  Input,
  Textarea,
  Toggle,
  SubmitButton,
  FormError,
} from "./form-fields";
import type { ExpFormState } from "@/app/admin/(panel)/experience/actions";

export interface ExperienceFormValues {
  position: string;
  company: string;
  period: string | null;
  location: string | null;
  description: string | null;
  achievements: string[];
  technologies: string[];
  current: boolean;
  order: number;
}

export function ExperienceForm({
  action,
  experience,
}: {
  action: (prev: ExpFormState, formData: FormData) => Promise<ExpFormState>;
  experience?: ExperienceFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Role"
          name="position"
          required
          defaultValue={experience?.position}
          placeholder="Full-Stack & AI Engineer"
        />
        <Input
          label="Company"
          name="company"
          required
          defaultValue={experience?.company}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Period"
          name="period"
          defaultValue={experience?.period}
          placeholder="2023 — Present"
        />
        <Input
          label="Location"
          name="location"
          defaultValue={experience?.location}
          placeholder="Remote"
        />
        <Input
          label="Order"
          name="order"
          type="number"
          defaultValue={experience?.order ?? 0}
        />
      </div>
      <Textarea
        label="Description"
        name="description"
        rows={2}
        defaultValue={experience?.description}
      />
      <Textarea
        label="Achievements"
        name="achievements"
        rows={4}
        defaultValue={experience?.achievements.join("\n")}
        hint="one per line"
        placeholder={"Shipped X, improving Y by 40%\nLed a team of 5"}
      />
      <Input
        label="Technologies"
        name="technologies"
        defaultValue={experience?.technologies.join(", ")}
        placeholder="Next.js, Python, PostgreSQL"
        hint="comma-separated"
      />
      <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
        <Toggle
          label="Current role"
          name="current"
          defaultChecked={experience?.current ?? false}
        />
      </div>
      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save experience</SubmitButton>
      </div>
    </form>
  );
}
