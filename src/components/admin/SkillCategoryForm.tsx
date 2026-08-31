"use client";

import { useFormState } from "react-dom";
import { Input, Textarea, SubmitButton, FormError } from "./form-fields";
import type { SkillFormState } from "@/app/admin/(panel)/skills/actions";

export interface SkillCategoryFormValues {
  name: string;
  order: number;
  skills: string[];
}

export function SkillCategoryForm({
  action,
  category,
}: {
  action: (prev: SkillFormState, formData: FormData) => Promise<SkillFormState>;
  category?: SkillCategoryFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-[1fr_120px] gap-4">
        <Input
          label="Category"
          name="name"
          required
          defaultValue={category?.name}
          placeholder="Frontend"
        />
        <Input
          label="Order"
          name="order"
          type="number"
          defaultValue={category?.order ?? 0}
        />
      </div>
      <Textarea
        label="Skills"
        name="skills"
        rows={4}
        defaultValue={category?.skills.join(", ")}
        hint="comma-separated"
        placeholder="React, Next.js, TypeScript, Tailwind CSS"
      />
      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save category</SubmitButton>
      </div>
    </form>
  );
}
