# Fase 8: Service-tabeller

**Kategori:** 🗄️ DATABASE  
**Tid:** 4 timer  
**Prioritet:** 🟡 Høy  
**Avhengigheter:** Fase 6 fullført

---

## 🎯 Mål
Opprette servicerelaterte tabeller:
- **storkjokken_agreements** (40+ felt) - Storkjøkken serviceavtaler
- **service_visits** (~20 felt) - Planlagte og utførte besøk
- **dagligvare_agreements** (~25 felt) - Dagligvare vedlikeholdsavtaler

---

## 📋 Sjekkliste

### 8.1 Opprett schema-filer
- [ ] `packages/db/src/schema/storkjokken-agreements.ts`
- [ ] `packages/db/src/schema/service-visits.ts`
- [ ] `packages/db/src/schema/dagligvare-agreements.ts`
- [ ] Oppdater `packages/db/src/schema/index.ts`

---

## 📄 STORKJOKKEN_AGREEMENTS (Storkjøkkenavtaler) - 40+ felt

```typescript
// packages/db/src/schema/storkjokken-agreements.ts
import { pgTable, serial, text, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core'
import { customers } from './customers'
import { users } from './users'

export const agreementStatusEnum = pgEnum('agreement_status', [
  'lead',
  'draft',
  'sent',
  'signed',
  'active',
  'expired',
  'cancelled'
])

export const storkjokkenAgreements = pgTable('storkjokken_agreements', {
  id: serial('id').primaryKey(),
  
  // ========== IDENTIFIKASJON ==========
  agreementNumber: text('agreement_number').unique(),
  sourceContractId: integer('source_contract_id'),      // Original kontrakt
  
  // ========== RELASJONER ==========
  customerId: integer('customer_id').references(() => customers.id),
  createdById: integer('created_by_id').references(() => users.id),
  departmentId: integer('department_id'),
  
  // ========== STATUS ==========
  status: agreementStatusEnum('status').default('draft'),
  
  // ========== KUNDEINFO (leveringsadresse) ==========
  customerName: text('customer_name'),
  customerNumber: text('customer_number'),
  deliveryAddress: text('delivery_address'),
  deliveryPostcode: text('delivery_postcode'),
  deliveryCity: text('delivery_city'),
  
  // ========== FAKTURAINFO ==========
  invoiceCustomerNumber: text('invoice_customer_number'),
  invoiceCustomerName: text('invoice_customer_name'),
  invoiceAddress: text('invoice_address'),
  invoicePostcode: text('invoice_postcode'),
  invoiceCity: text('invoice_city'),
  
  // ========== KONTAKTINFO ==========
  contactPerson: text('contact_person'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  kitchenManagerName: text('kitchen_manager_name'),     // Kjøkkensjef
  kitchenManagerPhone: text('kitchen_manager_phone'),
  
  // ========== PRISER ==========
  visitsPerYear: integer('visits_per_year'),            // Antall besøk per år
  pricePerYear: decimal('price_per_year', { precision: 12, scale: 2 }),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  hourlyRateCooling: decimal('hourly_rate_cooling', { precision: 10, scale: 2 }),  // Kjøletekniker
  zone1Rate: decimal('zone_1_rate', { precision: 10, scale: 2 }),
  zone2Rate: decimal('zone_2_rate', { precision: 10, scale: 2 }),
  callOutFee: decimal('call_out_fee', { precision: 10, scale: 2 }),  // Utrykningsavgift
  
  // ========== GYLDIGHET ==========
  validFrom: timestamp('valid_from', { withTimezone: true }),
  validTo: timestamp('valid_to', { withTimezone: true }),
  signedAt: timestamp('signed_at', { withTimezone: true }),
  signedBy: text('signed_by'),
  
  // ========== DOKUMENTER ==========
  documentUrl: text('document_url'),
  notes: text('notes'),
  
  // ========== METADATA ==========
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type StorkjokkenAgreement = typeof storkjokkenAgreements.$inferSelect
export type NewStorkjokkenAgreement = typeof storkjokkenAgreements.$inferInsert
```

---

## 📄 SERVICE_VISITS (Servicebesøk) - ~20 felt

```typescript
// packages/db/src/schema/service-visits.ts
import { pgTable, serial, text, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core'
import { storkjokkenAgreements } from './storkjokken-agreements'
import { customers } from './customers'
import { users } from './users'

export const visitStatusEnum = pgEnum('visit_status', [
  'planned',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'overdue'
])

export const visitTypeEnum = pgEnum('visit_type', [
  'scheduled',      // Planlagt vedlikehold
  'automatic',      // Service Automatikk
  'emergency',      // Akutt/nød
  'follow_up'       // Oppfølging
])

export const serviceVisits = pgTable('service_visits', {
  id: serial('id').primaryKey(),
  
  // ========== RELASJONER ==========
  agreementId: integer('agreement_id').references(() => storkjokkenAgreements.id),
  customerId: integer('customer_id').references(() => customers.id),
  technicianId: integer('technician_id').references(() => users.id),
  createdById: integer('created_by_id').references(() => users.id),
  
  // ========== TYPE OG STATUS ==========
  visitType: visitTypeEnum('visit_type').default('scheduled'),
  status: visitStatusEnum('status').default('planned'),
  
  // ========== PLANLEGGING ==========
  plannedDate: timestamp('planned_date', { withTimezone: true }),
  plannedStartTime: text('planned_start_time'),         // "09:00"
  plannedEndTime: text('planned_end_time'),             // "11:00"
  
  // ========== FAKTISK GJENNOMFØRING ==========
  actualDate: timestamp('actual_date', { withTimezone: true }),
  actualStartTime: text('actual_start_time'),
  actualEndTime: text('actual_end_time'),
  actualHours: decimal('actual_hours', { precision: 6, scale: 2 }),
  
  // ========== RAPPORT ==========
  technicianNotes: text('technician_notes'),
  workPerformed: text('work_performed'),
  partsUsed: text('parts_used'),
  equipmentEvaluated: text('equipment_evaluated'),
  recommendations: text('recommendations'),
  
  // ========== SIGNATUR ==========
  customerSignature: text('customer_signature'),        // Base64
  signedAt: timestamp('signed_at', { withTimezone: true }),
  signedByName: text('signed_by_name'),
  
  // ========== METADATA ==========
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ServiceVisit = typeof serviceVisits.$inferSelect
export type NewServiceVisit = typeof serviceVisits.$inferInsert
```

---

## 📄 DAGLIGVARE_AGREEMENTS (Dagligvare vedlikehold) - ~25 felt

```typescript
// packages/db/src/schema/dagligvare-agreements.ts
import { pgTable, serial, text, timestamp, integer, decimal, boolean } from 'drizzle-orm/pg-core'
import { customers } from './customers'
import { users } from './users'
import { agreementStatusEnum } from './storkjokken-agreements'

export const dagligvareAgreements = pgTable('dagligvare_agreements', {
  id: serial('id').primaryKey(),
  
  // ========== IDENTIFIKASJON ==========
  agreementNumber: text('agreement_number').unique(),
  
  // ========== RELASJONER ==========
  customerId: integer('customer_id').references(() => customers.id),
  createdById: integer('created_by_id').references(() => users.id),
  
  // ========== STATUS ==========
  status: agreementStatusEnum('status').default('draft'),
  
  // ========== KUNDEINFO ==========
  customerName: text('customer_name'),
  customerNumber: text('customer_number'),
  storeAddress: text('store_address'),
  storePostcode: text('store_postcode'),
  storeCity: text('store_city'),
  
  // ========== KONTAKT ==========
  contactPerson: text('contact_person'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  storeManagerName: text('store_manager_name'),
  
  // ========== UTSTYR ==========
  equipmentCount: integer('equipment_count'),           // Antall maskiner
  equipmentDescription: text('equipment_description'),
  
  // ========== PRISER ==========
  visitsPerYear: integer('visits_per_year'),
  pricePerVisit: decimal('price_per_visit', { precision: 10, scale: 2 }),
  pricePerYear: decimal('price_per_year', { precision: 12, scale: 2 }),
  includesEmergency: boolean('includes_emergency').default(false),
  
  // ========== GYLDIGHET ==========
  validFrom: timestamp('valid_from', { withTimezone: true }),
  validTo: timestamp('valid_to', { withTimezone: true }),
  
  // ========== METADATA ==========
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type DagligvareAgreement = typeof dagligvareAgreements.$inferSelect
export type NewDagligvareAgreement = typeof dagligvareAgreements.$inferInsert
```

---

## 📄 Oppdater index.ts

```typescript
// packages/db/src/schema/index.ts
export * from './users'
export * from './customers'
export * from './suppliers'
export * from './products'
export * from './claims'
export * from './claim-parts'
export * from './storkjokken-agreements'
export * from './service-visits'
export * from './dagligvare-agreements'
```

---

## 📊 Forskjell mellom Storkjøkken og Dagligvare

| Aspekt | Storkjøkken | Dagligvare |
|--------|-------------|------------|
| Kundetyper | Hoteller, restauranter, kantiner | Butikker, supermarkeder |
| Utstyr | Kokeutstyr, oppvask, kjøl | Kjøl/frys-disker |
| Besøk/år | 1-4 (grundig) | 2-12 (rask sjekk) |
| Pris | Høyere, time-basert | Lavere, per besøk |
| Rapporter | Detaljert, signert | Enkel sjekkliste |

---

## 🔧 Claude Code Prompt

```
Les packages/db/src/schema/ mappen.

Opprett service-tabellene:

1. storkjokken_agreements (40+ felt):
   - Kundeinfo (leveringsadresse + faktura separat)
   - Kjøkkensjef kontakt
   - Priser med soner og utrykningsavgift
   - Gyldighetsperiode

2. service_visits (~20 felt):
   - Planlagt vs faktisk tid
   - Tekniker-rapport
   - Kundesignatur (base64)

3. dagligvare_agreements (~25 felt):
   - Enklere enn storkjøkken
   - Utstyrsoversikt
   - Pris per besøk

Bruk agreementStatusEnum fra storkjokken for dagligvare også.
```

---

## ✅ Verifisering

```bash
pnpm db:push
pnpm db:studio
```

Sjekk at:
- storkjokken_agreements har 40+ kolonner
- service_visits har ~20 kolonner
- dagligvare_agreements har ~25 kolonner

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ storkjokken_agreements (40+ felt)
- ✅ service_visits (~20 felt)
- ✅ dagligvare_agreements (~25 felt)
- ✅ Status og type enums

---

## ➡️ Neste fase
[Fase 9: Øvrige tabeller](./fase-09-ovrige-tabeller.md)
