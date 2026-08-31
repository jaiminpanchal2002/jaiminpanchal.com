"use client";

import { useFormState } from "react-dom";
import { Input, SubmitButton, FormError } from "./form-fields";
import type { AchFormState } from "@/app/admin/(panel)/achievements/actions";

export interface AchievementFormValues {
  title: string;
  description: string | null;
  order: number;
}

export function AchievementForm({
  action,
  achievement,
}: {
  action: (prev: AchFormState, formData: FormData) => Promise<AchFormState>;
  achievement?: AchievementFormValues;
}) {
  const [state, formAction] = useFormState(action, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-[1fr_120px] gap-4">
        <Input
          label="Title"
          name="title"
          required
          defaultValue={achievement?.title}
          placeholder="Employee of the Quarter"
        />
        <Input
          label="Order"
          name="order"
          type="number"
          defaultValue={achievement?.order ?? 0}
        />
      </div>
      <Input
        label="Context"
        name="description"
        defaultValue={achievement?.description}
        placeholder="Sapphire Software Solution · 2025"
      />
      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save achievement</SubmitButton>
      </div>
    </form>
  );
}
