import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import {
  storkjokkenAgreements,
  dagligvareAgreements,
  serviceVisits,
  servicePartners,
} from "@myhrvold/db/schema";
import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";

export const serviceRouter = router({
  // Storkjøkken-avtaler
  storkjokkenAgreements: router({
    list: publicProcedure
      .input(
        z
          .object({
            page: z.number().min(1).default(1),
            limit: z.number().min(1).max(100).default(20),
            isActive: z.boolean().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        const { page = 1, limit = 20, isActive } = input ?? {};
        const offset = (page - 1) * limit;

        const conditions = [];
        if (isActive !== undefined) {
          conditions.push(eq(storkjokkenAgreements.isActive, isActive));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [countResult] = await ctx.db
          .select({ count: count() })
          .from(storkjokkenAgreements)
          .where(whereClause);

        const data = await ctx.db
          .select()
          .from(storkjokkenAgreements)
          .where(whereClause)
          .orderBy(desc(storkjokkenAgreements.createdAt))
          .limit(limit)
          .offset(offset);

        return {
          data,
          pagination: {
            page,
            limit,
            total: countResult?.count ?? 0,
            totalPages: Math.ceil((countResult?.count ?? 0) / limit),
          },
        };
      }),

    byId: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const [agreement] = await ctx.db
          .select()
          .from(storkjokkenAgreements)
          .where(eq(storkjokkenAgreements.id, input.id));
        return agreement ?? null;
      }),
  }),

  // Dagligvare-avtaler
  dagligvareAgreements: router({
    list: publicProcedure
      .input(
        z
          .object({
            page: z.number().min(1).default(1),
            limit: z.number().min(1).max(100).default(20),
            isActive: z.boolean().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        const { page = 1, limit = 20, isActive } = input ?? {};
        const offset = (page - 1) * limit;

        const conditions = [];
        if (isActive !== undefined) {
          conditions.push(eq(dagligvareAgreements.isActive, isActive));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [countResult] = await ctx.db
          .select({ count: count() })
          .from(dagligvareAgreements)
          .where(whereClause);

        const data = await ctx.db
          .select()
          .from(dagligvareAgreements)
          .where(whereClause)
          .orderBy(desc(dagligvareAgreements.createdAt))
          .limit(limit)
          .offset(offset);

        return {
          data,
          pagination: {
            page,
            limit,
            total: countResult?.count ?? 0,
            totalPages: Math.ceil((countResult?.count ?? 0) / limit),
          },
        };
      }),
  }),

  // Servicebesøk
  visits: router({
    list: publicProcedure
      .input(
        z
          .object({
            page: z.number().min(1).default(1),
            limit: z.number().min(1).max(100).default(20),
            status: z
              .enum(["all", "scheduled", "in_progress", "completed", "cancelled"])
              .default("all"),
            fromDate: z.date().optional(),
            toDate: z.date().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        const { page = 1, limit = 20, status = "all", fromDate, toDate } = input ?? {};
        const offset = (page - 1) * limit;

        const conditions = [];
        if (status !== "all") {
          conditions.push(eq(serviceVisits.status, status));
        }
        if (fromDate) {
          conditions.push(gte(serviceVisits.scheduledDate, fromDate));
        }
        if (toDate) {
          conditions.push(lte(serviceVisits.scheduledDate, toDate));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [countResult] = await ctx.db
          .select({ count: count() })
          .from(serviceVisits)
          .where(whereClause);

        const data = await ctx.db
          .select()
          .from(serviceVisits)
          .where(whereClause)
          .orderBy(desc(serviceVisits.scheduledDate))
          .limit(limit)
          .offset(offset);

        return {
          data,
          pagination: {
            page,
            limit,
            total: countResult?.count ?? 0,
            totalPages: Math.ceil((countResult?.count ?? 0) / limit),
          },
        };
      }),

    upcoming: publicProcedure.query(async ({ ctx }) => {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      return ctx.db
        .select()
        .from(serviceVisits)
        .where(
          and(
            gte(serviceVisits.scheduledDate, today),
            lte(serviceVisits.scheduledDate, nextWeek),
            sql`${serviceVisits.status} IN ('scheduled', 'in_progress')`
          )
        )
        .orderBy(serviceVisits.scheduledDate)
        .limit(10);
    }),

    create: protectedProcedure
      .input(
        z.object({
          agreementId: z.string().uuid(),
          agreementType: z.enum(["storkjokken", "dagligvare"]),
          scheduledDate: z.date(),
          technicianId: z.string().uuid().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const [visit] = await ctx.db
          .insert(serviceVisits)
          .values({
            ...input,
            createdBy: ctx.userId,
          })
          .returning();
        return visit;
      }),
  }),

  // Servicepartnere
  partners: router({
    list: publicProcedure
      .input(
        z
          .object({
            isActive: z.boolean().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        const conditions = [];
        if (input?.isActive !== undefined) {
          conditions.push(eq(servicePartners.isActive, input.isActive));
        }

        return ctx.db
          .select()
          .from(servicePartners)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(servicePartners.name);
      }),
  }),

  // Dashboard stats
  stats: publicProcedure.query(async ({ ctx }) => {
    const [storkjokkenCount] = await ctx.db
      .select({ count: count() })
      .from(storkjokkenAgreements)
      .where(eq(storkjokkenAgreements.isActive, true));

    const [dagligvareCount] = await ctx.db
      .select({ count: count() })
      .from(dagligvareAgreements)
      .where(eq(dagligvareAgreements.isActive, true));

    const today = new Date();
    const [upcomingVisits] = await ctx.db
      .select({ count: count() })
      .from(serviceVisits)
      .where(
        and(
          gte(serviceVisits.scheduledDate, today),
          sql`${serviceVisits.status} IN ('scheduled')`
        )
      );

    const [activePartners] = await ctx.db
      .select({ count: count() })
      .from(servicePartners)
      .where(eq(servicePartners.isActive, true));

    return {
      storkjokkenAgreements: storkjokkenCount?.count ?? 0,
      dagligvareAgreements: dagligvareCount?.count ?? 0,
      totalAgreements: (storkjokkenCount?.count ?? 0) + (dagligvareCount?.count ?? 0),
      upcomingVisits: upcomingVisits?.count ?? 0,
      activePartners: activePartners?.count ?? 0,
    };
  }),
});
