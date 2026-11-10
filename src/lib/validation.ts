import { z } from "zod";

export const rsvpInput = z.object({
  status: z.enum(["yes", "no"]),
  wish: z.string().trim().max(300).optional().transform((v) => (v ? v : null)),
}).strict();
export type RsvpInput = z.infer<typeof rsvpInput>;

export const tierEnum = z.enum(["special", "friend", "bestie"]);
export const guestInput = z.object({
  name: z.string().trim().min(1).max(100),
  tier: tierEnum,
  personalMessage: z.string().trim().max(1000).nullish().transform((v) => (v ? v : null)),
}).strict();
export const guestPatch = guestInput.partial().strict();
export const bulkInput = z.object({ text: z.string().max(20000), tier: tierEnum }).strict();
