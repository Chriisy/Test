# Fase 6: Kjerne-tabeller

**Kategori:** 🗄️ DATABASE  
**Tid:** 4 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 3 fullført

---

## 🎯 Mål
Opprette de 4 grunnleggende tabellene som hele systemet bygger på:
- **users** (26 felt)
- **customers** (20 felt)
- **suppliers** (24 felt)
- **products** (21 felt)

---

## 📋 Sjekkliste

### 6.1 Opprett schema-filer
- [ ] `packages/db/src/schema/users.ts`
- [ ] `packages/db/src/schema/customers.ts`
- [ ] `packages/db/src/schema/suppliers.ts`
- [ ] `packages/db/src/schema/products.ts`
- [ ] Oppdater `packages/db/src/schema/index.ts`

### 6.2 Push til database
```bash
pnpm db:push
```

### 6.3 Verifiser i Drizzle Studio
```bash
pnpm db:studio
```

---

## 📄 USERS (Brukere) - 26 felt

```typescript
// packages/db/src/schema/users.ts
import { pgTable, serial, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'manager',
  'coordinator',
  'technician',  // 'tech' i eksisterende system
  'sales',
  'user'
])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  
  // Innlogging
  username: text('username').unique(),
  email: text('email').notNull().unique(),
  password: text('password'),                    // bcrypt hash
  
  // Personinfo
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  avatar: text('avatar'),
  
  // Rolle og avdeling
  role: userRoleEnum('role').default('user').notNull(),
  functionalRole: text('functional_role'),       // Funksjonell rolle
  department: text('department'),
  departmentId: integer('department_id'),        // FK → departments
  
  // Status
  isActive: boolean('is_active').default(true).notNull(),
  isApproved: boolean('is_approved').default(false).notNull(),
  approvedBy: integer('approved_by'),            // FK → users
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  
  // OAuth
  replitId: text('replit_id'),                   // Replit OAuth ID
  oauthProvider: text('oauth_provider'),
  oauthId: text('oauth_id'),
  
  // Aktivitet
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
  
  // GDPR
  gdprConsentAt: timestamp('gdpr_consent_at', { withTimezone: true }),
  gdprConsentVersion: text('gdpr_consent_version'),
  
  // UI
  welcomeMessageDismissed: boolean('welcome_message_dismissed').default(false),
  
  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

---

## 📄 CUSTOMERS (Kunder) - 20 felt

```typescript
// packages/db/src/schema/customers.ts
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  
  // Identifikasjon
  customerNumber: text('customer_number').unique(),  // Unikt kundenummer
  name: text('name').notNull(),                      // Firmanavn
  orgNumber: text('org_number'),                     // Org.nr
  externalId: text('external_id'),                   // Ekstern ID
  
  // Kontaktinfo
  email: text('email'),
  phone: text('phone'),
  contactPerson: text('contact_person'),
  
  // Adresse
  address: text('address'),
  postalCode: text('postal_code'),
  city: text('city'),
  country: text('country').default('Norge'),
  
  // Kategorisering (Visma-felter)
  category: text('category'),                        // Kundekategori
  customerSegment: text('customer_segment'),         // Aldersgruppering (Visma)
  customerGroup: text('customer_group'),             // Kundegruppe
  customerChain: text('customer_chain'),             // Kundeprisgruppe 2 (Visma)
  department: text('department'),                    // Avdeling
  
  // Import
  dataSource: text('data_source'),                   // manual, import, api
  
  // Status
  isActive: boolean('is_active').default(true).notNull(),
  notes: text('notes'),
  
  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
```

---

## 📄 SUPPLIERS (Leverandører) - 24 felt

```typescript
// packages/db/src/schema/suppliers.ts
import { pgTable, serial, text, timestamp, boolean, integer, real } from 'drizzle-orm/pg-core'

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  
  // Identifikasjon
  supplierCode: text('supplier_code').unique(),      // Leverandørkode
  shortCode: text('short_code'),                     // 3-tegns kode (ELE, MIE, RAT)
  name: text('name').notNull(),
  
  // Kontaktinfo
  email: text('email'),
  phone: text('phone'),
  contactPerson: text('contact_person'),
  contactEmail: text('contact_email'),
  
  // Adresse
  address: text('address'),
  postalCode: text('postal_code'),
  city: text('city'),
  country: text('country').default('Norge'),
  website: text('website'),
  
  // Garanti og SLA
  warrantyDays: integer('warranty_days').default(365),
  warrantyText: text('warranty_text'),
  warrantyType: text('warranty_type'),               // parts, full, mixed
  slaResponseDays: integer('sla_response_days').default(14),
  
  // Kategorisering
  productSegment: text('product_segment'),
  countryOfOrigin: text('country_of_origin'),
  
  // Rabatt
  discountText: text('discount_text'),
  discountPercent: real('discount_percent'),
  
  // Import
  importedAt: timestamp('imported_at', { withTimezone: true }),
  importSource: text('import_source'),
  
  // Status
  isActive: boolean('is_active').default(true).notNull(),
  notes: text('notes'),
  
  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Supplier = typeof suppliers.$inferSelect
export type NewSupplier = typeof suppliers.$inferInsert
```

---

## 📄 PRODUCTS (Produkter) - 21 felt

```typescript
// packages/db/src/schema/products.ts
import { pgTable, serial, text, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core'
import { suppliers } from './suppliers'

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  
  // Identifikasjon
  sku: text('sku'),                                  // Artikkelnummer
  externalId: text('external_id'),                   // Ekstern ID
  name: text('name').notNull(),
  description: text('description'),
  
  // Kategorisering
  category: text('category'),
  categoryId: integer('category_id'),                // FK → product_categories
  
  // Leverandør
  supplierId: integer('supplier_id').references(() => suppliers.id),
  supplierName: text('supplier_name'),               // Denormalisert for rask visning
  
  // Priser
  purchasePrice: decimal('purchase_price', { precision: 12, scale: 2 }),
  sellingPrice: decimal('selling_price', { precision: 12, scale: 2 }),
  
  // Garanti
  warrantyMonths: integer('warranty_months').default(24),
  
  // Media
  imageUrl: text('image_url'),
  documentationUrl: text('documentation_url'),
  sourceUrl: text('source_url'),
  
  // Spesifikasjoner (JSONB for fleksibilitet)
  specifications: jsonb('specifications'),           // { voltage: "230V", capacity: "100L" }
  dimensions: text('dimensions'),
  weight: text('weight'),
  voltage: text('voltage'),
  capacity: text('capacity'),
  
  // Synkronisering
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
  
  // Status
  isActive: boolean('is_active').default(true).notNull(),
  
  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
```

---

## 📄 Oppdater index.ts

```typescript
// packages/db/src/schema/index.ts
export * from './users'
export * from './customers'
export * from './suppliers'
export * from './products'
```

---

## 🔧 Claude Code Prompt

```
Les packages/db/src/schema/ mappen.

Opprett disse fire tabellene med EKSAKT denne strukturen:

1. users - 26 felt inkludert:
   - OAuth felter (replitId, oauthProvider, oauthId)
   - GDPR felter (gdprConsentAt, gdprConsentVersion)
   - welcomeMessageDismissed

2. customers - 20 felt inkludert:
   - Visma-felter (customerSegment, customerGroup, customerChain)
   - dataSource felt

3. suppliers - 24 felt inkludert:
   - shortCode (3-tegn)
   - warrantyType, warrantyDays, warrantyText
   - discountPercent, discountText

4. products - 21 felt inkludert:
   - specifications som jsonb
   - voltage, capacity felter

Bruk Drizzle ORM syntax. Vis meg filen før du oppretter den.
```

---

## ✅ Verifisering

```bash
# Push til database
pnpm db:push
# Skal vise: "Your database is now in sync with your schema"

# Åpne Drizzle Studio
pnpm db:studio
```

Du skal se alle 4 tabeller med riktig antall kolonner:
- users: 26 kolonner
- customers: 20 kolonner
- suppliers: 24 kolonner
- products: 21 kolonner

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ users tabell (26 felt) med OAuth og GDPR
- ✅ customers tabell (20 felt) med Visma-felter
- ✅ suppliers tabell (24 felt) med garanti og SLA
- ✅ products tabell (21 felt) med jsonb specs
- ✅ Alle tabeller synlige i database

---

## ➡️ Neste fase
[Fase 7: Reklamasjons-tabeller](./fase-07-reklamasjons-tabeller.md)
