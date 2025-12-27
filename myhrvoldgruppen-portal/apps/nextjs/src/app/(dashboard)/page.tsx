import { Card, CardContent, CardHeader, CardTitle } from "@myhrvold/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Velkommen til Myhrvoldgruppen Portal</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aktive reklamasjoner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">23</div>
            <p className="text-xs text-gray-500">+2 siste 7 dager</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Serviceavtaler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">117</div>
            <p className="text-xs text-gray-500">Aktive avtaler</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Kunder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">207</div>
            <p className="text-xs text-gray-500">Totalt i systemet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Servicepartnere
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">47</div>
            <p className="text-xs text-gray-500">Aktive partnere</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Siste reklamasjoner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nr: "ELE-2512-0023", kunde: "Hotel Bristol", status: "Ny" },
                { nr: "UBE-2512-0022", kunde: "Kantina AS", status: "Pågår" },
                { nr: "RAT-2512-0021", kunde: "Restaurant Fjord", status: "Venter" },
              ].map((claim) => (
                <div
                  key={claim.nr}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{claim.nr}</p>
                    <p className="text-sm text-gray-500">{claim.kunde}</p>
                  </div>
                  <span className="rounded-full bg-teal-100 px-2 py-1 text-xs text-teal-700">
                    {claim.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kommende servicebesøk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dato: "27. des", kunde: "Coop Mega Sentrum", tekniker: "Ole" },
                { dato: "28. des", kunde: "Scandic Hotel", tekniker: "Kari" },
                { dato: "29. des", kunde: "Rema 1000 Torget", tekniker: "Per" },
              ].map((visit, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{visit.kunde}</p>
                    <p className="text-sm text-gray-500">{visit.tekniker}</p>
                  </div>
                  <span className="text-sm text-gray-600">{visit.dato}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
