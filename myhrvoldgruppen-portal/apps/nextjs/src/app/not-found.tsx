"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <FileQuestion className="h-8 w-8 text-gray-600" />
        </div>

        <h1 className="mb-2 text-4xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Siden ble ikke funnet
        </h2>

        <p className="mb-6 text-gray-600">
          Beklager, vi finner ikke siden du leter etter. Den kan ha blitt
          flyttet eller slettet.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
          >
            <Home className="h-4 w-4" />
            Til forsiden
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Gå tilbake
          </button>
        </div>
      </div>
    </div>
  );
}
