import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const valid = {
  name: "Priya Shah",
  email: "Priya@Example.com ",
  company: "",
  inquiryType: "hiring",
  subject: "Senior engineer role",
  message: "Hello Jaimin, we'd like to talk about a role on our platform team.",
  consent: true,
  website: "",
  startedAt: 1_700_000_000_000,
};

describe("contactSchema", () => {
  it("accepts a valid submission and normalises email", () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
    expect(r.success && r.data.email).toBe("priya@example.com");
  });

  it.each([
    ["name", { name: "J" }],
    ["email", { email: "not-an-email" }],
    ["inquiryType", { inquiryType: "spam" }],
    ["subject", { subject: "hi" }],
    ["message", { message: "too short" }],
    ["consent", { consent: false }],
  ])("rejects an invalid %s", (field, patch) => {
    const r = contactSchema.safeParse({ ...valid, ...patch });
    expect(r.success).toBe(false);
    expect(r.success ? [] : r.error.issues.map((i) => i.path[0])).toContain(field);
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(false);
  });

  it("caps message length", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
  });
});
