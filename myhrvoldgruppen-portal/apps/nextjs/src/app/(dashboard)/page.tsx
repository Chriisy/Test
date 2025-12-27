import Link from "next/link";
import { AlertTriangle, FileText, Users, Wrench, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@myhrvold/ui/card";
import { Button } from "@myhrvold/ui/button";
import { StatsCard } from "@myhrvold/ui/stats-card";
import { ClaimStatusBadge } from "@myhrvold/ui/claim-badges";

// Mock data - vil bli erstattet med tRPC-kall
const stats = {
  activeClaims: 23,
  claimsTrend: { value: 8, isPositive: true },
  totalCustomers: 207,
  activeAgreements: 117,
  activePartners: 47,
};

const recentClaims = [
  { id: "1", claimNumber: "ELE-2512-0023", customer: "Hotel Bristol", status: "new" },
  { id: "2", claimNumber: "UBE-2512-0022", customer: "Kantina AS", status: "in_progress" },
  { id: "3", claimNumber: "RAT-2512-0021", customer: "Restaurant Fjord", status: "pending_supplier" },
];

const upcomingVisits = [
  { date: "27. des", customer: "Coop Mega Sentrum", technician: "Ole Hansen" },
  { date: "28. des", customer: "Scandic Hotel", technician: "Kari Olsen" },
  { date: "29. des", customer: "Rema 1000 Torget", technician: "Per Johansen" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Velkommen til Myhrvoldgruppen Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Aktive reklamasjoner"
          value={stats.activeClaims}
          icon={AlertTriangle}
          trend={stats.claimsTrend}
          color="orange"
        />
        <StatsCard
          title="Serviceavtaler"
          value={stats.activeAgreements}
          icon={FileText}
          color="teal"
        />
        <StatsCard
          title="Kunder"
          value={stats.totalCustomers}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Servicepartnere"
          value={stats.activePartners}
          icon={Wrench}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Siste reklamasjoner</CardTitle>
            <Link href="/claims">
              <Button variant="ghost" size="sm">
                Se alle <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentClaims.map((claim) => (
                <Link
                  key={claim.id}
                  href={`/claims/${claim.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <div>
                    <p className="font-mono text-sm font-medium text-teal-600">
                      {claim.claimNumber}
                    </p>
                    <p className="text-sm text-gray-500">{claim.customer}</p>
                  </div>
                  <ClaimStatusBadge status={claim.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kommende servicebesøk</CardTitle>
            <Link href="/service/visits">
              <Button variant="ghost" size="sm">
                Se alle <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingVisits.map((visit, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{visit.customer}</p>
                    <p className="text-sm text-gray-500">{visit.technician}</p>
                  </div>
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-600">
                    {visit.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
