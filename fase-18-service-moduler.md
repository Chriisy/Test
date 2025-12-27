# Fase 18: Service-moduler

**Kategori:** 💻 WEB-PORTAL  
**Tid:** 8-10 timer  
**Prioritet:** 🟡 Høy  
**Avhengigheter:** Fase 17 fullført

---

## 🎯 Mål
Bygge service-relaterte moduler: serviceavtaler, planlagte besøk og servicepartnere med kart.

---

## 📊 Moduler

### 1. Storkjøkkenavtaler
- Liste over avtaler (117 i systemet)
- Status: aktiv, utløpt, kansellert
- Detaljvisning med priser, besøk, utstyr
- Opprett ny avtale

### 2. Planlagte besøk
- Kalendervisning (måned/uke)
- Liste over kommende besøk
- Filtrer på tekniker, status, kunde
- Registrer utført besøk

### 3. Servicepartnere med kart
- Leaflet-kart med partnere
- Filtrer på fagområde, fylke, status
- Dekningsområde (radius)
- 47 partnere i systemet

---

## 📄 Serviceavtaler

```typescript
// apps/nextjs/src/app/(dashboard)/service/agreements/page.tsx
import { api } from '@/trpc/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@myhrvold/ui/tabs'
import { AgreementsTable } from './agreements-table'

export default async function ServiceAgreementsPage() {
  const [storkjokken, dagligvare] = await Promise.all([
    api.agreements.listStorkjokken(),
    api.agreements.listDagligvare(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Serviceavtaler</h1>

      <Tabs defaultValue="storkjokken">
        <TabsList>
          <TabsTrigger value="storkjokken">
            Storkjøkken ({storkjokken.length})
          </TabsTrigger>
          <TabsTrigger value="dagligvare">
            Dagligvare ({dagligvare.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="storkjokken">
          <AgreementsTable agreements={storkjokken} type="storkjokken" />
        </TabsContent>

        <TabsContent value="dagligvare">
          <AgreementsTable agreements={dagligvare} type="dagligvare" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## 📅 Planlagte besøk med kalender

```typescript
// apps/nextjs/src/app/(dashboard)/service/visits/page.tsx
'use client'
import { useState } from 'react'
import { Calendar } from '@myhrvold/ui/calendar'
import { VisitsList } from './visits-list'
import { api } from '@/trpc/react'

export default function ServiceVisitsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  const { data: visits } = api.visits.list.useQuery({
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear(),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Planlagte besøk</h1>
        <div className="flex gap-2">
          <Button 
            variant={view === 'calendar' ? 'default' : 'outline'}
            onClick={() => setView('calendar')}
          >
            Kalender
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            Liste
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <Calendar 
          visits={visits || []}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      ) : (
        <VisitsList visits={visits || []} />
      )}
    </div>
  )
}
```

---

## 🗺️ Servicepartnere med Leaflet-kart

```typescript
// apps/nextjs/src/app/(dashboard)/service/partners/page.tsx
'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { api } from '@/trpc/react'
import { PartnersFilters } from './partners-filters'
import { PartnersList } from './partners-list'

// Leaflet må lastes dynamisk (SSR-problem)
const PartnersMap = dynamic(() => import('./partners-map'), { ssr: false })

export default function ServicePartnersPage() {
  const [filters, setFilters] = useState({
    tradeArea: '',
    county: '',
    status: 'active',
  })

  const { data: partners } = api.partners.list.useQuery(filters)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Servicepartnere</h1>
          <p className="text-gray-600">{partners?.length || 0} partnere</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Legg til partner
        </Button>
      </div>

      <PartnersFilters filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kart */}
        <div className="bg-white rounded-xl shadow-sm border h-[500px]">
          <PartnersMap partners={partners || []} />
        </div>

        {/* Liste */}
        <div className="bg-white rounded-xl shadow-sm border">
          <PartnersList partners={partners || []} />
        </div>
      </div>
    </div>
  )
}
```

### Leaflet-kart komponent
```typescript
// apps/nextjs/src/app/(dashboard)/service/partners/partners-map.tsx
'use client'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function PartnersMap({ partners }) {
  // Senter på Norge
  const center = [59.9139, 10.7522] as [number, number]

  return (
    <MapContainer 
      center={center} 
      zoom={6} 
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      
      {partners.map((partner) => (
        partner.latitude && partner.longitude && (
          <div key={partner.id}>
            <Marker position={[partner.latitude, partner.longitude]}>
              <Popup>
                <div className="font-medium">{partner.companyName}</div>
                <div className="text-sm text-gray-600">{partner.tradeArea}</div>
                <div className="text-sm">{partner.phone}</div>
              </Popup>
            </Marker>
            {partner.workRadius && (
              <Circle 
                center={[partner.latitude, partner.longitude]}
                radius={partner.workRadius * 1000}  // km til meter
                pathOptions={{ color: 'teal', fillOpacity: 0.1 }}
              />
            )}
          </div>
        )
      ))}
    </MapContainer>
  )
}
```

---

## ✅ Verifisering

1. Gå til /service/agreements - se avtaler
2. Gå til /service/visits - se kalender
3. Gå til /service/partners - se kart med partnere
4. Test filtrering på alle sider

---

## 📦 Leveranse

- ✅ Storkjøkken + dagligvare avtaler
- ✅ Kalendervisning for besøk
- ✅ Servicepartnere med Leaflet-kart
- ✅ Dekningsområde-visning

---

## ➡️ Neste fase
[Fase 19: Salg & Admin](./fase-19-salg-admin.md)
