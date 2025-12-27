import { router, publicProcedure } from "../trpc";
import { claims, customers, suppliers, servicePartners, storkjokkenAgreements, dagligvareAgreements } from "@myhrvold/db/schema";
import { eq, count, sql, and, gte } from "drizzle-orm";

export const dashboardRouter = router({
  stats: publicProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Hent aktive reklamasjoner
    const [activeClaimsResult] = await ctx.db
      .select({ count: count() })
      .from(claims)
      .where(sql`${claims.status} NOT IN ('closed', 'resolved')`);

    // Reklamasjoner siste 30 dager
    const [recentClaimsResult] = await ctx.db
      .select({ count: count() })
      .from(claims)
      .where(gte(claims.createdAt, thirtyDaysAgo));

    // Reklamasjoner 30-60 dager siden (for trend)
    const [previousClaimsResult] = await ctx.db
      .select({ count: count() })
      .from(claims)
      .where(and(
        gte(claims.createdAt, sixtyDaysAgo),
        sql`${claims.createdAt} < ${thirtyDaysAgo}`
      ));

    // Totale kunder
    const [customersResult] = await ctx.db
      .select({ count: count() })
      .from(customers);

    // Aktive serviceavtaler
    const [storkjokkenResult] = await ctx.db
      .select({ count: count() })
      .from(storkjokkenAgreements)
      .where(eq(storkjokkenAgreements.isActive, true));

    const [dagligvareResult] = await ctx.db
      .select({ count: count() })
      .from(dagligvareAgreements)
      .where(eq(dagligvareAgreements.isActive, true));

    // Aktive servicepartnere
    const [partnersResult] = await ctx.db
      .select({ count: count() })
      .from(servicePartners)
      .where(eq(servicePartners.isActive, true));

    // Beregn trend
    const recentCount = recentClaimsResult?.count ?? 0;
    const previousCount = previousClaimsResult?.count ?? 0;
    const claimsTrend = previousCount > 0
      ? Math.round(((recentCount - previousCount) / previousCount) * 100)
      : 0;

    return {
      activeClaims: activeClaimsResult?.count ?? 0,
      claimsTrend: {
        value: Math.abs(claimsTrend),
        isPositive: claimsTrend <= 0, // Færre reklamasjoner er positivt
      },
      totalCustomers: customersResult?.count ?? 0,
      activeAgreements: (storkjokkenResult?.count ?? 0) + (dagligvareResult?.count ?? 0),
      activePartners: partnersResult?.count ?? 0,
    };
  }),

  recentClaims: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: claims.id,
        claimNumber: claims.claimNumber,
        title: claims.title,
        status: claims.status,
        priority: claims.priority,
        createdAt: claims.createdAt,
      })
      .from(claims)
      .orderBy(sql`${claims.createdAt} DESC`)
      .limit(5);
  }),

  claimsByStatus: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        status: claims.status,
        count: count(),
      })
      .from(claims)
      .groupBy(claims.status);

    const statusMap: Record<string, number> = {};
    for (const row of result) {
      statusMap[row.status ?? 'new'] = row.count;
    }

    return {
      new: statusMap['new'] ?? 0,
      in_progress: statusMap['in_progress'] ?? 0,
      pending_supplier: statusMap['pending_supplier'] ?? 0,
      resolved: statusMap['resolved'] ?? 0,
      closed: statusMap['closed'] ?? 0,
    };
  }),
});
