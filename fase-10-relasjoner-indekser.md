# Fase 10: Relasjoner og Indekser

**Kategori:** 🗄️ DATABASE  
**Tid:** 2-3 timer  
**Prioritet:** 🟡 Høy  
**Avhengigheter:** Fase 6-9 fullført

---

## 🎯 Mål
Definere Drizzle-relasjoner mellom tabeller og opprette indekser for bedre ytelse.

---

## 📋 Sjekkliste

### 10.1 Opprett relations-fil
- [ ] `packages/db/src/schema/relations.ts`
- [ ] Oppdater `packages/db/src/schema/index.ts`

### 10.2 Opprett indekser
- [ ] Legg til indekser i hver tabell
- [ ] Push til database

---

## 📄 RELATIONS (Drizzle relasjoner)

```typescript
// packages/db/src/schema/relations.ts
import { relations } from 'drizzle-orm'

import { users } from './users'
import { customers } from './customers'
import { suppliers } from './suppliers'
import { products } from './products'
import { claims } from './claims'
import { claimParts } from './claim-parts'
import { installations } from './installations'
import { storkjokkenAgreements } from './storkjokken-agreements'
import { dagligvareAgreements } from './dagligvare-agreements'
import { serviceVisits } from './service-visits'
import { transportDamages } from './transport-damages'
import { discussionIssues } from './discussion-issues'
import { servicePartners } from './service-partners'

// ========== USERS RELATIONS ==========
export const usersRelations = relations(users, ({ many }) => ({
  // Bruker kan ha mange reklamasjoner tildelt
  assignedClaims: many(claims),
  // Bruker kan ha opprettet mange installasjoner
  createdInstallations: many(installations),
  // Bruker kan være tekniker på mange besøk
  serviceVisits: many(serviceVisits),
  // Bruker kan ha rapportert mange transportskader
  reportedDamages: many(transportDamages),
  // Bruker kan ha mange saker
  assignedIssues: many(discussionIssues),
}))

// ========== CUSTOMERS RELATIONS ==========
export const customersRelations = relations(customers, ({ many }) => ({
  claims: many(claims),
  installations: many(installations),
  storkjokkenAgreements: many(storkjokkenAgreements),
  dagligvareAgreements: many(dagligvareAgreements),
  serviceVisits: many(serviceVisits),
  transportDamages: many(transportDamages),
  discussionIssues: many(discussionIssues),
}))

// ========== SUPPLIERS RELATIONS ==========
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
  claims: many(claims),
  transportDamages: many(transportDamages),
  discussionIssues: many(discussionIssues),
}))

// ========== PRODUCTS RELATIONS ==========
export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  claims: many(claims),
  transportDamages: many(transportDamages),
}))

// ========== CLAIMS RELATIONS ==========
export const claimsRelations = relations(claims, ({ one, many }) => ({
  customer: one(customers, {
    fields: [claims.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [claims.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [claims.supplierId],
    references: [suppliers.id],
  }),
  assignedUser: one(users, {
    fields: [claims.assignedUserId],
    references: [users.id],
  }),
  parts: many(claimParts),
  discussionIssues: many(discussionIssues),
}))

// ========== CLAIM_PARTS RELATIONS ==========
export const claimPartsRelations = relations(claimParts, ({ one }) => ({
  claim: one(claims, {
    fields: [claimParts.claimId],
    references: [claims.id],
  }),
}))

// ========== INSTALLATIONS RELATIONS ==========
export const installationsRelations = relations(installations, ({ one, many }) => ({
  customer: one(customers, {
    fields: [installations.customerId],
    references: [customers.id],
  }),
  leadInstaller: one(users, {
    fields: [installations.leadInstallerId],
    references: [users.id],
  }),
  projectManager: one(users, {
    fields: [installations.projectManagerId],
    references: [users.id],
  }),
  transportDamages: many(transportDamages),
}))

// ========== STORKJOKKEN_AGREEMENTS RELATIONS ==========
export const storkjokkenAgreementsRelations = relations(storkjokkenAgreements, ({ one, many }) => ({
  customer: one(customers, {
    fields: [storkjokkenAgreements.customerId],
    references: [customers.id],
  }),
  createdBy: one(users, {
    fields: [storkjokkenAgreements.createdById],
    references: [users.id],
  }),
  serviceVisits: many(serviceVisits),
}))

// ========== SERVICE_VISITS RELATIONS ==========
export const serviceVisitsRelations = relations(serviceVisits, ({ one }) => ({
  agreement: one(storkjokkenAgreements, {
    fields: [serviceVisits.agreementId],
    references: [storkjokkenAgreements.id],
  }),
  customer: one(customers, {
    fields: [serviceVisits.customerId],
    references: [customers.id],
  }),
  technician: one(users, {
    fields: [serviceVisits.technicianId],
    references: [users.id],
  }),
}))

// ========== TRANSPORT_DAMAGES RELATIONS ==========
export const transportDamagesRelations = relations(transportDamages, ({ one }) => ({
  reportedByUser: one(users, {
    fields: [transportDamages.reportedBy],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [transportDamages.customerId],
    references: [customers.id],
  }),
  supplier: one(suppliers, {
    fields: [transportDamages.supplierId],
    references: [suppliers.id],
  }),
  product: one(products, {
    fields: [transportDamages.productId],
    references: [products.id],
  }),
  installation: one(installations, {
    fields: [transportDamages.installationId],
    references: [installations.id],
  }),
}))

// ========== DISCUSSION_ISSUES RELATIONS ==========
export const discussionIssuesRelations = relations(discussionIssues, ({ one }) => ({
  customer: one(customers, {
    fields: [discussionIssues.customerId],
    references: [customers.id],
  }),
  claim: one(claims, {
    fields: [discussionIssues.claimId],
    references: [claims.id],
  }),
  supplier: one(suppliers, {
    fields: [discussionIssues.supplierId],
    references: [suppliers.id],
  }),
  assignedTo: one(users, {
    fields: [discussionIssues.assignedToId],
    references: [users.id],
  }),
  createdBy: one(users, {
    fields: [discussionIssues.createdById],
    references: [users.id],
  }),
}))

// ========== SERVICE_PARTNERS RELATIONS ==========
export const servicePartnersRelations = relations(servicePartners, ({ one }) => ({
  serviceCoordinator: one(users, {
    fields: [servicePartners.serviceCoordinatorId],
    references: [users.id],
  }),
}))
```

---

## 📄 INDEKSER

Legg til indekser i hver tabell for bedre ytelse:

```typescript
// I claims.ts, legg til etter tabelldefinisjonen:
import { index } from 'drizzle-orm/pg-core'

export const claims = pgTable('claims', {
  // ... alle felt ...
}, (table) => ({
  // Indekser for vanlige søk
  statusIdx: index('claims_status_idx').on(table.status),
  customerIdx: index('claims_customer_idx').on(table.customerId),
  supplierIdx: index('claims_supplier_idx').on(table.supplierId),
  assignedUserIdx: index('claims_assigned_user_idx').on(table.assignedUserId),
  claimNumberIdx: index('claims_claim_number_idx').on(table.claimNumber),
  createdAtIdx: index('claims_created_at_idx').on(table.createdAt),
}))
```

**Viktige indekser per tabell:**

| Tabell | Indekser |
|--------|----------|
| claims | status, customerId, supplierId, claimNumber, createdAt |
| customers | customerNumber, name, isActive |
| suppliers | supplierCode, shortCode, isActive |
| products | sku, supplierId, isActive |
| installations | status, customerId, plannedStartDate |
| service_visits | status, agreementId, plannedDate, technicianId |
| transport_damages | status, reportedBy, reportedAt |
| discussion_issues | status, type, assignedToId |
| service_partners | status, tradeArea, county |

---

## 📄 Oppdater index.ts

```typescript
// packages/db/src/schema/index.ts
// Tabeller
export * from './users'
export * from './customers'
export * from './suppliers'
export * from './products'
export * from './claims'
export * from './claim-parts'
export * from './storkjokken-agreements'
export * from './dagligvare-agreements'
export * from './service-visits'
export * from './installations'
export * from './transport-damages'
export * from './discussion-issues'
export * from './service-partners'

// Relasjoner
export * from './relations'
```

---

## 🔧 Claude Code Prompt

```
Les packages/db/src/schema/ mappen.

Opprett en relations.ts fil som definerer alle Drizzle relasjoner:
- users → claims, installations, serviceVisits, etc.
- customers → claims, installations, agreements, etc.
- suppliers → products, claims
- claims → customer, product, supplier, assignedUser, parts
- osv.

Legg også til indekser på de mest brukte kolonnene:
- claims: status, customerId, supplierId
- customers: customerNumber, isActive
- installations: status, plannedStartDate
```

---

## ✅ Verifisering

```bash
# Push til database (oppretter indekser)
pnpm db:push

# Sjekk at relasjoner fungerer
pnpm db:studio
```

I Drizzle Studio, prøv å:
1. Velg en kunde
2. Se at relaterte reklamasjoner vises
3. Velg en reklamasjon
4. Se at kunde, produkt, leverandør er lenket

---

## 📊 Database-oversikt komplett

```
┌─────────────────────────────────────────────────────────────────┐
│                    MYHRVOLDGRUPPEN DATABASE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  KJERNE (4 tabeller, ~91 felt)                                 │
│  ├── users (26)                                                 │
│  ├── customers (20)                                             │
│  ├── suppliers (24)                                             │
│  └── products (21)                                              │
│                                                                 │
│  REKLAMASJON (2 tabeller, ~71 felt)                            │
│  ├── claims (56)                                                │
│  └── claim_parts (15)                                           │
│                                                                 │
│  SERVICE (3 tabeller, ~85 felt)                                │
│  ├── storkjokken_agreements (40+)                              │
│  ├── dagligvare_agreements (~25)                               │
│  └── service_visits (~20)                                      │
│                                                                 │
│  ØVRIGE (4 tabeller, ~109 felt)                                │
│  ├── installations (35+)                                        │
│  ├── transport_damages (28)                                     │
│  ├── discussion_issues (28)                                     │
│  └── service_partners (18)                                      │
│                                                                 │
│  TOTALT: 13 tabeller, ~356 felt                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ Alle Drizzle-relasjoner definert
- ✅ Indekser for bedre ytelse
- ✅ Komplett databasestruktur
- ✅ 13 tabeller med ~356 felt
- ✅ Klar for tRPC-utvikling

---

## 🎉 Database fullført!

Du har nå en komplett enterprise-database med:
- Full reklamasjonshåndtering
- Serviceavtaler (storkjøkken + dagligvare)
- Installasjonsprosjekter
- Transportskader med GPS
- Diskusjoner og saker
- Servicepartnere med kart

---

## ➡️ Neste fase
[Fase 11: Auth-oppsett (Clerk)](./fase-11-auth-oppsett.md)
