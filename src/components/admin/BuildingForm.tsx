"use client";

import { useFormState } from "react-dom";
import {
  Input,
  Textarea,
  Select,
  SubmitButton,
  FormError,
} from "./form-fields";
import type { BuildingFormState } from "@/app/admin/(panel)/building/actions";

export interface BuildingFormValues {
  title: string;
  status: string;
  progress: number;
  description: string | null;
  tech: string[];
  link: string | null;
  order: number;
}

const STATUSES = ["Planning", "Building", "Testing", "Live"];

export function BuildingForm({
  action,
  item,
}: {
  action: (
    prev: BuildingFormState,
    formData: FormData,
  ) => Promise<BuildingFormState>;
  item?: BuildingFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <Input
        label="Title"
        name="title"
        required
        defaultValue={item?.title}
        placeholder="AI Job-Match Engine"
      />
      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Status"
          name="status"
          defaultValue={item?.status ?? "Building"}
          options={STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <Input
          label="Progress %"
          name="progress"
          type="number"
          defaultValue={item?.progress ?? 0}
        />
        <Input
          label="Order"
          name="order"
          type="number"
          defaultValue={item?.order ?? 0}
        />
      </div>
      <Textarea
        label="Description"
        name="description"
        rows={2}
        defaultValue={item?.description}
      />
      <Input
        label="Technologies"
        name="tech"
        defaultValue={item?.tech.join(", ")}
        placeholder="Python, OpenAI, pgvector"
        hint="comma-separated"
      />
      <Input
        label="Link"
        name="link"
        defaultValue={item?.link}
        placeholder="#projects or https://…"
      />
      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save item</SubmitButton>
      </div>
    </form>
  );
}
