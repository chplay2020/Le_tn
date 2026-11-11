"use client";
import { useState } from "react";
import { THEMES, type Tier } from "@/config/event";

type Status = "yes" | "no";
type Props = { code: string; tier: Tier; initial: { status: Status; wish: string | null } | null; closed: boolean };

const ERR: Record<string, string> = {
  closed: "Đã hết hạn trả lời.", rate_limited: "Bạn thao tác hơi nhanh, thử lại sau một lát nhé.",
  invalid: "Thông tin chưa hợp lệ.", not_found: "Không tìm thấy thiệp.",
};

export function RsvpForm({ code, tier, initial, closed }: Props) {
  const t = THEMES[tier];
  const [saved, setSaved] = useState(initial);
  const [status, setStatus] = useState<Status | null>(initial?.status ?? null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit() {
    if (!status) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/invite/${code}/rsvp`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setSaved({ status: data.status, wish: data.wish }); setMsg({ ok: true, text: "Đã lưu câu trả lời của bạn. Cảm ơn bạn!" }); }
      else setMsg({ ok: false, text: ERR[data.error] ?? "Có lỗi xảy ra, vui lòng thử lại." });
    } catch { setMsg({ ok: false, text: "Mất kết nối, vui lòng thử lại." }); }
    finally { setBusy(false); }
  }

  const label = saved ? (saved.status === "yes" ? "Bạn đã trả lời: Tham dự" : "Bạn đã trả lời: Không tham dự") : null;
  const opt = (v: Status, text: string) => (
    <button type="button" aria-pressed={status === v} disabled={closed || busy} onClick={() => setStatus(v)}
      style={status === v ? { background: t.accent, color: t.card, borderColor: t.accent } : { borderColor: t.accent }}
      className="flex-1 min-h-12 rounded-full border px-2 text-sm leading-tight disabled:opacity-60">{text}</button>
  );

  return (
    <section aria-labelledby="rsvp-h" style={{ background: t.card, borderColor: t.accent, color: t.fg }}
      className="w-full border rounded-2xl px-6 py-8">
      <h2 id="rsvp-h" className="font-serif-d text-xl text-center">Bạn sẽ đến chứ?</h2>
      {label && <p role="status" className="mt-2 text-center text-sm opacity-80">{label}</p>}
      {closed && <p className="mt-2 text-center text-sm">Đã hết hạn trả lời{saved ? "." : " – bạn vẫn có thể liên hệ trực tiếp với mình nhé."}</p>}
      <div className="mt-5 flex gap-3">{opt("yes", "Tham dự")}{opt("no", "Không tham dự")}</div>
      {!closed && (
        <button type="button" onClick={submit} disabled={!status || busy} style={{ background: t.accent, color: t.card }}
          className="mt-5 w-full min-h-12 rounded-full text-sm disabled:opacity-50">{busy ? "Đang lưu…" : saved ? "Cập nhật" : "Gửi"}</button>
      )}
      {msg && <p role="status" className={`mt-3 text-center text-sm ${msg.ok ? "" : "font-medium"}`}>{msg.text}</p>}
    </section>
  );
}
