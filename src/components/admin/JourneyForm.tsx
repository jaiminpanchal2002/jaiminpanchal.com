"use client";

import { useFormState } from "react-dom";
import { Input, SubmitButton, FormError } from "./form-fields";
import type { JourneyFormState } from "@/app/admin/(panel)/journey/actions";

export interface JourneyFormValues {
  step: string;
  note: string | null;
  order: number;
}

export function JourneyForm({
  action,
  item,
}: {
  action: (
    prev: JourneyFormState,
    formData: FormData,
  ) => Promise<JourneyFormState>;
  item?: JourneyFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-[1fr_120px] gap-4">
        <Input
          label="Step"
          name="step"
          required
          defaultValue={item?.step}
          placeholder="React / Next.js"
        />
        <Input
          label="Order"
          name="order"
          type="number"
          defaultValue={item?.order ?? 0}
        />
      </div>
      <Input
        label="Note"
        name="note"
        defaultValue={item?.note}
        placeholder="Modern, motion-rich frontends"
      />
      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save step</SubmitButton>
      </div>
    </form>
  );
}
