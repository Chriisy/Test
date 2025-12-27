import "server-only";
import { createTRPCContext, appRouter, createCallerFactory } from "@myhrvold/api";
import { headers } from "next/headers";
import { cache } from "react";

const createContext = cache(async () => {
  const heads = await headers();
  return createTRPCContext({
    headers: heads,
  });
});

const createCaller = createCallerFactory(appRouter);

export const api = cache(async () => {
  const context = await createContext();
  return createCaller(context);
});
