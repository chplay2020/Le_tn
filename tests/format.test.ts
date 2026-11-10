import { describe, expect, it } from "vitest";
import { eventTimeText } from "@/lib/format";

describe("format", () => {
  it("shows 10:30 regardless of server timezone", () => { expect(eventTimeText()).toBe("10:30"); });
});
