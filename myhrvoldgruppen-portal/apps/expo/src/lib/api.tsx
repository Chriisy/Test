import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState, type ReactNode } from "react";
import SuperJSON from "superjson";
import type { AppRouter } from "@myhrvold/api";
import { authStorage } from "./auth-storage";

export const api = createTRPCReact<AppRouter>();

// API base URL - sett dette til produksjonsserveren
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            retry: 2,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            __DEV__ || (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${API_URL}/api/trpc`,
          transformer: SuperJSON,
          async headers() {
            const token = await authStorage.getToken();
            return {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
