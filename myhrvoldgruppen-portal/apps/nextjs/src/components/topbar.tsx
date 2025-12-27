"use client";

import { useAuth } from "../providers/auth-provider";
import { Button } from "@myhrvold/ui/button";
import { LogOut, Search, Bell, User } from "lucide-react";

export function Topbar() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Søk etter kunder, reklamasjoner..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          ) : user ? (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-sm text-gray-500">Ikke innlogget</span>
          )}
        </div>
      </div>
    </header>
  );
}
