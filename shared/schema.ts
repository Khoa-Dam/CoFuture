import { z } from "zod";

// Define the Zod schema for inserting a capsule
export const insertCapsuleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  unlockDate: z.string().datetime(),
  creatorAddress: z.string().optional(), // Optional on client side as it might come from wallet hook
  isPrivate: z.boolean().default(false),
  tokenAmount: z.string().optional(),
  nftId: z.string().optional(),
  nftName: z.string().optional(),
  nftCollection: z.string().optional(),
});

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
export type InsertCapsule = z.infer<typeof insertCapsuleSchema>;
export type Capsule = z.infer<typeof capsuleSchema>;
