import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin", "vietnamese"], display: "swap", variable: "--font-serif-load" });

export const metadata: Metadata = { title: "Thiệp mời tốt nghiệp – Trần Thành", description: "Trân trọng kính mời bạn đến dự lễ tốt nghiệp của Trần Thành – 10:30, 18/11/2026, Nhà hát Hòa Bình.", robots: { index: false, follow: false } };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="vi" className={serif.variable}><body>{children}</body></html>);
}
