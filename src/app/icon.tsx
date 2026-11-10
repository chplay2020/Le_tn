import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#14110d", color: "#e0b84f", fontSize: 40, fontFamily: "serif", borderRadius: 14 }}>T</div>),
    size,
  );
}
