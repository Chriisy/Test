import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Package,
  Calendar,
  User,
  Clock,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@myhrvold/ui/card";
import { Button } from "@myhrvold/ui/button";
import { ClaimStatusBadge, ClaimPriorityBadge } from "@myhrvold/ui/claim-badges";

// Mock data - vil bli erstattet med tRPC-kall
const mockClaim = {
  id: "1",
  claimNumber: "ELE-2512-0023",
  title: "Defekt kompressor i kjøledisk",
  description:
    "Kunden rapporterer at kompressoren i kjøledisken har sluttet å fungere. Disken holder ikke lenger riktig temperatur, og varene blir ødelagt. Problemet oppstod plutselig uten forvarsel. Kunden har forsøkt å slå av og på enheten uten hell.",
  status: "in_progress",
  priority: "high",
  claimType: "warranty",
  productName: "Kjøledisk KD-500",
  serialNumber: "SN-2024-12345",
  purchaseDate: new Date("2024-06-15"),
  warrantyExpiry: new Date("2026-06-15"),
  customer: {
    id: "1",
    name: "Hotel Bristol",
    orgNumber: "123456789",
    address: "Karl Johans gate 31, Oslo",
    contactPerson: "Erik Hansen",
    phone: "+47 22 82 60 00",
    email: "drift@bristol.no",
  },
  createdBy: "Anna Olsen",
  createdAt: new Date("2024-12-25T10:30:00"),
  updatedAt: new Date("2024-12-26T14:15:00"),
  assignedTo: "Ole Nordmann",
  supplier: {
    name: "Metos AS",
    contactPerson: "Per Svendsen",
    email: "support@metos.no",
  },
  timeline: [
    {
      id: "1",
      type: "created",
      description: "Reklamasjon opprettet",
      user: "Anna Olsen",
      timestamp: new Date("2024-12-25T10:30:00"),
    },
    {
      id: "2",
      type: "status_change",
      description: "Status endret til 'Pågår'",
      user: "Ole Nordmann",
      timestamp: new Date("2024-12-25T11:45:00"),
    },
    {
      id: "3",
      type: "comment",
      description: "Kontaktet leverandør for reservedeler. Venter på tilbakemelding.",
      user: "Ole Nordmann",
      timestamp: new Date("2024-12-25T14:20:00"),
    },
    {
      id: "4",
      type: "supplier_contact",
      description: "E-post sendt til Metos AS",
      user: "System",
      timestamp: new Date("2024-12-25T14:25:00"),
    },
    {
      id: "5",
      type: "comment",
      description: "Leverandør bekrefter garanti. Sender tekniker 27. desember.",
      user: "Ole Nordmann",
      timestamp: new Date("2024-12-26T09:10:00"),
    },
  ],
  attachments: [
    { id: "1", name: "bilde_kompressor.jpg", size: "2.4 MB", type: "image" },
    { id: "2", name: "faktura_kjop.pdf", size: "156 KB", type: "document" },
    { id: "3", name: "temperatur_log.xlsx", size: "89 KB", type: "document" },
  ],
};

const statusActions = [
  { value: "new", label: "Ny", icon: AlertTriangle },
  { value: "in_progress", label: "Pågår", icon: Clock },
  { value: "pending_supplier", label: "Venter leverandør", icon: Send },
  { value: "resolved", label: "Løst", icon: CheckCircle },
  { value: "closed", label: "Lukket", icon: XCircle },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClaimDetailPage({ params }: PageProps) {
  const { id } = await params;

  // I produksjon: hent data fra API
  const claim = mockClaim;

  if (!claim) {
    notFound();
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (date: Date) =>
    date.toLocaleDateString("nb-NO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "created":
        return <Calendar className="h-4 w-4" />;
      case "status_change":
        return <Clock className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "supplier_contact":
        return <Send className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link href="/claims">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-bold text-teal-600">
                {claim.claimNumber}
              </h1>
              <ClaimStatusBadge status={claim.status} />
              <ClaimPriorityBadge priority={claim.priority} />
            </div>
            <p className="mt-1 text-lg text-gray-900">{claim.title}</p>
            <p className="text-sm text-gray-500">
              Opprettet {formatDateTime(claim.createdAt)} av {claim.createdBy}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Rediger
          </Button>
          <Button variant="outline" className="text-red-600 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Slett
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Beskrivelse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700">
                {claim.description}
              </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Aktivitetslogg</CardTitle>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Legg til kommentar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />

                {claim.timeline.map((event, index) => (
                  <div key={event.id} className="relative flex gap-4 pl-10">
                    <div className="absolute left-2 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-gray-200">
                      {getTimelineIcon(event.type)}
                    </div>
                    <div className="flex-1 rounded-lg border bg-gray-50 p-3">
                      <p className="text-sm text-gray-700">{event.description}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {event.user} · {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vedlegg ({claim.attachments.length})</CardTitle>
              <Button variant="outline" size="sm">
                <Paperclip className="mr-2 h-4 w-4" />
                Last opp
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {claim.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Last ned
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Endre status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {statusActions.map((action) => {
                  const Icon = action.icon;
                  const isActive = claim.status === action.value;
                  return (
                    <button
                      key={action.value}
                      className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors ${
                        isActive
                          ? "border-teal-600 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Kunde
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{claim.customer.name}</p>
                <p className="text-sm text-gray-500">
                  Org.nr: {claim.customer.orgNumber}
                </p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Kontaktperson</p>
                <p>{claim.customer.contactPerson}</p>
                <p className="text-gray-500">{claim.customer.phone}</p>
                <p className="text-teal-600">{claim.customer.email}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Adresse</p>
                <p>{claim.customer.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produkt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Produkt</p>
                <p className="font-medium">{claim.productName}</p>
              </div>
              <div>
                <p className="text-gray-500">Serienummer</p>
                <p className="font-mono">{claim.serialNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Kjøpsdato</p>
                <p>{formatDate(claim.purchaseDate)}</p>
              </div>
              <div>
                <p className="text-gray-500">Garanti utløper</p>
                <p>{formatDate(claim.warrantyExpiry)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Tildelt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  {claim.assignedTo.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{claim.assignedTo}</p>
                  <p className="text-sm text-gray-500">Saksbehandler</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Endre tildeling
              </Button>
            </CardContent>
          </Card>

          {/* Supplier */}
          <Card>
            <CardHeader>
              <CardTitle>Leverandør</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{claim.supplier.name}</p>
              <p className="text-gray-500">{claim.supplier.contactPerson}</p>
              <p className="text-teal-600">{claim.supplier.email}</p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                <Send className="mr-2 h-4 w-4" />
                Send henvendelse
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
