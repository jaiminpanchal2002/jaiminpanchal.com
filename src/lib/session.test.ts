import { describe, it, expect } from "vitest";
import { signSession, verifySession } from "./session";

describe("session", () => {
  it("round-trips a signed session", async () => {
    const token = await signSession({
      sub: "user_1",
      email: "admin@example.com",
      role: "admin",
    });
    expect(typeof token).toBe("string");

    const payload = await verifySession(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe("user_1");
    expect(payload?.email).toBe("admin@example.com");
    expect(payload?.role).toBe("admin");
  });

  it("rejects a tampered/garbage token", async () => {
    expect(await verifySession("not.a.jwt")).toBeNull();
    const token = await signSession({
      sub: "u",
      email: "e",
      role: "admin",
    });
    expect(await verifySession(token + "tamper")).toBeNull();
  });
});
