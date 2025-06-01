import { z } from "zod";

// Define the Zod schema for a Capsule object (client-side representation)
export const capsuleSchema = z.object({
  id: z.number(),
  title: z.string(),
  message: z.string(),
  unlockDate: z.string().datetime(),
  creatorAddress: z.string(),
  isPrivate: z.boolean(),
  tokenAmount: z.string().optional().nullable(),
  nftId: z.string().optional().nullable(),
  nftName: z.string().optional().nullable(),
  nftCollection: z.string().optional().nullable(),
  status: z.enum(["locked", "unlockable", "claimed"]),
  claimedAt: z.string().datetime().optional().nullable(),
  createdAt: z.string().datetime(),
});

// Export types based on the Zod schemas
export type Capsule = z.infer<typeof capsuleSchema>;
