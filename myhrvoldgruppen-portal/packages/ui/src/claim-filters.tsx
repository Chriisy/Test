"use client";

import { Search, Filter, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface ClaimFiltersProps {
  search: string;
  status: string;
  priority: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onClear: () => void;
}

const statusOptions = [
  { value: "all", label: "Alle statuser" },
  { value: "new", label: "Ny" },
  { value: "in_progress", label: "Pågår" },
  { value: "pending_supplier", label: "Venter leverandør" },
  { value: "resolved", label: "Løst" },
  { value: "closed", label: "Lukket" },
];

const priorityOptions = [
  { value: "all", label: "Alle prioriteter" },
  { value: "low", label: "Lav" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "Høy" },
  { value: "urgent", label: "Haster" },
];

export function ClaimFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onClear,
}: ClaimFiltersProps) {
  const hasFilters = search || status !== "all" || priority !== "all";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Søk etter reklamasjonsnummer, tittel..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <Button variant="outline" size="sm" onClick={onClear}>
            <X className="mr-1 h-4 w-4" />
            Nullstill
          </Button>
        )}
      </div>
    </div>
  );
}

// Server-side filter for URL params
export function ClaimFiltersServer({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const search = searchParams.search ?? "";
  const status = searchParams.status ?? "all";
  const priority = searchParams.priority ?? "all";

  return (
    <form className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="search"
          placeholder="Søk etter reklamasjonsnummer, tittel..."
          defaultValue={search}
          className="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          name="priority"
          defaultValue={priority}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <Button type="submit" variant="default" size="sm">
          <Filter className="mr-1 h-4 w-4" />
          Filtrer
        </Button>

        {(search || status !== "all" || priority !== "all") && (
          <a href="/claims">
            <Button type="button" variant="outline" size="sm">
              <X className="mr-1 h-4 w-4" />
              Nullstill
            </Button>
          </a>
        )}
      </div>
    </form>
  );
}
