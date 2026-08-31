"use client";

import { useFormState } from "react-dom";
import {
  Input,
  Textarea,
  Select,
  SubmitButton,
  FormError,
} from "./form-fields";
import { WORK_MODES } from "@/lib/jobs/constants";
import type { JobFormState } from "@/app/admin/(panel)/jobs/actions";

export function JobForm({
  action,
}: {
  action: (prev: JobFormState, formData: FormData) => Promise<JobFormState>;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Job title" name="title" required />
        <Input label="Company" name="company" required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Input label="Location" name="location" />
        <Select
          label="Work mode"
          name="workMode"
          options={[
            { value: "", label: "—" },
            ...WORK_MODES.map((m) => ({ value: m, label: m })),
          ]}
        />
        <Input label="Salary" name="salary" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Job URL" name="url" placeholder="https://…" />
        <Input label="Source" name="source" placeholder="linkedin, manual…" />
      </div>
      <Input
        label="Skills"
        name="skills"
        placeholder="Next.js, TypeScript, PostgreSQL"
        hint="comma-separated — drives the match score"
      />
      <Textarea label="Description" name="description" rows={4} />
      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Add job</SubmitButton>
      </div>
    </form>
  );
}
