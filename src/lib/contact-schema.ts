import { z } from "zod";

export const inquiryTypes = [
  { value: "hiring", label: "Hiring opportunity" },
  { value: "product", label: "Product collaboration" },
  { value: "consulting", label: "Engineering consulting" },
  { value: "freelance", label: "Freelance project" },
  { value: "networking", label: "Networking" },
  { value: "general", label: "General inquiry" },
] as const;

const inquiryValues = inquiryTypes.map((t) => t.value) as [string, ...string[]];

/** Shared by the client form (instant feedback) and the API route (authoritative check). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(120, "Company name is too long.").optional().or(z.literal("")),
  inquiryType: z.enum(inquiryValues, { message: "Please choose an inquiry type." }),
  subject: z.string().trim().min(3, "Please add a short subject.").max(150, "Subject is too long."),
  message: z.string().trim().min(20, "Please write at least 20 characters.").max(5000, "Message is too long (5000 characters max)."),
  consent: z.literal(true, { message: "Please confirm so I can reply to you." }),
  // Spam mitigation: honeypot must stay empty; form must not be submitted instantly.
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const MIN_FILL_MS = 2500;
