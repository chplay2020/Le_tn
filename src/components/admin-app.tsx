"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminGuest } from "@/lib/guests"; // type-only
import { STATUS_LABEL, TIER_LABEL } from "@/lib/csv";
import { inviteMessage } from "@/lib/invite-message";

type Tier = AdminGuest["tier"];
const input = "w-full rounded-lg border border-stone-300 p-2 text-base bg-white";
const btn = "min-h-10 rounded-lg border border-stone-300 px-3 text-sm bg-white";

async function api(url: string, method: string, body?: unknown) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  return { ok: r.ok, data: await r.json().catch(() => null) };
}

export function AdminApp({ initial, settings }: { initial: AdminGuest[]; settings: React.ReactNode }) {
  const router = useRouter();
  const [guests, setGuests] = useState(initial);
  const [fTier, setFTier] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [form, setForm] = useState({ name: "", tier: "friend" as Tier, personalMessage: "" });
  const [bulk, setBulk] = useState({ text: "", tier: "friend" as Tier });
  const [edit, setEdit] = useState<AdminGuest | null>(null);
  const [note, setNote] = useState("");

  const status = (g: AdminGuest) => g.rsvp?.status ?? "none";
  const shown = useMemo(() => guests.filter((g) => (!fTier || g.tier === fTier) && (!fStatus || status(g) === fStatus)), [guests, fTier, fStatus]);
  const stats = useMemo(() => ({ total: guests.length, yes: guests.filter((g) => status(g) === "yes").length, no: guests.filter((g) => status(g) === "no").length, none: guests.filter((g) => status(g) === "none").length }), [guests]);
  const link = (g: AdminGuest) => `${window.location.origin}/i/${g.code}`;
  const flash = (t: string) => { setNote(t); setTimeout(() => setNote(""), 2500); };
  const copy = async (t: string, ok: string) => { try { await navigator.clipboard.writeText(t); flash(ok); } catch { flash("Không copy được, hãy copy thủ công."); } };

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const r = await api("/api/admin/guests", "POST", form);
    if (r.ok) { setGuests([r.data, ...guests]); setForm({ ...form, name: "", personalMessage: "" }); } else flash("Không thêm được, kiểm tra lại thông tin.");
  }
  async function addBulk() {
    const r = await api("/api/admin/guests/bulk", "POST", bulk);
    if (r.ok) { setGuests([...r.data, ...guests]); setBulk({ ...bulk, text: "" }); flash(`Đã tạo ${r.data.length} link.`); } else flash("Danh sách không hợp lệ.");
  }
  async function save() {
    if (!edit) return;
    const r = await api(`/api/admin/guests/${edit.id}`, "PATCH", { name: edit.name, tier: edit.tier, personalMessage: edit.personalMessage ?? "" });
    if (r.ok) { setGuests(guests.map((g) => (g.id === edit.id ? r.data : g))); setEdit(null); } else flash("Không lưu được.");
  }
  async function remove(g: AdminGuest) {
    if (!confirm(`Xóa ${g.name}? Link của họ sẽ không còn dùng được.`)) return;
    const r = await api(`/api/admin/guests/${g.id}`, "DELETE");
    if (r.ok) setGuests(guests.filter((x) => x.id !== g.id)); else flash("Không xóa được.");
  }
  async function logout() { await api("/api/admin/logout", "POST"); router.replace("/admin/login"); router.refresh(); }

  return (
    <main className="mx-auto max-w-4xl p-4 space-y-6 bg-stone-50 text-stone-900 min-h-screen">
      <header className="flex items-center justify-between"><h1 className="text-xl font-semibold">Quản lý khách mời</h1>
        <button className={btn} onClick={logout}>Đăng xuất</button></header>
      {note && <p role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">{note}</p>}

      <section aria-label="Thống kê" className="grid grid-cols-4 gap-2 text-center text-sm">
        {([["Tổng", stats.total], ["Tham dự", stats.yes], ["Không", stats.no], ["Chưa trả lời", stats.none]] as const).map(([l, n]) => (
          <div key={l} className="rounded-lg bg-white p-3 border border-stone-200"><div className="text-2xl font-semibold">{n}</div>{l}</div>))}
      </section>

      <section className="rounded-xl bg-white border border-stone-200 p-4 space-y-3">
        <h2 className="font-medium">Thêm khách</h2>
        <form onSubmit={add} className="grid gap-2 sm:grid-cols-2">
          <input className={input} placeholder="Tên khách" aria-label="Tên khách" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
          <select className={input} aria-label="Loại thiệp" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as Tier })}>
            {Object.entries(TIER_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <textarea className={`${input} sm:col-span-2`} placeholder="Lời nhắn riêng (tùy chọn)" aria-label="Lời nhắn riêng" rows={2} maxLength={1000} value={form.personalMessage} onChange={(e) => setForm({ ...form, personalMessage: e.target.value })} />
          <button className={`${btn} sm:col-span-2 bg-stone-900 text-white`}>Thêm & tạo link</button>
        </form>
        <details><summary className="cursor-pointer text-sm">Nhập hàng loạt (mỗi dòng một tên)</summary>
          <div className="mt-2 grid gap-2">
            <textarea className={input} rows={4} aria-label="Danh sách tên" value={bulk.text} onChange={(e) => setBulk({ ...bulk, text: e.target.value })} />
            <select className={input} aria-label="Loại thiệp cho cả danh sách" value={bulk.tier} onChange={(e) => setBulk({ ...bulk, tier: e.target.value as Tier })}>
              {Object.entries(TIER_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            <button type="button" className={btn} onClick={addBulk} disabled={!bulk.text.trim()}>Tạo link hàng loạt</button>
          </div></details>
      </section>

      {settings}

      <section className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <select className={`${input} w-auto`} aria-label="Lọc loại" value={fTier} onChange={(e) => setFTier(e.target.value)}><option value="">Mọi loại</option>
            {Object.entries(TIER_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <select className={`${input} w-auto`} aria-label="Lọc trạng thái" value={fStatus} onChange={(e) => setFStatus(e.target.value)}><option value="">Mọi trạng thái</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <a className={`${btn} inline-flex items-center`} href="/api/admin/export">Xuất CSV</a>
        </div>
        <ul className="space-y-2">
          {shown.map((g) => (
            <li key={g.id} className="rounded-xl bg-white border border-stone-200 p-3 text-sm">
              {edit?.id === g.id ? (
                <div className="grid gap-2">
                  <input className={input} aria-label="Tên" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
                  <select className={input} aria-label="Loại" value={edit.tier} onChange={(e) => setEdit({ ...edit, tier: e.target.value as Tier })}>
                    {Object.entries(TIER_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
                  <textarea className={input} rows={2} aria-label="Lời nhắn riêng" value={edit.personalMessage ?? ""} onChange={(e) => setEdit({ ...edit, personalMessage: e.target.value })} />
                  <div className="flex gap-2"><button className={`${btn} bg-stone-900 text-white`} onClick={save}>Lưu</button><button className={btn} onClick={() => setEdit(null)}>Hủy</button></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap justify-between gap-2">
                    <div><b>{g.name}</b> · {TIER_LABEL[g.tier]} · <span>{STATUS_LABEL[status(g)]}</span></div>
                    {g.rsvp && <time className="opacity-60" dateTime={g.rsvp.updatedAt}>{new Date(g.rsvp.updatedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</time>}
                  </div>
                  {g.rsvp?.wish && <p className="mt-1 italic opacity-80">“{g.rsvp.wish}”</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className={btn} onClick={() => copy(link(g), "Đã copy link")}>Copy link</button>
                    <button className={btn} onClick={() => copy(inviteMessage(g, link(g)), "Đã copy tin nhắn mời")}>Copy tin nhắn mời</button>
                    <a className={`${btn} inline-flex items-center`} href={`/i/${g.code}`} target="_blank" rel="noopener noreferrer">Xem thiệp</a>
                    <button className={btn} onClick={() => setEdit(g)}>Sửa</button>
                    <button className={`${btn} text-red-700`} onClick={() => remove(g)}>Xóa</button>
                  </div>
                </>
              )}
            </li>))}
          {!shown.length && <li className="text-sm opacity-60">Chưa có khách nào.</li>}
        </ul>
      </section>
    </main>
  );
}
