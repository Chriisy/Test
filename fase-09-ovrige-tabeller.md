# Fase 9: Øvrige tabeller

**Kategori:** 🗄️ DATABASE  
**Tid:** 4 timer  
**Prioritet:** 🟡 Høy  
**Avhengigheter:** Fase 6 fullført

---

## 🎯 Mål
Opprette de resterende tabellene:
- **installations** (35+ felt) - Installasjonsprosjekter
- **transport_damages** (28 felt) - Transportskader
- **discussion_issues** (28 felt) - Saker og diskusjoner ⚠️ **VIKTIG - manglet før!**
- **service_partners** (18 felt) - Servicepartnere med GPS

---

## 📋 Sjekkliste

### 9.1 Opprett schema-filer
- [ ] `packages/db/src/schema/installations.ts`
- [ ] `packages/db/src/schema/transport-damages.ts`
- [ ] `packages/db/src/schema/discussion-issues.ts`
- [ ] `packages/db/src/schema/service-partners.ts`
- [ ] Oppdater `packages/db/src/schema/index.ts`

---

## 📄 INSTALLATIONS (Installasjoner) - 35+ felt

```typescript
// packages/db/src/schema/installations.ts
import { pgTable, serial, text, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core'
import { customers } from './customers'
import { users } from './users'

export const installationStatusEnum = pgEnum('installation_status', [
  'planned',
  'in_progress',
  'completed',
  'cancelled'
])

export const installationPriorityEnum = pgEnum('installation_priority', [
  'low',
  'normal',
  'high',
  'urgent'
])

export const installations = pgTable('installations', {
  id: serial('id').primaryKey(),
  
  // ========== IDENTIFIKASJON ==========
  installationNumber: text('installation_number').unique(),
  projectName: text('project_name'),
  
  // ========== RELASJONER ==========
  customerId: integer('customer_id').references(() => customers.id),
  leadInstallerId: integer('lead_installer_id').references(() => users.id),  // Hovedmontør
  projectManagerId: integer('project_manager_id').references(() => users.id),
  createdById: integer('created_by_id').references(() => users.id),
  
  // ========== KUNDEINFO (denormalisert) ==========
  customerName: text('customer_name'),
  customerNumber: text('customer_number'),
  contactPerson: text('contact_person'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  
  // ========== LEVERINGSADRESSE ==========
  deliveryAddress: text('delivery_address'),
  postalCode: text('postal_code'),
  city: text('city'),
  
  // ========== STATUS ==========
  status: installationStatusEnum('status').default('planned'),
  priority: installationPriorityEnum('priority').default('normal'),
  projectType: text('project_type'),
  installationType: text('installation_type'),
  
  // ========== DATOER ==========
  plannedStartDate: timestamp('planned_start_date', { withTimezone: true }),
  plannedEndDate: timestamp('planned_end_date', { withTimezone: true }),
  actualStartDate: timestamp('actual_start_date', { withTimezone: true }),
  actualEndDate: timestamp('actual_end_date', { withTimezone: true }),
  
  // ========== TIMER OG KOSTNADER ==========
  estimatedHours: decimal('estimated_hours', { precision: 8, scale: 2 }),
  actualHours: decimal('actual_hours', { precision: 8, scale: 2 }),
  estimatedCost: decimal('estimated_cost', { precision: 12, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 12, scale: 2 }),
  
  // ========== ORDRE ==========
  orderNumber: text('order_number'),
  orderValue: decimal('order_value', { precision: 12, scale: 2 }),
  invoiceNumber: text('invoice_number'),
  
  // ========== NOTATER ==========
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  
  // ========== SIGNATUR ==========
  customerSignature: text('customer_signature'),        // Base64
  signedAt: timestamp('signed_at', { withTimezone: true }),
  
  // ========== METADATA ==========
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Installation = typeof installations.$inferSelect
export type NewInstallation = typeof installations.$inferInsert
```

---

## 📄 TRANSPORT_DAMAGES (Transportskader) - 28 felt

```typescript
// packages/db/src/schema/transport-damages.ts
import { pgTable, serial, text, timestamp, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'
import { customers } from './customers'
import { suppliers } from './suppliers'
import { products } from './products'
import { installations } from './installations'

export const damageTypeEnum = pgEnum('damage_type', [
  'collision',
  'scratch',
  'dent',
  'water',
  'other'
])

export const damageSeverityEnum = pgEnum('damage_severity', [
  'minor',
  'medium',
  'major',
  'critical'
])

export const damageStatusEnum = pgEnum('damage_status', [
  'reported',
  'under_review',
  'confirmed',
  'rejected',
  'resolved'
])

export const transportDamages = pgTable('transport_damages', {
  id: serial('id').primaryKey(),
  
  // ========== IDENTIFIKASJON ==========
  damageNumber: text('damage_number').unique(),
  reportedBy: integer('reported_by').references(() => users.id),
  
  // ========== SKADEINFO ==========
  damageType: damageTypeEnum('damage_type'),
  severity: damageSeverityEnum('severity'),
  description: text('description'),
  
  // ========== TRANSPORT ==========
  carrier: text('carrier'),                             // Transportør
  waybillNumber: text('waybill_number'),                // Fraktbrev nr
  trackingNumber: text('tracking_number'),
  loadReference: text('load_reference'),
  driverName: text('driver_name'),
  
  // ========== RELASJONER ==========
  orderId: text('order_id'),
  deliveryNumber: text('delivery_number'),
  customerId: integer('customer_id').references(() => customers.id),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  productId: integer('product_id').references(() => products.id),
  installationId: integer('installation_id').references(() => installations.id),
  
  // ========== LOKASJON ==========
  location: text('location'),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  
  // ========== STATUS ==========
  status: damageStatusEnum('status').default('reported'),
  assignedTo: integer('assigned_to').references(() => users.id),
  resolution: text('resolution'),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  resolvedBy: integer('resolved_by').references(() => users.id),
  
  // ========== ØKONOMI ==========
  estimatedCost: decimal('estimated_cost', { precision: 12, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 12, scale: 2 }),
  insuranceClaim: boolean('insurance_claim').default(false),
  insuranceClaimNumber: text('insurance_claim_number'),
  
  // ========== TIDSPUNKT ==========
  reportedAt: timestamp('reported_at', { withTimezone: true }),
  
  // ========== METADATA ==========
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type TransportDamage = typeof transportDamages.$inferSelect
export type NewTransportDamage = typeof transportDamages.$inferInsert
```

---

## 📄 DISCUSSION_ISSUES (Saker/Diskusjoner) - 28 felt ⚠️

**VIKTIG:** Denne tabellen manglet helt i forrige versjon!

```typescript
// packages/db/src/schema/discussion-issues.ts
import { pgTable, serial, text, timestamp, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'
import { customers } from './customers'
import { suppliers } from './suppliers'
import { claims } from './claims'

export const issueTypeEnum = pgEnum('issue_type', [
  'general',
  'invoice',
  'customer',
  'internal',
  'meeting'
])

export const issueStatusEnum = pgEnum('issue_status', [
  'new',
  'in_progress',
  'resolved',
  'closed'
])

export const issuePriorityEnum = pgEnum('issue_priority', [
  'low',
  'normal',
  'high',
  'urgent'
])

export const issueSourceEnum = pgEnum('issue_source', [
  'manual',
  'email',
  'outlook'
])

export const discussionIssues = pgTable('discussion_issues', {
  id: serial('id').primaryKey(),
  
  // ========== INNHOLD ==========
  title: text('title').notNull(),
  description: text('description'),
  
  // ========== TYPE OG STATUS ==========
  type: issueTypeEnum('type').default('general'),
  status: issueStatusEnum('status').default('new'),
  priority: issuePriorityEnum('priority').default('normal'),
  source: issueSourceEnum('source').default('manual'),
  
  // ========== RELASJONER ==========
  customerId: integer('customer_id').references(() => customers.id),
  organizationId: integer('organization_id'),
  claimId: integer('claim_id').references(() => claims.id),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  
  // ========== FAKTURA ==========
  invoiceNumber: text('invoice_number'),
  invoiceAmount: decimal('invoice_amount', { precision: 12, scale: 2 }),
  invoiceDate: timestamp('invoice_date', { withTimezone: true }),
  
  // ========== OUTLOOK INTEGRASJON ==========
  outlookMessageId: text('outlook_message_id'),
  outlookConversationId: text('outlook_conversation_id'),
  emailFrom: text('email_from'),
  emailSubject: text('email_subject'),
  
  // ========== MØTE ==========
  meetingDate: timestamp('meeting_date', { withTimezone: true }),
  scheduledForMeeting: boolean('scheduled_for_meeting').default(false),
  dueDate: timestamp('due_date', { withTimezone: true }),
  tags: text('tags').array(),                           // text[]
  
  // ========== TILORDNING ==========
  assignedToId: integer('assigned_to_id').references(() => users.id),
  createdById: integer('created_by_id').references(() => users.id),
  resolvedById: integer('resolved_by_id').references(() => users.id),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  resolution: text('resolution'),
  
  // ========== METADATA ==========
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type DiscussionIssue = typeof discussionIssues.$inferSelect
export type NewDiscussionIssue = typeof discussionIssues.$inferInsert
```

---

## 📄 SERVICE_PARTNERS (Servicepartnere) - 18 felt

```typescript
// packages/db/src/schema/service-partners.ts
import { pgTable, serial, text, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

export const partnerTypeEnum = pgEnum('partner_type', [
  'partner',
  'employee'
])

export const partnerStatusEnum = pgEnum('partner_status', [
  'active',
  'pause',
  'inactive'
])

export const tradeAreaEnum = pgEnum('trade_area', [
  'elektriker',
  'kjoletekniker',      // kjøletekniker
  'rorlegger',          // rørlegger
  'montor',             // montør
  'vaktmester'
])

export const servicePartners = pgTable('service_partners', {
  id: serial('id').primaryKey(),
  
  // ========== INFO ==========
  companyName: text('company_name').notNull(),
  contactPerson: text('contact_person'),
  organizationNumber: text('organization_number'),
  
  // ========== TYPE OG STATUS ==========
  type: partnerTypeEnum('type').default('partner'),
  status: partnerStatusEnum('status').default('active'),
  tradeArea: tradeAreaEnum('trade_area'),
  
  // ========== KONTAKT ==========
  phone: text('phone'),
  email: text('email'),
  
  // ========== ADRESSE ==========
  address: text('address'),
  postalCode: text('postal_code'),
  city: text('city'),
  county: text('county'),                              // Fylke
  
  // ========== DEKNINGSOMRÅDE ==========
  serviceArea: text('service_area'),                   // Tekstbeskrivelse
  workRadius: integer('work_radius'),                  // Arbeidsradius i km
  
  // ========== GPS ==========
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  
  // ========== KOORDINATOR ==========
  serviceCoordinatorId: integer('service_coordinator_id').references(() => users.id),
  
  // ========== ANNET ==========
  notes: text('notes'),
  createdBy: integer('created_by').references(() => users.id),
  
  // ========== METADATA ==========
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ServicePartner = typeof servicePartners.$inferSelect
export type NewServicePartner = typeof servicePartners.$inferInsert
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
export * from './installations'
export * from './transport-damages'
export * from './discussion-issues'
export * from './service-partners'
```

---

## 🗺️ Servicepartnere med kart

Servicepartnere vises på kart med Leaflet:
- Hver partner har latitude/longitude
- workRadius viser dekningsområde som sirkel
- Filtrer på status, tradeArea, county

```typescript
// Eksempel på kart-data
const partners = [
  {
    companyName: "Kulde AS",
    latitude: 59.9139,
    longitude: 10.7522,
    workRadius: 50,  // 50 km
    tradeArea: "kjoletekniker"
  }
]
```

---

## ✅ Verifisering

```bash
pnpm db:push
pnpm db:studio
```

Sjekk at alle tabeller finnes:
- installations: 35+ kolonner
- transport_damages: 28 kolonner
- discussion_issues: 28 kolonner ⚠️
- service_partners: 18 kolonner

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ installations (35+ felt) med signatur
- ✅ transport_damages (28 felt) med GPS
- ✅ discussion_issues (28 felt) med Outlook-integrasjon
- ✅ service_partners (18 felt) med kart-støtte

---

## ➡️ Neste fase
[Fase 10: Relasjoner og indekser](./fase-10-relasjoner-indekser.md)
