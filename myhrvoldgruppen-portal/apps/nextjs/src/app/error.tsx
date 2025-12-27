"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error til error tracking service (f.eks. Sentry)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Noe gikk galt
        </h1>

        <p className="mb-6 text-gray-600">
          En uventet feil har oppstått. Vennligst prøv igjen eller kontakt
          support hvis problemet vedvarer.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 rounded-lg bg-gray-100 p-4 text-left">
            <p className="text-xs font-medium text-gray-500">Feilmelding:</p>
            <p className="mt-1 font-mono text-sm text-red-600">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-gray-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
          >
            <RefreshCw className="h-4 w-4" />
            Prøv igjen
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            Til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}
