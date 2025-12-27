import { router } from "./trpc";
import { claimsRouter } from "./routers/claims";
import { customersRouter } from "./routers/customers";

export const appRouter = router({
  claims: claimsRouter,
  customers: customersRouter,
});

export type AppRouter = typeof appRouter;
