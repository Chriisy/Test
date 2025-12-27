import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { customers } from "@myhrvold/db/schema";
import { eq, ilike, desc } from "drizzle-orm";

export const customersRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(100);
  }),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(customers)
        .where(ilike(customers.name, `%${input.query}%`))
        .limit(20);
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [customer] = await ctx.db
        .select()
        .from(customers)
        .where(eq(customers.id, input.id));
      return customer ?? null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        orgNumber: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        contactPerson: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newCustomer] = await ctx.db
        .insert(customers)
        .values(input)
        .returning();
      return newCustomer;
    }),
});
