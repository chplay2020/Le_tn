import type { Metadata } from "next";
import { InviteCard } from "@/components/invite-card";
import { loadInvite } from "@/lib/invite-db";
import { InviteExperience } from "@/components/invite-experience";
import { RsvpForm } from "@/components/rsvp-form";
import { getSettings, parseDeadline } from "@/lib/settings";
import { isRsvpOpen } from "@/lib/rsvp";
import { THEMES } from "@/config/event";
import { NotFoundCard } from "@/components/not-found-card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thiệp mời tốt nghiệp – Trần Thành", robots: { index: false, follow: false } };

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let invite = null;
  try { invite = await loadInvite(code); } catch { /* treated as unavailable */ }
  if (!invite) return <NotFoundCard />;
  let deadline = parseDeadline(undefined);
  try { deadline = parseDeadline((await getSettings()).rsvp_deadline); } catch { /* default deadline */ }
  const closed = !isRsvpOpen(new Date(), deadline);
  return (
    <InviteExperience name={invite.name} tier={invite.tier}>
      <InviteCard name={invite.name} tier={invite.tier} message={invite.message} />
      <div style={{ background: THEMES[invite.tier].bg }} className="px-4 pb-1"><RsvpForm code={code} tier={invite.tier} closed={closed} initial={invite.rsvp && { status: invite.rsvp.status, wish: invite.rsvp.wish }} /></div>
    </InviteExperience>
  );
}
