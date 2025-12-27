# Fase 14: Dashboard

**Kategori:** 💻 WEB-PORTAL  
**Tid:** 4-5 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 13 fullført

---

## 🎯 Mål
Bygge dashboard med statistikk, quick actions og siste aktivitet.

---

## 📊 Dashboard-komponenter

### 1. Velkomst-banner
- Brukerens navn
- Dagens dato
- Quick actions

### 2. Statistikk-kort (6 stk)
- Aktive reklamasjoner
- Venter på leverandør
- Løst denne måneden
- Åpne installasjoner
- Serviceavtaler (aktive)
- Transportskader

### 3. Siste reklamasjoner
- Liste med 5 siste
- Status-badge
- Lenke til detaljer

### 4. Kommende servicebesøk
- Kalender-visning eller liste
- Tekniker tildelt

---

## 📄 Kode

```typescript
// apps/nextjs/src/app/(dashboard)/dashboard/page.tsx
import { api } from '@/trpc/server'
import { StatsCard } from '@myhrvold/ui/stats-card'
import { RecentClaimsList } from '@myhrvold/ui/recent-claims'
import { 
  FileWarning, 
  Clock, 
  CheckCircle, 
  Truck, 
  Wrench, 
  AlertTriangle 
} from 'lucide-react'

export default async function DashboardPage() {
  const stats = await api.dashboard.getStats()
  const recentClaims = await api.claims.getRecent({ limit: 5 })

  return (
    <div className="space-y-6">
      {/* Velkomst */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900">
          God morgen! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Her er oversikten for i dag
        </p>
      </div>

      {/* Statistikk-grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Aktive reklamasjoner"
          value={stats.activeClaims}
          icon={FileWarning}
          trend={{ value: 12, isPositive: false }}
          color="blue"
        />
        <StatsCard
          title="Venter på leverandør"
          value={stats.pendingSupplier}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Løst denne måneden"
          value={stats.resolvedThisMonth}
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Åpne installasjoner"
          value={stats.openInstallations}
          icon={Truck}
          color="purple"
        />
        <StatsCard
          title="Aktive serviceavtaler"
          value={stats.activeAgreements}
          icon={Wrench}
          color="teal"
        />
        <StatsCard
          title="Transportskader"
          value={stats.openDamages}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Siste reklamasjoner */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Siste reklamasjoner</h2>
        </div>
        <RecentClaimsList claims={recentClaims} />
      </div>
    </div>
  )
}
```

### StatsCard-komponent
```typescript
// packages/ui/src/stats-card.tsx
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: { value: number; isPositive: boolean }
  color: 'blue' | 'orange' | 'green' | 'purple' | 'teal' | 'red'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-orange-50 text-orange-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  teal: 'bg-teal-50 text-teal-600',
  red: 'bg-red-50 text-red-600',
}

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}% fra forrige måned
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
```

---

## 🔧 tRPC Router

```typescript
// packages/api/src/router/dashboard.ts
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { db } from '@myhrvold/db'
import { claims, installations } from '@myhrvold/db/schema'
import { eq, sql } from 'drizzle-orm'

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async () => {
    const [claimStats] = await db
      .select({
        active: sql<number>`count(*) filter (where status in ('new', 'in_progress'))`,
        pending: sql<number>`count(*) filter (where status = 'pending_supplier')`,
        resolved: sql<number>`count(*) filter (where status = 'resolved' and updated_at > now() - interval '30 days')`,
      })
      .from(claims)

    return {
      activeClaims: claimStats?.active ?? 0,
      pendingSupplier: claimStats?.pending ?? 0,
      resolvedThisMonth: claimStats?.resolved ?? 0,
      openInstallations: 0, // TODO: implementer
      activeAgreements: 0,  // TODO: implementer
      openDamages: 0,       // TODO: implementer
    }
  }),
})
```

---

## ✅ Verifisering

1. Gå til /dashboard
2. Sjekk at alle 6 statistikk-kort vises
3. Sjekk at siste reklamasjoner listes
4. Test responsivt design

---

## 📦 Leveranse

- ✅ Dashboard med statistikk
- ✅ Quick actions
- ✅ Siste reklamasjoner
- ✅ tRPC router for data

---

## ➡️ Neste fase
[Fase 15: Reklamasjonsliste](./fase-15-reklamasjonsliste.md)
