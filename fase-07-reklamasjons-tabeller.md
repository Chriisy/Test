# Fase 7: Reklamasjons-tabeller

**Kategori:** 🗄️ DATABASE  
**Tid:** 4 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 6 fullført

---

## 🎯 Mål
Opprette reklamasjonstabellene som er kjernen i systemet:
- **claims** (56 felt) - Hovedtabell for reklamasjoner
- **claim_parts** (15 felt) - Deler knyttet til reklamasjoner

---

## 📋 Sjekkliste

### 7.1 Opprett schema-filer
- [ ] `packages/db/src/schema/claims.ts`
- [ ] `packages/db/src/schema/claim-parts.ts`
- [ ] Oppdater `packages/db/src/schema/index.ts`

### 7.2 Push til database
```bash
pnpm db:push
```

---

## 📄 CLAIMS (Reklamasjoner) - 56 felt

```typescript
// packages/db/src/schema/claims.ts
import { pgTable, serial, text, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core'
import { customers } from './customers'
import { products } from './products'
import { suppliers } from './suppliers'
import { users } from './users'

// Status enum
export const claimStatusEnum = pgEnum('claim_status', [
  'draft',
  'new',
  'in_progress',
  'pending_supplier',
  'resolved',
  'closed'
])

// Priority enum
export const claimPriorityEnum = pgEnum('claim_priority', [
  'low',
  'medium',
  'high',
  'urgent'
])

// Warranty status enum
export const warrantyStatusEnum = pgEnum('warranty_status', [
  'in_warranty',
  'out_of_warranty'
])

export const claims = pgTable('claims', {
  id: serial('id').primaryKey(),
  
  // ========== IDENTIFIKASJON ==========
  claimNumber: text('claim_number').notNull().unique(),  // "ELE-2412-0001" format
  
  // ========== RELASJONER ==========
  customerId: integer('customer_id').references(() => customers.id),
  productId: integer('product_id').references(() => products.id),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  assignedUserId: integer('assigned_user_id').references(() => users.id),
  
  // ========== STATUS ==========
  status: claimStatusEnum('status').default('new').notNull(),
  priority: claimPriorityEnum('priority').default('medium'),
  category: text('category'),                            // type reklamasjon
  defectCategory: text('defect_category'),               // feilkategori
  
  // ========== DATOER ==========
  purchaseDate: timestamp('purchase_date', { withTimezone: true }),
  installationDate: timestamp('installation_date', { withTimezone: true }),
  reportedDate: timestamp('reported_date', { withTimezone: true }),
  warrantyExpires: timestamp('warranty_expires', { withTimezone: true }),
  
  // ========== GARANTI ==========
  warrantyStatus: warrantyStatusEnum('warranty_status'),
  
  // ========== PRODUKTINFO (denormalisert) ==========
  productCode: text('product_code'),
  productNameText: text('product_name_text'),
  serialNumber: text('serial_number'),
  batchNumber: text('batch_number'),
  referenceNumber: text('reference_number'),
  orderReferenceNumber: text('order_reference_number'),
  invoiceNumber: text('invoice_number'),
  invoiceDate: timestamp('invoice_date', { withTimezone: true }),
  
  // ========== KUNDEINFO (denormalisert) ==========
  customerContactName: text('customer_contact_name'),
  customerContactPhone: text('customer_contact_phone'),
  customerContactEmail: text('customer_contact_email'),
  customerCompanyName: text('customer_company_name'),
  customerReferenceNumber: text('customer_reference_number'),
  
  // ========== LEVERANDØR ==========
  supplierNameText: text('supplier_name_text'),          // Denormalisert
  supplierVerificationCode: text('supplier_verification_code'),  // 6-tegn kode for portal-URL
  
  // ========== ADRESSE ==========
  installationAddress: text('installation_address'),
  
  // ========== BESKRIVELSER ==========
  partsDescription: text('parts_description'),
  problemDescription: text('problem_description'),
  diagnosisDescription: text('diagnosis_description'),
  internalNotes: text('internal_notes'),
  
  // ========== KOSTNADER ==========
  estimatedPartsCost: decimal('estimated_parts_cost', { precision: 12, scale: 2 }),
  estimatedLaborCost: decimal('estimated_labor_cost', { precision: 12, scale: 2 }),
  estimatedLaborHours: decimal('estimated_labor_hours', { precision: 6, scale: 2 }),
  
  // ========== LEVERANDØRSVAR ==========
  supplierResponse: text('supplier_response'),
  supplierResponseType: text('supplier_response_type'),
  supplierCreditNote: text('supplier_credit_note'),
  supplierResolutionDate: timestamp('supplier_resolution_date', { withTimezone: true }),
  supplierRepairOption: text('supplier_repair_option'),
  supplierCompensationOffer: decimal('supplier_compensation_offer', { precision: 12, scale: 2 }),
  supplierShippingInstructions: text('supplier_shipping_instructions'),
  
  // ========== SHIPPING & PO ==========
  supplierShippingDocsUrl: text('supplier_shipping_docs_url'),
  supplierPoNumber: text('supplier_po_number'),
  supplierPoDocUrl: text('supplier_po_doc_url'),
  
  // ========== METADATA ==========
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Claim = typeof claims.$inferSelect
export type NewClaim = typeof claims.$inferInsert
```

---

## 📄 CLAIM_PARTS (Reklamasjonsdeler) - 15 felt

```typescript
// packages/db/src/schema/claim-parts.ts
import { pgTable, serial, text, timestamp, integer, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { claims } from './claims'

export const claimPartStatusEnum = pgEnum('claim_part_status', [
  'requested',
  'approved',
  'rejected',
  'shipped',
  'received'
])

export const claimParts = pgTable('claim_parts', {
  id: serial('id').primaryKey(),
  
  // Relasjon
  claimId: integer('claim_id').references(() => claims.id).notNull(),
  
  // Delinfo
  partNumber: text('part_number'),
  partName: text('part_name'),
  supplierPartNumber: text('supplier_part_number'),
  
  // Mengde og pris
  quantity: integer('quantity').default(1),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }),
  
  // Status
  status: claimPartStatusEnum('status').default('requested'),
  isWarranty: boolean('is_warranty').default(false),
  
  // Datoer
  orderedAt: timestamp('ordered_at', { withTimezone: true }),
  receivedAt: timestamp('received_at', { withTimezone: true }),
  
  // Notater
  notes: text('notes'),
  
  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ClaimPart = typeof claimParts.$inferSelect
export type NewClaimPart = typeof claimParts.$inferInsert
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
```

---

## 🔢 Reklamasjonsnummer-format

Formatet er: `[LEVERANDØR]-[ÅRMND]-[NUMMER]`

Eksempler:
- `UBE-2512-0001` → Ubert, desember 2025, sak #1
- `ELE-2501-0042` → Electrolux, januar 2025, sak #42
- `MIE-2503-0007` → Miele, mars 2025, sak #7

**Leverandørkoder (shortCode fra suppliers):**
- UBE = Ubert
- ELE = Electrolux
- MIE = Miele
- RAT = Rational
- COM = Comenda
- SCO = Scotsman
- etc.

---

## 🔄 Status-workflow

```
draft → new → in_progress → pending_supplier → resolved → closed
  ↓       ↓         ↓              ↓               ↓
 Utkast  Ny     Pågår      Venter svar       Løst      Arkivert
```

**Farger for status:**
- draft: `gray`
- new: `blue`
- in_progress: `yellow`
- pending_supplier: `orange`
- resolved: `green`
- closed: `slate`

---

## 🔧 Claude Code Prompt

```
Les packages/db/src/schema/ mappen.

Opprett claims tabellen med EKSAKT 56 felt:
- Identifikasjon: claimNumber
- Relasjoner: customerId, productId, supplierId, assignedUserId
- Status: status, priority, category, defectCategory
- Datoer: purchaseDate, installationDate, reportedDate, warrantyExpires
- Garanti: warrantyStatus
- Produktinfo: productCode, productNameText, serialNumber, batchNumber, referenceNumber, orderReferenceNumber, invoiceNumber, invoiceDate
- Kundeinfo: customerContactName, customerContactPhone, customerContactEmail, customerCompanyName, customerReferenceNumber
- Leverandør: supplierNameText, supplierVerificationCode
- Adresse: installationAddress
- Beskrivelser: partsDescription, problemDescription, diagnosisDescription, internalNotes
- Kostnader: estimatedPartsCost, estimatedLaborCost, estimatedLaborHours
- Leverandørsvar: supplierResponse, supplierResponseType, supplierCreditNote, supplierResolutionDate, supplierRepairOption, supplierCompensationOffer, supplierShippingInstructions
- Shipping: supplierShippingDocsUrl, supplierPoNumber, supplierPoDocUrl
- Metadata: createdAt, updatedAt

Opprett også claim_parts med 15 felt.

Bruk pgEnum for status, priority, warrantyStatus.
```

---

## ✅ Verifisering

```bash
pnpm db:push
pnpm db:studio
```

Sjekk at:
- claims har 56 kolonner
- claim_parts har 15 kolonner
- Enums er opprettet (claim_status, claim_priority, etc.)

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ claims tabell (56 felt) - komplett reklamasjonshåndtering
- ✅ claim_parts tabell (15 felt) - deler og reservedeler
- ✅ Status enums definert
- ✅ Relasjoner til customers, products, suppliers, users

---

## ➡️ Neste fase
[Fase 8: Service-tabeller](./fase-08-service-tabeller.md)
