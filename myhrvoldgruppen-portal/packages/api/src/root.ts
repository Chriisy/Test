import { router } from "./trpc";
import { claimsRouter } from "./routers/claims";
import { customersRouter } from "./routers/customers";
import { dashboardRouter } from "./routers/dashboard";

export const appRouter = router({
  claims: claimsRouter,
  customers: customersRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
