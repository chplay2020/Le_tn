"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    setBusy(false);
    if (r.ok) { router.replace("/admin"); router.refresh(); }
    else setErr(r.status === 429 ? "Thử quá nhiều lần, vui lòng đợi ít phút." : "Mật khẩu không đúng.");
  }

  return (
    <main className="min-h-screen grid place-items-center p-4 bg-stone-100 text-stone-900">
      <form onSubmit={submit} className="w-full max-w-xs space-y-4 bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Quản trị thiệp</h1>
        <label className="block text-sm">Mật khẩu
          <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required
            className="mt-1 w-full rounded-lg border border-stone-300 p-3 text-base" />
        </label>
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        <button disabled={busy} className="w-full min-h-11 rounded-lg bg-stone-900 text-white disabled:opacity-60">{busy ? "Đang vào…" : "Đăng nhập"}</button>
      </form>
    </main>
  );
}
