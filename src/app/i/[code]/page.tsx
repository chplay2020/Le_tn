import type { Metadata } from "next";
import { InviteCard } from "@/components/invite-card";
import { loadInvite } from "@/lib/invite-db";
import { NotFoundCard } from "@/components/not-found-card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thiệp mời tốt nghiệp – Trần Thành", robots: { index: false, follow: false } };

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let invite = null;
  try { invite = await loadInvite(code); } catch { /* treated as unavailable */ }
  if (!invite) return <NotFoundCard />;
  return <InviteCard name={invite.name} tier={invite.tier} message={invite.message} />;
}
