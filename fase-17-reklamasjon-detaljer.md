# Fase 17: Reklamasjon Detaljer

**Kategori:** 💻 WEB-PORTAL  
**Tid:** 4-5 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 16 fullført

---

## 🎯 Mål
Bygge detaljvisning for enkeltreklamasjon med alle 56 felt, aktivitetslogg og handlinger.

---

## 📊 Layout

### Header
- Saksnummer (stor)
- Status-badge (redigerbar)
- Prioritet-badge
- Action-knapper (Rediger, Send til leverandør, Skriv ut)

### Hovedinnhold (2-kolonner på desktop)

**Venstre kolonne:**
- Kundeinformasjon
- Produktinformasjon
- Problembeskrivelse
- Deler (claim_parts)

**Høyre kolonne:**
- Leverandørinformasjon
- Garanti-status
- Kostnader
- Leverandørsvar

### Bunn
- Aktivitetslogg/timeline
- Kommentarer

---

## 📄 Hovedkomponent

```typescript
// apps/nextjs/src/app/(dashboard)/claims/[id]/page.tsx
import { api } from '@/trpc/server'
import { notFound } from 'next/navigation'
import { ClaimHeader } from './claim-header'
import { CustomerCard } from './customer-card'
import { ProductCard } from './product-card'
import { SupplierCard } from './supplier-card'
import { CostsCard } from './costs-card'
import { PartsTable } from './parts-table'
import { ActivityTimeline } from './activity-timeline'

export default async function ClaimDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const claim = await api.claims.getById({ id: parseInt(params.id) })
  
  if (!claim) notFound()

  return (
    <div className="space-y-6">
      {/* Header med saksnummer og actions */}
      <ClaimHeader claim={claim} />

      {/* 2-kolonner layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Venstre kolonne */}
        <div className="space-y-6">
          <CustomerCard claim={claim} />
          <ProductCard claim={claim} />
          
          {/* Problembeskrivelse */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold mb-4">Problembeskrivelse</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {claim.problemDescription || 'Ingen beskrivelse'}
            </p>
            {claim.diagnosisDescription && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-sm text-gray-600 mb-2">Diagnose</h4>
                <p className="text-gray-700">{claim.diagnosisDescription}</p>
              </div>
            )}
          </div>

          {/* Deler */}
          <PartsTable claimId={claim.id} parts={claim.parts} />
        </div>

        {/* Høyre kolonne */}
        <div className="space-y-6">
          <SupplierCard claim={claim} />
          <CostsCard claim={claim} />
          
          {/* Garanti-status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold mb-4">Garanti</h3>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                claim.warrantyStatus === 'in_warranty' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {claim.warrantyStatus === 'in_warranty' ? 'I garanti' : 'Ut av garanti'}
              </span>
              {claim.warrantyExpires && (
                <span className="text-sm text-gray-600">
                  Utløper: {formatDate(claim.warrantyExpires)}
                </span>
              )}
            </div>
          </div>

          {/* Leverandørsvar */}
          {claim.supplierResponse && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold mb-4">Leverandørsvar</h3>
              <p className="text-gray-700">{claim.supplierResponse}</p>
              {claim.supplierCreditNote && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">
                    Kreditnota: {claim.supplierCreditNote}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Aktivitetslogg */}
      <ActivityTimeline claimId={claim.id} />
    </div>
  )
}
```

### Header med actions
```typescript
// apps/nextjs/src/app/(dashboard)/claims/[id]/claim-header.tsx
'use client'
import { ClaimStatusBadge } from '@myhrvold/ui/claim-status-badge'
import { Button } from '@myhrvold/ui/button'
import { Edit, Send, Printer, MoreHorizontal } from 'lucide-react'

export function ClaimHeader({ claim }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{claim.claimNumber}</h1>
            <ClaimStatusBadge status={claim.status} />
          </div>
          <p className="text-gray-600 mt-1">
            Opprettet {formatDate(claim.createdAt)} • 
            Tildelt {claim.assignedUser?.firstName || 'Ingen'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Rediger
          </Button>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send til leverandør
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Skriv ut
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 🔧 tRPC Router

```typescript
// packages/api/src/router/claims.ts - getById
getById: protectedProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const claim = await db.query.claims.findFirst({
      where: eq(claims.id, input.id),
      with: {
        customer: true,
        product: true,
        supplier: true,
        assignedUser: true,
        parts: true,
      },
    })
    return claim
  }),
```

---

## ✅ Verifisering

1. Gå til /claims/[id]
2. Sjekk at alle felt vises
3. Test action-knapper
4. Sjekk garanti-status
5. Se aktivitetslogg

---

## 📦 Leveranse

- ✅ Komplett detaljvisning
- ✅ Alle 56 felt tilgjengelig
- ✅ Action-knapper
- ✅ Aktivitetslogg
- ✅ Responsive layout

---

## ➡️ Neste fase
[Fase 18: Service-moduler](./fase-18-service-moduler.md)
