import Link from "next/link";
import { Plus, Eye, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@myhrvold/ui/card";
import { Button } from "@myhrvold/ui/button";
import { ClaimStatusBadge, ClaimPriorityBadge } from "@myhrvold/ui/claim-badges";
import { Pagination } from "@myhrvold/ui/pagination";
import { ClaimFiltersServer } from "@myhrvold/ui/claim-filters";

// Mock data for demo - vil bli erstattet med tRPC-kall
const mockClaims = [
  {
    id: "1",
    claimNumber: "ELE-2512-0023",
    title: "Defekt kompressor i kjøledisk",
    status: "new",
    priority: "high",
    productName: "Kjøledisk KD-500",
    customerName: "Hotel Bristol",
    createdAt: new Date("2024-12-25"),
  },
  {
    id: "2",
    claimNumber: "UBE-2512-0022",
    title: "Rustdannelse på frontrute",
    status: "in_progress",
    priority: "medium",
    productName: "Displaykjøler DK-200",
    customerName: "Kantina AS",
    createdAt: new Date("2024-12-24"),
  },
  {
    id: "3",
    claimNumber: "RAT-2512-0021",
    title: "Termostat viser feil temperatur",
    status: "pending_supplier",
    priority: "low",
    productName: "Fryseskap FS-1000",
    customerName: "Restaurant Fjord",
    createdAt: new Date("2024-12-23"),
  },
  {
    id: "4",
    claimNumber: "ELE-2512-0020",
    title: "Motor lager unormal lyd",
    status: "resolved",
    priority: "urgent",
    productName: "Kombinasjonsskap KS-800",
    customerName: "Scandic Hotel Oslo",
    createdAt: new Date("2024-12-22"),
  },
  {
    id: "5",
    claimNumber: "ELE-2512-0019",
    title: "Isenhet produserer ikke is",
    status: "closed",
    priority: "medium",
    productName: "Ismaskin IM-300",
    customerName: "Thon Hotel Bergen",
    createdAt: new Date("2024-12-21"),
  },
];

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ClaimsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const search = params.search ?? "";
  const status = params.status ?? "all";
  const priority = params.priority ?? "all";

  // Filtrer mock data basert på søkeparametre
  let filteredClaims = mockClaims;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredClaims = filteredClaims.filter(
      (c) =>
        c.claimNumber.toLowerCase().includes(searchLower) ||
        c.title.toLowerCase().includes(searchLower) ||
        c.customerName.toLowerCase().includes(searchLower)
    );
  }

  if (status !== "all") {
    filteredClaims = filteredClaims.filter((c) => c.status === status);
  }

  if (priority !== "all") {
    filteredClaims = filteredClaims.filter((c) => c.priority === priority);
  }

  const totalPages = Math.ceil(filteredClaims.length / 10);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reklamasjoner</h1>
          <p className="text-gray-600">
            Administrer og følg opp reklamasjoner
          </p>
        </div>
        <Link href="/claims/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ny reklamasjon
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <ClaimFiltersServer searchParams={params} />
        </CardContent>
      </Card>

      {/* Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredClaims.length} reklamasjon{filteredClaims.length !== 1 ? "er" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClaims.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">Ingen reklamasjoner funnet</p>
              <p className="mt-2 text-sm text-gray-400">
                Prøv å endre søkekriteriene eller opprett en ny reklamasjon
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3 font-medium">Saksnummer</th>
                      <th className="pb-3 font-medium">Tittel</th>
                      <th className="pb-3 font-medium">Kunde</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Prioritet</th>
                      <th className="pb-3 font-medium">Dato</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClaims.map((claim) => (
                      <tr
                        key={claim.id}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="py-4">
                          <span className="font-mono text-sm font-medium text-teal-600">
                            {claim.claimNumber}
                          </span>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{claim.title}</p>
                            <p className="text-sm text-gray-500">
                              {claim.productName}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{claim.customerName}</td>
                        <td className="py-4">
                          <ClaimStatusBadge status={claim.status} />
                        </td>
                        <td className="py-4">
                          <ClaimPriorityBadge priority={claim.priority} />
                        </td>
                        <td className="py-4 text-sm text-gray-500">
                          {formatDate(claim.createdAt)}
                        </td>
                        <td className="py-4">
                          <Link href={`/claims/${claim.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {filteredClaims.map((claim) => (
                  <Link
                    key={claim.id}
                    href={`/claims/${claim.id}`}
                    className="block"
                  >
                    <div className="rounded-lg border p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-teal-600">
                              {claim.claimNumber}
                            </span>
                            <ClaimPriorityBadge priority={claim.priority} />
                          </div>
                          <p className="mt-1 font-medium">{claim.title}</p>
                          <p className="text-sm text-gray-500">
                            {claim.customerName}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <ClaimStatusBadge status={claim.status} />
                            <span className="text-xs text-gray-400">
                              {formatDate(claim.createdAt)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl={`/claims?search=${search}&status=${status}&priority=${priority}`}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
