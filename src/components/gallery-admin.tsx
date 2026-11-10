"use client";
import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";

const btn = "min-h-9 rounded-lg border border-stone-300 px-2 text-xs bg-white";

export function GalleryAdmin({ initial }: { initial: GalleryItem[] }) {
  const [items, setItems] = useState(initial);
  const [msg, setMsg] = useState("");
  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 3000); };

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []); e.target.value = "";
    for (const f of files) {
      const fd = new FormData(); fd.append("file", f);
      const r = await fetch("/api/admin/gallery", { method: "POST", body: fd });
      if (r.ok) { const it = await r.json(); setItems((p) => [...p, it]); } else flash(`${f.name}: ảnh không hợp lệ (JPG/PNG/WebP ≤ 4MB).`);
    }
  }
  async function del(id: string) {
    if (!confirm("Xóa ảnh này?")) return;
    const r = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (r.ok) setItems((p) => p.filter((x) => x.id !== id)); else flash("Không xóa được.");
  }
  async function move(i: number, d: -1 | 1) {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]; setItems(next);
    const r = await fetch("/api/admin/gallery", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next.map((x) => x.id) }) });
    if (!r.ok) flash("Không lưu được thứ tự.");
  }
  return (
    <section className="rounded-xl bg-white border border-stone-200 p-4 space-y-3 text-sm">
      <h2 className="font-medium text-base">Ảnh (gallery)</h2>
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={upload} aria-label="Tải ảnh lên" />
      {msg && <p role="status">{msg}</p>}
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((it, i) => (
          <li key={it.id} className="space-y-1">
            <div className="relative aspect-square overflow-hidden rounded-lg"><Image src={it.url} alt={`Ảnh ${i + 1}`} fill sizes="120px" className="object-cover" /></div>
            <div className="flex gap-1"><button className={btn} onClick={() => move(i, -1)} aria-label="Lên">←</button><button className={btn} onClick={() => move(i, 1)} aria-label="Xuống">→</button><button className={`${btn} text-red-700`} onClick={() => del(it.id)}>Xóa</button></div>
          </li>))}
      </ul>
      {!items.length && <p className="opacity-60">Chưa có ảnh. Khi trống, mục ảnh sẽ ẩn trên thiệp.</p>}
    </section>
  );
}
