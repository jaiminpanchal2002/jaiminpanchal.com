"use client";

import { useFormState } from "react-dom";
import {
  Input,
  Textarea,
  Select,
  Toggle,
  SubmitButton,
  FormError,
} from "./form-fields";
import { FileUpload } from "./FileUpload";
import { MultiImageUpload } from "./MultiImageUpload";
import type { FormState } from "@/app/admin/(panel)/projects/actions";

export interface ProjectFormValues {
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  categoryId: string | null;
  technologies: string[];
  images: string[];
  coverUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  published: boolean;
  isAiProject: boolean;
  order: number;
  date: string | null; // yyyy-mm-dd
}

interface ProjectFormProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  project?: ProjectFormValues;
  categories: { id: string; name: string }[];
}

export function ProjectForm({ action, project, categories }: ProjectFormProps) {
  const [state, formAction] = useFormState(action, {});

  const categoryOptions = [
    { value: "", label: "— None —" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          required
          defaultValue={project?.name}
          placeholder="AI Recruitment Platform"
        />
        <Input
          label="Slug"
          name="slug"
          defaultValue={project?.slug}
          placeholder="auto from name"
          hint="auto if blank"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          name="categoryId"
          defaultValue={project?.categoryId ?? ""}
          options={categoryOptions}
        />
        <Input
          label="Order"
          name="order"
          type="number"
          defaultValue={project?.order ?? 0}
        />
      </div>

      <Textarea
        label="Summary"
        name="summary"
        rows={2}
        defaultValue={project?.summary}
        placeholder="One-line summary shown on cards."
      />
      <Textarea
        label="Description"
        name="description"
        rows={4}
        defaultValue={project?.description}
      />

      <Input
        label="Technologies"
        name="technologies"
        defaultValue={project?.technologies.join(", ")}
        placeholder="Next.js, Python, PostgreSQL"
        hint="comma-separated"
      />
      <FileUpload
        label="Cover image"
        name="coverUrl"
        defaultValue={project?.coverUrl}
        hint="shown on the project card"
      />
      <MultiImageUpload
        label="Gallery images"
        name="images"
        defaultValue={project?.images}
        hint="used as the card cover if no cover is set"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Live URL"
          name="liveUrl"
          defaultValue={project?.liveUrl}
          placeholder="https://…"
        />
        <Input
          label="GitHub URL"
          name="githubUrl"
          defaultValue={project?.githubUrl}
          placeholder="https://github.com/…"
        />
      </div>
      <div className="max-w-xs">
        <Input
          label="Date"
          name="date"
          type="date"
          defaultValue={project?.date ?? undefined}
        />
      </div>

      <div className="flex flex-wrap gap-6 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
        <Toggle
          label="Published"
          name="published"
          defaultChecked={project?.published ?? true}
        />
        <Toggle
          label="Featured"
          name="featured"
          defaultChecked={project?.featured ?? false}
        />
        <Toggle
          label="AI project"
          name="isAiProject"
          defaultChecked={project?.isAiProject ?? false}
        />
      </div>

      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save project</SubmitButton>
      </div>
    </form>
  );
}
