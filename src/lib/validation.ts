import { z } from "zod";

export const rsvpInput = z.object({
  status: z.enum(["yes", "no"]),
  wish: z.string().trim().max(300).optional().transform((v) => (v ? v : null)),
}).strict();
export type RsvpInput = z.infer<typeof rsvpInput>;
