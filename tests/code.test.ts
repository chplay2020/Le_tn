import { describe, expect, it } from "vitest";
import { CODE_RE, generateCode } from "@/lib/code";

describe("generateCode", () => {
  it("is 8 base62 chars", () => {
    for (let i = 0; i < 200; i++) expect(generateCode()).toMatch(CODE_RE);
  });
  it("is unique across many draws", () => {
    const s = new Set(Array.from({ length: 5000 }, generateCode));
    expect(s.size).toBe(5000);
  });
});
