import { describe, it, expect } from "vitest";
import { isApplicationStatus, APPLICATION_STATUSES } from "./constants";

describe("isApplicationStatus", () => {
  it("accepts valid statuses", () => {
    expect(isApplicationStatus("Offer")).toBe(true);
    expect(isApplicationStatus("Technical Interview")).toBe(true);
    for (const s of APPLICATION_STATUSES) {
      expect(isApplicationStatus(s)).toBe(true);
    }
  });

  it("rejects invalid statuses", () => {
    expect(isApplicationStatus("Nope")).toBe(false);
    expect(isApplicationStatus("")).toBe(false);
    expect(isApplicationStatus("offer")).toBe(false); // case-sensitive
  });
});
