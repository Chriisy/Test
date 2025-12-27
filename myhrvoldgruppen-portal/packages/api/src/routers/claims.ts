import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { claims } from "@myhrvold/db/schema";
import { eq, desc } from "drizzle-orm";

export const claimsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(claims)
      .orderBy(desc(claims.createdAt))
      .limit(50);
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [claim] = await ctx.db
        .select()
        .from(claims)
        .where(eq(claims.id, input.id));
      return claim ?? null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        customerId: z.string().uuid().optional(),
        productName: z.string().optional(),
        serialNumber: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const claimNumber = `RK-${Date.now()}`;
      const [newClaim] = await ctx.db
        .insert(claims)
        .values({
          ...input,
          claimNumber,
          createdBy: ctx.userId,
        })
        .returning();
      return newClaim;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(["new", "in_progress", "waiting", "resolved", "closed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(claims)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(claims.id, input.id))
        .returning();
      return updated;
    }),
});
