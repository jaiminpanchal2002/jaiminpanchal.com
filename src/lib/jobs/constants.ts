export const APPLICATION_STATUSES = [
  "Saved",
  "Interested",
  "Applied",
  "Recruiter Contacted",
  "Screening",
  "Technical Interview",
  "HR Interview",
  "Final Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Statuses that represent an active, in-progress pipeline (for analytics). */
export const ACTIVE_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Recruiter Contacted",
  "Screening",
  "Technical Interview",
  "HR Interview",
  "Final Interview",
];

export const INTERVIEW_STATUSES: ApplicationStatus[] = [
  "Screening",
  "Technical Interview",
  "HR Interview",
  "Final Interview",
];

export const WORK_MODES = ["remote", "hybrid", "onsite"] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;

export const JOB_STATUSES = ["new", "saved", "ignored", "applied"] as const;

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}
