import { db } from "@/lib/db";
import { getInvite, type InviteFetcher } from "@/lib/invite";

const fetchRow: InviteFetcher = async (code) => {
  const { data, error } = await db()
    .from("guests").select("name,tier,personal_message,rsvps(status,wish,updated_at)").eq("code", code).maybeSingle();
  if (error) throw error;
  return data as never;
};

export const loadInvite = (code: string) => getInvite(code, fetchRow);
