"use client";

import { useFormState } from "react-dom";
import {
  Input,
  Textarea,
  Select,
  SubmitButton,
  FormError,
} from "./form-fields";
import {
  APPLICATION_STATUSES,
  WORK_MODES,
  PRIORITIES,
} from "@/lib/jobs/constants";
import type { AppFormState } from "@/app/admin/(panel)/applications/actions";

export interface ApplicationFormValues {
  company: string;
  jobTitle: string;
  status: string;
  priority: string | null;
  workMode: string | null;
  location: string | null;
  salary: string | null;
  source: string | null;
  jobUrl: string | null;
  recruiter: string | null;
  recruiterContact: string | null;
  tags: string[];
  notes: string | null;
  dateApplied: string | null;
  followUpDate: string | null;
}

const opt = (values: readonly string[], includeEmpty = false) => [
  ...(includeEmpty ? [{ value: "", label: "—" }] : []),
  ...values.map((v) => ({ value: v, label: v })),
];

export function ApplicationForm({
  action,
  application,
}: {
  action: (prev: AppFormState, formData: FormData) => Promise<AppFormState>;
  application?: ApplicationFormValues;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Company"
          name="company"
          required
          defaultValue={application?.company}
        />
        <Input
          label="Job title"
          name="jobTitle"
          required
          defaultValue={application?.jobTitle}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Status"
          name="status"
          defaultValue={application?.status ?? "Saved"}
          options={opt(APPLICATION_STATUSES)}
        />
        <Select
          label="Priority"
          name="priority"
          defaultValue={application?.priority ?? ""}
          options={opt(PRIORITIES, true)}
        />
        <Select
          label="Work mode"
          name="workMode"
          defaultValue={application?.workMode ?? ""}
          options={opt(WORK_MODES, true)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Location"
          name="location"
          defaultValue={application?.location}
        />
        <Input
          label="Salary"
          name="salary"
          defaultValue={application?.salary}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Source"
          name="source"
          defaultValue={application?.source}
          placeholder="linkedin, referral…"
        />
        <Input
          label="Job URL"
          name="jobUrl"
          defaultValue={application?.jobUrl}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Recruiter"
          name="recruiter"
          defaultValue={application?.recruiter}
        />
        <Input
          label="Recruiter contact"
          name="recruiterContact"
          defaultValue={application?.recruiterContact}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date applied"
          name="dateApplied"
          type="date"
          defaultValue={application?.dateApplied ?? undefined}
        />
        <Input
          label="Follow-up date"
          name="followUpDate"
          type="date"
          defaultValue={application?.followUpDate ?? undefined}
        />
      </div>

      <Input
        label="Tags"
        name="tags"
        defaultValue={application?.tags.join(", ")}
        placeholder="dream-company, referral"
        hint="comma-separated"
      />
      <Textarea
        label="Notes"
        name="notes"
        rows={3}
        defaultValue={application?.notes}
      />

      <FormError message={state.error} />
      <div className="pt-2">
        <SubmitButton>Save application</SubmitButton>
      </div>
    </form>
  );
}
