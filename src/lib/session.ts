import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "admin_session";
export const MAX_AGE = 60 * 60 * 24 * 7;

const key = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET missing or too short");
  return new TextEncoder().encode(s);
};

export async function signSession(): Promise<string> {
  return new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${MAX_AGE}s`).sign(key());
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try { const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] }); return payload.role === "admin"; }
  catch { return false; }
}
