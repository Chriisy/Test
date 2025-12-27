# Fase 19: Salg & Admin

**Kategori:** 💻 WEB-PORTAL  
**Tid:** 6-8 timer  
**Prioritet:** 🟡 Høy  
**Avhengigheter:** Fase 18 fullført

---

## 🎯 Mål
Bygge salgs- og admin-moduler: kunder, CRM, stamdata og brukeradministrasjon.

---

## 📊 Moduler

### 1. Kunder (207 i systemet)
- Kundeliste med søk/filter
- Kundedetaljer med faner: Reklamasjoner, Avtaler, Installasjoner
- Opprett/rediger kunde

### 2. CRM & Pipeline  
- Kanban-board med salgsstadier
- Leads, tilbud, vunnet/tapt
- Aktivitetslogg per lead

### 3. Stamdata (Admin)
- Leverandører
- Produktkategorier
- Avdelinger
- Systeminnstillinger

### 4. Brukeradministrasjon
- Brukerliste
- Inviter nye brukere
- Roller og tilganger

---

## 📄 Kundeliste

```typescript
// apps/nextjs/src/app/(dashboard)/customers/page.tsx
export default async function CustomersPage() {
  const customers = await api.customers.list()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kunder</h1>
        <Button><Plus /> Ny kunde</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th>Kundenr</th>
              <th>Navn</th>
              <th>By</th>
              <th>Reklamasjoner</th>
              <th>Avtaler</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td>{customer.customerNumber}</td>
                <td>{customer.name}</td>
                <td>{customer.city}</td>
                <td>{customer._count?.claims || 0}</td>
                <td>{customer._count?.agreements || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

## 👤 Brukeradministrasjon

```typescript
// apps/nextjs/src/app/(dashboard)/admin/users/page.tsx
export default async function UsersAdminPage() {
  const users = await api.users.list()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brukere</h1>
        <Button><UserPlus /> Inviter bruker</Button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>{user.firstName?.[0]}{user.lastName?.[0]}</Avatar>
              <div>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{user.role}</Badge>
              <Badge variant={user.isActive ? 'success' : 'error'}>
                {user.isActive ? 'Aktiv' : 'Inaktiv'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## ✅ Verifisering

1. Test kundeliste og detaljer
2. Test CRM pipeline (kanban)
3. Test stamdata-administrasjon
4. Test brukerinvitasjon

---

## 📦 Leveranse

- ✅ Kundemodul komplett
- ✅ CRM med kanban
- ✅ Stamdata-admin
- ✅ Brukeradministrasjon

---

## ➡️ Neste fase
[Fase 20: Kommunikasjon](./fase-20-kommunikasjon.md)
