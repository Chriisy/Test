import Link from "next/link";
import { Plus, Calendar, MapPin, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@myhrvold/ui/card";
import { Button } from "@myhrvold/ui/button";

// Mock data - vil bli erstattet med tRPC-kall
const mockVisits = [
  {
    id: "1",
    agreementNumber: "SK-2024-001",
    customerName: "Scandic Hotel Oslo",
    address: "Holbergs gate 30, Oslo",
    scheduledDate: new Date("2025-01-02T09:00:00"),
    technician: "Ole Hansen",
    status: "scheduled",
    type: "Kvartalsservice",
  },
  {
    id: "2",
    agreementNumber: "DV-2024-001",
    customerName: "Coop Mega Sentrum",
    address: "Storgata 15, Oslo",
    scheduledDate: new Date("2025-01-02T13:00:00"),
    technician: "Kari Olsen",
    status: "scheduled",
    type: "Årlig inspeksjon",
  },
  {
    id: "3",
    agreementNumber: "SK-2024-003",
    customerName: "Thon Hotel Bergen",
    address: "Bryggen 5, Bergen",
    scheduledDate: new Date("2025-01-03T10:00:00"),
    technician: "Per Johansen",
    status: "scheduled",
    type: "Månedlig service",
  },
  {
    id: "4",
    agreementNumber: "SK-2024-002",
    customerName: "Hotel Bristol",
    address: "Karl Johans gate 31, Oslo",
    scheduledDate: new Date("2024-12-27T11:00:00"),
    technician: "Ole Hansen",
    status: "in_progress",
    type: "Akutt service",
  },
  {
    id: "5",
    agreementNumber: "DV-2024-002",
    customerName: "Rema 1000 Torget",
    address: "Torggata 1, Trondheim",
    scheduledDate: new Date("2024-12-26T14:00:00"),
    technician: "Kari Olsen",
    status: "completed",
    type: "Kvartalsservice",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  scheduled: { label: "Planlagt", color: "bg-blue-100 text-blue-700", icon: Calendar },
  in_progress: { label: "Pågår", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  completed: { label: "Fullført", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Kansellert", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function ServiceVisitsPage() {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("nb-NO", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const today = new Date();
  const todayVisits = mockVisits.filter(
    (v) => v.scheduledDate.toDateString() === today.toDateString()
  );
  const upcomingVisits = mockVisits.filter(
    (v) => v.scheduledDate > today && v.status === "scheduled"
  );
  const completedVisits = mockVisits.filter((v) => v.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicebesøk</h1>
          <p className="text-gray-600">Planlegg og administrer servicebesøk</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Planlegg besøk
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-50 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">I dag</p>
                <p className="text-2xl font-bold">{todayVisits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Planlagt</p>
                <p className="text-2xl font-bold">{upcomingVisits.length}</p>
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
                <p className="text-sm text-gray-500">Fullført</p>
                <p className="text-2xl font-bold">{completedVisits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-3">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Teknikere</p>
                <p className="text-2xl font-bold">
                  {new Set(mockVisits.map((v) => v.technician)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Visits */}
      {todayVisits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              I dag ({todayVisits.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayVisits.map((visit) => {
                const StatusIcon = statusConfig[visit.status]?.icon || Calendar;
                return (
                  <Link
                    key={visit.id}
                    href={`/service/visits/${visit.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-teal-600">
                          {formatTime(visit.scheduledDate)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{visit.customerName}</p>
                        <p className="text-sm text-gray-500">{visit.type}</p>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {visit.address}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {visit.technician}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        statusConfig[visit.status]?.color
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[visit.status]?.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Alle besøk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">Dato/Tid</th>
                  <th className="pb-3 font-medium">Kunde</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Tekniker</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Avtale</th>
                </tr>
              </thead>
              <tbody>
                {mockVisits.map((visit) => (
                  <tr key={visit.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{formatDate(visit.scheduledDate)}</p>
                        <p className="text-sm text-gray-500">
                          {formatTime(visit.scheduledDate)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{visit.customerName}</p>
                        <p className="text-sm text-gray-500">{visit.address}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{visit.type}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-600">
                          {visit.technician.charAt(0)}
                        </div>
                        <span className="text-sm">{visit.technician}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusConfig[visit.status]?.color
                        }`}
                      >
                        {statusConfig[visit.status]?.label}
                      </span>
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/service/agreements/${visit.id}`}
                        className="font-mono text-sm text-teal-600 hover:underline"
                      >
                        {visit.agreementNumber}
                      </Link>
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
