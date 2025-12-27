"use client";

import { Button } from "@myhrvold/ui/button";

export default function SignInPage() {
  const handleSignIn = () => {
    // Replit Auth redirect
    window.location.href = "/__replauthLogin";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-600 to-teal-800">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Myhrvold<span className="text-orange-500">gruppen</span>
          </h1>
          <p className="mt-2 text-gray-600">Service Portal</p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleSignIn} className="w-full" size="lg">
            Logg inn med Replit
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Bruk din Replit-konto for å logge inn på portalen
        </p>
      </div>
    </div>
  );
}
