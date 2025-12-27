import { router } from "./trpc";
import { claimsRouter } from "./routers/claims";
import { customersRouter } from "./routers/customers";
import { dashboardRouter } from "./routers/dashboard";
import { serviceRouter } from "./routers/service";
import { notificationsRouter, emailRouter } from "./routers/notifications";

export const appRouter = router({
  claims: claimsRouter,
  customers: customersRouter,
  dashboard: dashboardRouter,
  service: serviceRouter,
  notifications: notificationsRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
