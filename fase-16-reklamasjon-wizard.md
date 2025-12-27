# Fase 16: Reklamasjon Wizard (5 steg)

**Kategori:** 💻 WEB-PORTAL  
**Tid:** 6-8 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 15 fullført

---

## 🎯 Mål
Bygge en 5-stegs wizard for å opprette nye reklamasjoner med validering.

---

## 📊 Wizard-steg

### Steg 1: Kunde
- Søk/velg eksisterende kunde
- Eller opprett ny kunde
- Kontaktperson, telefon, e-post

### Steg 2: Produkt
- Søk/velg produkt
- Serienummer
- Kjøpsdato
- Installeringsdato

### Steg 3: Problem
- Beskrivelse av feil
- Feilkategori
- Bilder (opplasting)

### Steg 4: Leverandør
- Automatisk valgt basert på produkt
- Garanti-sjekk
- SLA-info

### Steg 5: Oppsummering
- Gjennomgang av alle felt
- Prioritet
- Tildel saksbehandler
- Bekreft og opprett

---

## 📄 Wizard-komponent

```typescript
// apps/nextjs/src/app/(dashboard)/claims/new/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import { StepIndicator } from './step-indicator'
import { CustomerStep } from './steps/customer-step'
import { ProductStep } from './steps/product-step'
import { ProblemStep } from './steps/problem-step'
import { SupplierStep } from './steps/supplier-step'
import { SummaryStep } from './steps/summary-step'

const steps = [
  { id: 1, title: 'Kunde' },
  { id: 2, title: 'Produkt' },
  { id: 3, title: 'Problem' },
  { id: 4, title: 'Leverandør' },
  { id: 5, title: 'Oppsummering' },
]

export default function NewClaimWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Steg 1: Kunde
    customerId: null as number | null,
    customerContactName: '',
    customerContactPhone: '',
    customerContactEmail: '',
    
    // Steg 2: Produkt
    productId: null as number | null,
    serialNumber: '',
    purchaseDate: null as Date | null,
    installationDate: null as Date | null,
    
    // Steg 3: Problem
    problemDescription: '',
    defectCategory: '',
    images: [] as File[],
    
    // Steg 4: Leverandør
    supplierId: null as number | null,
    warrantyStatus: 'in_warranty' as const,
    
    // Steg 5: Oppsummering
    priority: 'medium' as const,
    assignedUserId: null as number | null,
  })

  const createClaim = api.claims.create.useMutation({
    onSuccess: (claim) => {
      router.push(`/claims/${claim.id}`)
    },
  })

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = () => {
    createClaim.mutate(formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Ny reklamasjon</h1>
        <p className="text-gray-600">Fyll ut informasjonen steg for steg</p>
      </div>

      {/* Steg-indikator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Steg-innhold */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mt-6">
        {currentStep === 1 && (
          <CustomerStep 
            data={formData} 
            onChange={updateFormData}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <ProductStep 
            data={formData} 
            onChange={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 3 && (
          <ProblemStep 
            data={formData} 
            onChange={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 4 && (
          <SupplierStep 
            data={formData} 
            onChange={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 5 && (
          <SummaryStep 
            data={formData}
            onChange={updateFormData}
            onBack={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={createClaim.isPending}
          />
        )}
      </div>
    </div>
  )
}
```

### Kunde-steg med søk
```typescript
// apps/nextjs/src/app/(dashboard)/claims/new/steps/customer-step.tsx
'use client'
import { useState } from 'react'
import { api } from '@/trpc/react'
import { Input } from '@myhrvold/ui/input'
import { Button } from '@myhrvold/ui/button'
import { Search } from 'lucide-react'

export function CustomerStep({ data, onChange, onNext }) {
  const [search, setSearch] = useState('')
  
  const { data: customers, isLoading } = api.customers.search.useQuery(
    { query: search },
    { enabled: search.length > 2 }
  )

  const selectCustomer = (customer) => {
    onChange({
      customerId: customer.id,
      customerContactName: customer.contactPerson || '',
      customerContactPhone: customer.phone || '',
      customerContactEmail: customer.email || '',
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Velg kunde</h2>
      
      {/* Søkefelt */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Søk etter kunde..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Søkeresultater */}
      {customers && (
        <div className="border rounded-lg divide-y">
          {customers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => selectCustomer(customer)}
              className={`w-full p-4 text-left hover:bg-gray-50 ${
                data.customerId === customer.id ? 'bg-teal-50' : ''
              }`}
            >
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-gray-600">
                {customer.customerNumber} • {customer.city}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Kontaktinfo */}
      {data.customerId && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Kontaktperson</h3>
          <Input
            label="Navn"
            value={data.customerContactName}
            onChange={(e) => onChange({ customerContactName: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Telefon"
              value={data.customerContactPhone}
              onChange={(e) => onChange({ customerContactPhone: e.target.value })}
            />
            <Input
              label="E-post"
              type="email"
              value={data.customerContactEmail}
              onChange={(e) => onChange({ customerContactEmail: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Neste-knapp */}
      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={!data.customerId}>
          Neste: Produkt
        </Button>
      </div>
    </div>
  )
}
```

---

## 🔧 Validering med Zod

```typescript
// packages/validators/src/claim.ts
import { z } from 'zod'

export const createClaimSchema = z.object({
  customerId: z.number({ required_error: 'Velg en kunde' }),
  customerContactName: z.string().min(1, 'Navn er påkrevd'),
  customerContactPhone: z.string().optional(),
  customerContactEmail: z.string().email().optional(),
  
  productId: z.number().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.date().optional(),
  installationDate: z.date().optional(),
  
  problemDescription: z.string().min(10, 'Beskriv problemet (min 10 tegn)'),
  defectCategory: z.string().optional(),
  
  supplierId: z.number({ required_error: 'Velg leverandør' }),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assignedUserId: z.number().optional(),
})

export type CreateClaimInput = z.infer<typeof createClaimSchema>
```

---

## ✅ Verifisering

1. Gå til /claims/new
2. Gå gjennom alle 5 steg
3. Sjekk validering på hvert steg
4. Opprett en reklamasjon
5. Sjekk at den vises i listen

---

## 📦 Leveranse

- ✅ 5-stegs wizard
- ✅ Kundesøk
- ✅ Produktvalg
- ✅ Garanti-sjekk
- ✅ Oppsummering
- ✅ Zod-validering

---

## ➡️ Neste fase
[Fase 17: Reklamasjon detaljer](./fase-17-reklamasjon-detaljer.md)
