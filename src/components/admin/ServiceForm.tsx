"use client";

import { useFormState } from "react-dom";
import { Input, Textarea, SubmitButton, FormError } from "./form-fields";
import type { FormState } from "@/app/admin/(panel)/services/actions";

interface ServiceFormProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  service?: {
    number: string;
    name: string;
    description: string;
    order: number;
  };
}

export function ServiceForm({ action, service }: ServiceFormProps) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Number"
          name="number"
          defaultValue={service?.number}
          placeholder="01"
          hint="auto if blank"
        />
        <Input
          label="Order"
          name="order"
          type="number"
          defaultValue={service?.order ?? 0}
        />
      </div>
      <Input
        label="Name"
        name="name"
        required
        defaultValue={service?.name}
        placeholder="Full-Stack Development"
      />
      <Textarea
        label="Description"
        name="description"
        rows={4}
        defaultValue={service?.description}
        placeholder="What this service delivers…"
      />
      <FormError message={state.error} />
      <div className="flex gap-3 pt-2">
        <SubmitButton>Save service</SubmitButton>
      </div>
    </form>
  );
}
