import { describe, expect, it } from "vitest";
import { sniffImage } from "@/lib/image";

const pad = (a: number[]) => new Uint8Array([...a, ...Array(20).fill(0)]);
describe("sniffImage", () => {
  it("detects jpg/png/webp", () => {
    expect(sniffImage(pad([0xff, 0xd8, 0xff, 0xe0]))?.ext).toBe("jpg");
    expect(sniffImage(pad([0x89, 0x50, 0x4e, 0x47]))?.ext).toBe("png");
    expect(sniffImage(new Uint8Array([...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBP"), 0, 0]))?.ext).toBe("webp");
  });
  it("rejects svg/html/other", () => {
    expect(sniffImage(new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>"))).toBeNull();
    expect(sniffImage(new TextEncoder().encode("<html><script>alert(1)</script></html>"))).toBeNull();
  });
});
