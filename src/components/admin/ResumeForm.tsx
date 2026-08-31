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
import type { ResumeFormState } from "@/app/admin/(panel)/resumes/actions";

export interface ResumeFormValues {
  name: string;
  version: string | null;
  targetRole: string | null;
  summary: string | null;
  content: string | null;
  fileUrl: string | null;
  skills: string[];
  status: string;
}

export function ResumeForm({
  action,
  resume,
}: {
  action: (prev: ResumeFormState, formData: FormData) => Promise<ResumeFormState>;
  resume?: ResumeFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          required
          defaultValue={resume?.name}
          placeholder="AI Developer Resume"
        />
        <Input
          label="Version"
          name="version"
          defaultValue={resume?.version}
          placeholder="v2 / 2026"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Target role"
          name="targetRole"
          defaultValue={resume?.targetRole}
          placeholder="AI Engineer"
        />
        <Select
          label="Status"
          name="status"
          defaultValue={resume?.status ?? "active"}
          options={[
            { value: "active", label: "active" },
            { value: "archived", label: "archived" },
          ]}
        />
      </div>
      <Textarea
        label="Summary"
        name="summary"
        rows={2}
        defaultValue={resume?.summary}
      />
      <Input
        label="Skills"
        name="skills"
        defaultValue={resume?.skills.join(", ")}
        placeholder="Next.js, Python, OpenAI"
        hint="comma-separated"
      />
      <FileUpload
        label="Resume file (PDF)"
        name="fileUrl"
        accept="application/pdf"
        defaultValue={resume?.fileUrl}
        hint="downloadable PDF"
      />
      <Textarea
        label="Resume text"
        name="content"
        rows={12}
        defaultValue={resume?.content}
        hint="full text — used by the ATS analyzer"
        placeholder="Paste the full resume text here…"
      />
      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save resume</SubmitButton>
      </div>
    </form>
  );
}
