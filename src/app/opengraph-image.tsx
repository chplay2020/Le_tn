import { ImageResponse } from "next/og";

export const alt = "Thiệp mời lễ tốt nghiệp – Trần Thành";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Og() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f7f1e3", color: "#3b3326", border: "14px solid #b8903a" }}>
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#b8903a" }}>THIỆP MỜI</div>
        <div style={{ fontSize: 84, marginTop: 24, fontFamily: "serif" }}>Lễ tốt nghiệp</div>
        <div style={{ fontSize: 56, marginTop: 8, fontFamily: "serif" }}>Trần Thành</div>
        <div style={{ fontSize: 32, marginTop: 40 }}>10:30 · 18/11/2026 · Nhà hát Hòa Bình</div>
      </div>
    ),
    size,
  );
}
