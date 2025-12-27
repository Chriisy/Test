import Link from "next/link";
import { Plus, FileText, Building2, Calendar, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@myhrvold/ui/card";
import { Button } from "@myhrvold/ui/button";

// Mock data - vil bli erstattet med tRPC-kall
const mockAgreements = {
  storkjokken: [
    {
      id: "1",
      agreementNumber: "SK-2024-001",
      customerName: "Scandic Hotel Oslo",
      type: "Premium Service",
      status: "active",
      nextVisit: new Date("2025-01-15"),
      annualValue: 45000,
      equipmentCount: 12,
    },
    {
      id: "2",
      agreementNumber: "SK-2024-002",
      customerName: "Hotel Bristol",
      type: "Standard Service",
      status: "active",
      nextVisit: new Date("2025-01-20"),
      annualValue: 28000,
      equipmentCount: 8,
    },
    {
      id: "3",
      agreementNumber: "SK-2024-003",
      customerName: "Thon Hotel Bergen",
      type: "Premium Service",
      status: "pending_renewal",
      nextVisit: new Date("2025-01-10"),
      annualValue: 52000,
      equipmentCount: 15,
    },
  ],
  dagligvare: [
    {
      id: "4",
      agreementNumber: "DV-2024-001",
      customerName: "Coop Mega Sentrum",
      type: "Full Service",
      status: "active",
      nextVisit: new Date("2025-01-08"),
      annualValue: 35000,
      equipmentCount: 6,
    },
    {
      id: "5",
      agreementNumber: "DV-2024-002",
      customerName: "Rema 1000 Torget",
      type: "Basic Service",
      status: "active",
      nextVisit: new Date("2025-01-25"),
      annualValue: 18000,
      equipmentCount: 4,
    },
  ],
};

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Aktiv", color: "bg-green-100 text-green-700" },
  pending_renewal: { label: "Fornyelse", color: "bg-orange-100 text-orange-700" },
  expired: { label: "Utløpt", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Kansellert", color: "bg-gray-100 text-gray-700" },
};

export default function ServiceAgreementsPage() {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(value);

  const totalStorkjokken = mockAgreements.storkjokken.reduce(
    (sum, a) => sum + a.annualValue,
    0
  );
  const totalDagligvare = mockAgreements.dagligvare.reduce(
    (sum, a) => sum + a.annualValue,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviceavtaler</h1>
          <p className="text-gray-600">Administrer serviceavtaler for storkjøkken og dagligvare</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ny avtale
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-teal-50 p-3">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Totalt avtaler</p>
                <p className="text-2xl font-bold">
                  {mockAgreements.storkjokken.length + mockAgreements.dagligvare.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Storkjøkken</p>
                <p className="text-2xl font-bold">{mockAgreements.storkjokken.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-3">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dagligvare</p>
                <p className="text-2xl font-bold">{mockAgreements.dagligvare.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Årlig verdi</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalStorkjokken + totalDagligvare)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storkjøkken */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Storkjøkken ({mockAgreements.storkjokken.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">Avtalenummer</th>
                  <th className="pb-3 font-medium">Kunde</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Neste besøk</th>
                  <th className="pb-3 font-medium">Utstyr</th>
                  <th className="pb-3 font-medium">Årlig verdi</th>
                </tr>
              </thead>
              <tbody>
                {mockAgreements.storkjokken.map((agreement) => (
                  <tr key={agreement.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4">
                      <Link
                        href={`/service/agreements/${agreement.id}`}
                        className="font-mono text-sm font-medium text-teal-600 hover:underline"
                      >
                        {agreement.agreementNumber}
                      </Link>
                    </td>
                    <td className="py-4">{agreement.customerName}</td>
                    <td className="py-4 text-sm">{agreement.type}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusConfig[agreement.status]?.color
                        }`}
                      >
                        {statusConfig[agreement.status]?.label}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{formatDate(agreement.nextVisit)}</td>
                    <td className="py-4 text-sm">{agreement.equipmentCount} enheter</td>
                    <td className="py-4 text-sm font-medium">
                      {formatCurrency(agreement.annualValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dagligvare */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            Dagligvare ({mockAgreements.dagligvare.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">Avtalenummer</th>
                  <th className="pb-3 font-medium">Kunde</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Neste besøk</th>
                  <th className="pb-3 font-medium">Utstyr</th>
                  <th className="pb-3 font-medium">Årlig verdi</th>
                </tr>
              </thead>
              <tbody>
                {mockAgreements.dagligvare.map((agreement) => (
                  <tr key={agreement.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4">
                      <Link
                        href={`/service/agreements/${agreement.id}`}
                        className="font-mono text-sm font-medium text-teal-600 hover:underline"
                      >
                        {agreement.agreementNumber}
                      </Link>
                    </td>
                    <td className="py-4">{agreement.customerName}</td>
                    <td className="py-4 text-sm">{agreement.type}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusConfig[agreement.status]?.color
                        }`}
                      >
                        {statusConfig[agreement.status]?.label}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{formatDate(agreement.nextVisit)}</td>
                    <td className="py-4 text-sm">{agreement.equipmentCount} enheter</td>
                    <td className="py-4 text-sm font-medium">
                      {formatCurrency(agreement.annualValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
