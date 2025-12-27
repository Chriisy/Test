# Fase 29: Datamigrering

**Kategori:** 🏁 POLERING  
**Tid:** 4-6 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 26 fullført

---

## 🎯 Mål
Migrere eksisterende data fra Replit-systemet til ny Supabase-database.

---

## 📊 Data som skal migreres

| Data | Antall | Prioritet |
|------|--------|-----------|
| Kunder | 207 | 🔴 Kritisk |
| Serviceavtaler | 117 | 🔴 Kritisk |
| Reklamasjoner | 23 | 🔴 Kritisk |
| Servicepartnere | 47 | 🟡 Høy |
| Brukere | ~10 | 🟡 Høy |
| Installasjoner | ? | 🟢 Medium |
| Produkter | ? | 🟢 Medium |

---

## 📋 Migreringsplan

### Steg 1: Eksporter fra Replit
```bash
# I Replit-prosjektet
pg_dump -h localhost -U postgres -d replit_db > backup.sql

# Eller via API
curl https://myhrvoldgruppen.replit.app/api/export/customers > customers.json
curl https://myhrvoldgruppen.replit.app/api/export/claims > claims.json
# etc.
```

### Steg 2: Transformer data
Lag et migreringsscript som mapper gammel struktur til ny:

```typescript
// scripts/migrate.ts
import { parse } from 'csv-parse'
import { db } from '@myhrvold/db'
import { customers, claims } from '@myhrvold/db/schema'

async function migrateCustomers() {
  const oldCustomers = await readJSON('exports/customers.json')
  
  for (const old of oldCustomers) {
    await db.insert(customers).values({
      customerNumber: old.customer_number,
      name: old.name,
      email: old.email,
      phone: old.phone,
      orgNumber: old.org_number,
      contactPerson: old.contact_person,
      address: old.address,
      postalCode: old.postal_code,
      city: old.city,
      country: old.country || 'Norge',
      category: old.category,
      customerSegment: old.customer_segment,
      customerGroup: old.customer_group,
      customerChain: old.customer_chain,
      department: old.department,
      dataSource: 'migration',
      isActive: old.is_active ?? true,
      notes: old.notes,
      createdAt: old.created_at ? new Date(old.created_at) : new Date(),
    })
  }
  
  console.log(`Migrert ${oldCustomers.length} kunder`)
}

async function migrateClaims() {
  const oldClaims = await readJSON('exports/claims.json')
  
  for (const old of oldClaims) {
    await db.insert(claims).values({
      claimNumber: old.claim_number,
      customerId: await getCustomerIdByNumber(old.customer_number),
      productId: await getProductIdBySku(old.product_code),
      supplierId: await getSupplierIdByCode(old.supplier_code),
      status: mapStatus(old.status),
      priority: old.priority || 'medium',
      problemDescription: old.problem_description,
      // ... resten av feltene
    })
  }
}

// Kjør migrering
async function main() {
  console.log('Starter migrering...')
  await migrateCustomers()
  await migrateSuppliers()
  await migrateProducts()
  await migrateClaims()
  console.log('Migrering fullført!')
}

main()
```

### Steg 3: Valider data
```typescript
// scripts/validate.ts
async function validateMigration() {
  const customerCount = await db.select({ count: sql`count(*)` }).from(customers)
  const claimCount = await db.select({ count: sql`count(*)` }).from(claims)
  
  console.log('Validering:')
  console.log(`- Kunder: ${customerCount[0].count} (forventet: 207)`)
  console.log(`- Reklamasjoner: ${claimCount[0].count} (forventet: 23)`)
  
  // Sjekk relasjoner
  const orphanedClaims = await db
    .select()
    .from(claims)
    .where(isNull(claims.customerId))
  
  if (orphanedClaims.length > 0) {
    console.warn(`⚠️ ${orphanedClaims.length} reklamasjoner uten kunde!`)
  }
}
```

---

## 🔄 Mapping gammel → ny

### Status-mapping
```typescript
const statusMap = {
  'new': 'new',
  'pending': 'in_progress',
  'awaiting_supplier': 'pending_supplier',
  'resolved': 'resolved',
  'closed': 'closed',
}
```

### Felt-mapping (eksempel)
```typescript
const customerMapping = {
  'customer_number': 'customerNumber',
  'org_number': 'orgNumber',
  'contact_person': 'contactPerson',
  'postal_code': 'postalCode',
  // etc.
}
```

---

## ⚠️ Viktige hensyn

1. **Kjør i testmiljø først**
2. **Ta backup av Supabase før import**
3. **Sjekk fremmednøkler** - importer i riktig rekkefølge
4. **Valider data** - spesielt datoer og tall
5. **Behold gamle ID-er som referanse** (lagre i notes eller eget felt)

---

## ✅ Verifisering

- [ ] Alle 207 kunder migrert
- [ ] Alle 117 serviceavtaler migrert
- [ ] Alle 23 reklamasjoner migrert
- [ ] Alle 47 servicepartnere migrert
- [ ] Relasjoner intakte
- [ ] Ingen orphaned records

---

## 📦 Leveranse

- ✅ Migreringsscript
- ✅ Data validert
- ✅ Produksjonsdata importert
- ✅ Backup av gammel data

---

## ➡️ Neste fase
[Fase 30: Testing & Lansering](./fase-30-testing-lansering.md)
