import type { NextConfig } from "next";

const host = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : "vposhaduwmlayldedjmu.supabase.co";
const config: NextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: "https", hostname: host, pathname: "/storage/v1/object/public/gallery/**" }] },
};
export default config;
