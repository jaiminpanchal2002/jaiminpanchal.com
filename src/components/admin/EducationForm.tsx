"use client";

import { useFormState } from "react-dom";
import { Input, Textarea, SubmitButton, FormError } from "./form-fields";
import type { EduFormState } from "@/app/admin/(panel)/education/actions";

export interface EducationFormValues {
  institution: string;
  degree: string;
  field: string | null;
  period: string | null;
  description: string | null;
  order: number;
}

export function EducationForm({
  action,
  education,
}: {
  action: (prev: EduFormState, formData: FormData) => Promise<EduFormState>;
  education?: EducationFormValues;
}) {
  const [state, formAction] = useFormState(action, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <Input
        label="Degree"
        name="degree"
        required
        defaultValue={education?.degree}
        placeholder="B.Tech in Computer Science & Engineering"
      />
      <Input
        label="Institution"
        name="institution"
        required
        defaultValue={education?.institution}
        placeholder="Indus University, Ahmedabad"
      />
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Field"
          name="field"
          defaultValue={education?.field}
          placeholder="Computer Science"
        />
        <Input
          label="Period"
          name="period"
          defaultValue={education?.period}
          placeholder="2019 — 2023"
        />
        <Input
          label="Order"
          name="order"
          type="number"
          defaultValue={education?.order ?? 0}
        />
      </div>
      <Textarea
        label="Note"
        name="description"
        rows={2}
        defaultValue={education?.description}
        placeholder="CGPA 8.89 / 10"
      />
      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save education</SubmitButton>
      </div>
    </form>
  );
}
