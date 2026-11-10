import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InviteCard } from "@/components/invite-card";
import { loadInvite } from "@/lib/invite-db";
import { InviteExperience } from "@/components/invite-experience";
import { RsvpForm } from "@/components/rsvp-form";
import { getSettings, parseDeadline } from "@/lib/settings";
import { isRsvpOpen } from "@/lib/rsvp";
import { THEMES } from "@/config/event";
import { Gallery } from "@/components/gallery";
import { listGallery } from "@/lib/gallery";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Thiệp mời tốt nghiệp – Trần Thành", robots: { index: false, follow: false } };

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let invite = null;
  try { invite = await loadInvite(code); } catch { /* treated as unavailable */ }
  if (!invite) notFound();
  let settings: Record<string, string> = {};
  try { settings = await getSettings(); } catch { /* defaults */ }
  let photos: string[] = [];
  try { photos = (await listGallery()).map((g) => g.url); } catch { /* hide gallery */ }
  const deadline = parseDeadline(settings.rsvp_deadline);
  const closed = !isRsvpOpen(new Date(), deadline);
  return (
    <InviteExperience name={invite.name} tier={invite.tier}>
      <InviteCard name={invite.name} tier={invite.tier} message={invite.message} notes={settings.notes} afterParty={invite.tier === "bestie" ? settings.after_party : null} />
      <div style={{ background: THEMES[invite.tier].bg, color: THEMES[invite.tier].fg }}>
        <Gallery urls={photos} />
        <div className="px-4 pb-1"><RsvpForm code={code} tier={invite.tier} closed={closed} initial={invite.rsvp && { status: invite.rsvp.status, wish: invite.rsvp.wish }} /></div>
      </div>
    </InviteExperience>
  );
}
