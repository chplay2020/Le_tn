"use client";
import { useState } from "react";
import type { AdminSettings } from "@/lib/settings";

const input = "mt-1 w-full rounded-lg border border-stone-300 p-2 text-base bg-white";

export function SettingsPanel({ initial }: { initial: AdminSettings }) {
  const [s, setS] = useState(initial);
  const [msg, setMsg] = useState("");
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    setMsg(r.ok ? "Đã lưu." : "Không lưu được."); setTimeout(() => setMsg(""), 2500);
  }
  return (
    <form onSubmit={save} className="rounded-xl bg-white border border-stone-200 p-4 space-y-3 text-sm">
      <h2 className="font-medium text-base">Cài đặt thiệp</h2>
      <label className="block">Hạn chót trả lời (hết ngày này, giờ VN)
        <input type="date" className={input} value={s.rsvpDate} onChange={(e) => setS({ ...s, rsvpDate: e.target.value })} required /></label>
      <label className="block">Lưu ý (dress code, gửi xe… – để trống thì ẩn)
        <textarea className={input} rows={3} maxLength={1000} value={s.notes} onChange={(e) => setS({ ...s, notes: e.target.value })} /></label>
      <label className="block">After-party (chỉ hiện cho “Anh em chí cốt” – để trống thì ẩn)
        <textarea className={input} rows={3} maxLength={1000} value={s.afterParty} onChange={(e) => setS({ ...s, afterParty: e.target.value })} /></label>
      <button className="min-h-10 rounded-lg bg-stone-900 px-4 text-white">Lưu cài đặt</button>
      {msg && <span role="status" className="ml-3">{msg}</span>}
    </form>
  );
}
