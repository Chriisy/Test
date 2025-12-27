import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { claims, customers } from "@myhrvold/db/schema";
import { eq, desc, sql, ilike, and, or, count } from "drizzle-orm";

const listInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(["all", "new", "in_progress", "pending_supplier", "resolved", "closed"]).default("all"),
  priority: z.enum(["all", "low", "medium", "high", "urgent"]).default("all"),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "claimNumber", "priority"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const claimsRouter = router({
  list: publicProcedure
    .input(listInputSchema.optional())
    .query(async ({ ctx, input }) => {
      const { page = 1, limit = 20, status = "all", priority = "all", search, sortBy = "createdAt", sortOrder = "desc" } = input ?? {};
      const offset = (page - 1) * limit;

      // Bygg WHERE-betingelser
      const conditions = [];

      if (status !== "all") {
        conditions.push(eq(claims.status, status));
      }

      if (priority !== "all") {
        conditions.push(eq(claims.priority, priority));
      }

      if (search) {
        conditions.push(
          or(
            ilike(claims.claimNumber, `%${search}%`),
            ilike(claims.title, `%${search}%`),
            ilike(claims.description, `%${search}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Hent totalt antall
      const [countResult] = await ctx.db
        .select({ count: count() })
        .from(claims)
        .where(whereClause);

      const total = countResult?.count ?? 0;

      // Hent data med sortering
      const sortColumn = {
        createdAt: claims.createdAt,
        updatedAt: claims.updatedAt,
        claimNumber: claims.claimNumber,
        priority: claims.priority,
      }[sortBy];

      const orderFn = sortOrder === "desc" ? desc : (col: any) => col;

      const data = await ctx.db
        .select({
          id: claims.id,
          claimNumber: claims.claimNumber,
          title: claims.title,
          description: claims.description,
          status: claims.status,
          priority: claims.priority,
          productName: claims.productName,
          serialNumber: claims.serialNumber,
          customerId: claims.customerId,
          createdAt: claims.createdAt,
          updatedAt: claims.updatedAt,
        })
        .from(claims)
        .where(whereClause)
        .orderBy(sortOrder === "desc" ? desc(sortColumn) : sortColumn)
        .limit(limit)
        .offset(offset);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
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
