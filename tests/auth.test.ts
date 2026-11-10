import { beforeAll, describe, expect, it } from "vitest";
import { checkPassword } from "@/lib/auth";
import { signSession, verifySession } from "@/lib/session";

beforeAll(() => { process.env.SESSION_SECRET = "x".repeat(40); });

describe("auth", () => {
  it("checks password in constant time shape", () => {
    expect(checkPassword("abc", "abc")).toBe(true);
    expect(checkPassword("abd", "abc")).toBe(false);
    expect(checkPassword("", "abc")).toBe(false);
    expect(checkPassword("abc", "")).toBe(false);
  });
  it("session round trip and tamper", async () => {
    const t = await signSession();
    expect(await verifySession(t)).toBe(true);
    expect(await verifySession(t.slice(0, -2) + "xx")).toBe(false);
    expect(await verifySession(undefined)).toBe(false);
    expect(await verifySession("garbage")).toBe(false);
  });
});
