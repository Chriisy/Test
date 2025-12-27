# Fase 15: Reklamasjonsliste

**Kategori:** 💻 WEB-PORTAL  
**Tid:** 5-6 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 14 fullført

---

## 🎯 Mål
Bygge komplett reklamasjonsliste med søk, filter, sortering og paginering.

---

## 📊 Funksjoner

### Filtrering
- Status (ny, pågår, venter leverandør, løst, lukket)
- Prioritet (lav, medium, høy, haster)
- Leverandør
- Periode (dato fra/til)
- Garanti (i garanti / ut av garanti)

### Kolonner i tabellen
- Saksnummer (ELE-2412-0001)
- Kunde
- Produkt
- Leverandør
- Status (badge)
- Prioritet (badge)
- Opprettet dato
- Tildelt til

### Actions
- Åpne detaljer
- Rask status-endring
- Tildel saksbehandler

---

## 📄 Hovedkomponent

```typescript
// apps/nextjs/src/app/(dashboard)/claims/page.tsx
import { api } from '@/trpc/server'
import { ClaimsTable } from './claims-table'
import { ClaimsFilters } from './claims-filters'
import { Button } from '@myhrvold/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function ClaimsPage({
  searchParams,
}: {
  searchParams: { status?: string; supplier?: string; page?: string }
}) {
  const claims = await api.claims.list({
    status: searchParams.status,
    supplierId: searchParams.supplier ? parseInt(searchParams.supplier) : undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 20,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reklamasjoner</h1>
          <p className="text-gray-600">{claims.total} saker totalt</p>
        </div>
        <Link href="/claims/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Ny reklamasjon
          </Button>
        </Link>
      </div>

      {/* Filtre */}
      <ClaimsFilters />

      {/* Tabell */}
      <ClaimsTable claims={claims.items} />

      {/* Paginering */}
      <Pagination 
        currentPage={claims.page} 
        totalPages={claims.totalPages} 
      />
    </div>
  )
}
```

### Status-badge
```typescript
// packages/ui/src/claim-status-badge.tsx
const statusConfig = {
  draft: { label: 'Utkast', color: 'bg-gray-100 text-gray-700' },
  new: { label: 'Ny', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'Pågår', color: 'bg-yellow-100 text-yellow-700' },
  pending_supplier: { label: 'Venter leverandør', color: 'bg-orange-100 text-orange-700' },
  resolved: { label: 'Løst', color: 'bg-green-100 text-green-700' },
  closed: { label: 'Lukket', color: 'bg-slate-100 text-slate-700' },
}

export function ClaimStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig]
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
```

---

## 🔧 tRPC Router

```typescript
// packages/api/src/router/claims.ts
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { db } from '@myhrvold/db'
import { claims, customers, suppliers } from '@myhrvold/db/schema'
import { eq, desc, sql, and, ilike } from 'drizzle-orm'

export const claimsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      supplierId: z.number().optional(),
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit
      
      const conditions = []
      if (input.status) conditions.push(eq(claims.status, input.status))
      if (input.supplierId) conditions.push(eq(claims.supplierId, input.supplierId))
      if (input.search) {
        conditions.push(
          ilike(claims.claimNumber, `%${input.search}%`)
        )
      }

      const [items, countResult] = await Promise.all([
        db.select()
          .from(claims)
          .leftJoin(customers, eq(claims.customerId, customers.id))
          .leftJoin(suppliers, eq(claims.supplierId, suppliers.id))
          .where(conditions.length ? and(...conditions) : undefined)
          .orderBy(desc(claims.createdAt))
          .limit(input.limit)
          .offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(claims)
      ])

      return {
        items,
        total: countResult[0]?.count ?? 0,
        page: input.page,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / input.limit),
      }
    }),
})
```

---

## ✅ Verifisering

1. Gå til /claims
2. Sjekk at tabellen viser reklamasjoner
3. Test filtrering på status
4. Test søk
5. Test paginering

---

## 📦 Leveranse

- ✅ Reklamasjonsliste med tabell
- ✅ Filtrering og søk
- ✅ Status/prioritet badges
- ✅ Paginering
- ✅ Link til ny reklamasjon

---

## ➡️ Neste fase
[Fase 16: Reklamasjon wizard](./fase-16-reklamasjon-wizard.md)
