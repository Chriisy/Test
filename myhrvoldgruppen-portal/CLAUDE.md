# Myhrvoldgruppen Service Portal

## Prosjektbeskrivelse
Enterprise service portal for Myhrvoldgruppen AS - en norsk storkjøkken- og dagligvareleverandør.
Portalen håndterer reklamasjoner, serviceavtaler, installasjoner, kunder og leverandører.

## Teknologi-stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Backend:** tRPC v11, Drizzle ORM
- **Database:** PostgreSQL (Replit)
- **Mobil:** Expo SDK 52, React Native, NativeWind
- **Monorepo:** Turborepo, pnpm workspaces
- **Auth:** Replit Auth (web), Token-basert (mobil)
- **Hosting:** Replit (dev) + Vercel (prod)

## Mappestruktur
```
apps/
├── nextjs/          # Web-portal (PC + iPad)
└── expo/            # Mobil-app (iOS + Android)

packages/
├── api/             # tRPC routers
├── db/              # Drizzle schema
├── ui/              # Delte komponenter
└── validators/      # Zod schemas

tooling/
├── eslint/          # Linting config
├── prettier/        # Formatering
├── tailwind/        # Tailwind config
└── typescript/      # TypeScript config
```

## Database-tabeller (13 hovedtabeller, ~350 felt totalt)
- users (26 felt) - Brukere med roller og Replit-integrasjon
- customers (20 felt) - 207 kunder med Visma-ID
- suppliers (24 felt) - Leverandører med SLA og garanti
- products (21 felt) - Produktkatalog med specs
- claims (56 felt) - Reklamasjoner (hovedmodul)
- claim_parts (15 felt) - Deler til reklamasjoner
- installations (35+ felt) - Installasjonsprosjekter
- storkjokken_agreements (40+ felt) - Serviceavtaler storkjøkken
- transport_damages (28 felt) - Transportskader med GPS
- discussion_issues (28 felt) - Saker og diskusjoner
- service_partners (18 felt) - Servicepartnere med kart
- service_visits (~20 felt) - Planlagte besøk
- api_tokens - Mobil-autentisering

## Brukerroller
- admin - Full tilgang
- manager - Avdelingsleder
- coordinator - Koordinator
- technician - Tekniker (mobil-fokus)
- sales - Selger
- partner - Ekstern servicepartner
- user - Standard bruker

## Design System - Nordic Professional

### Farger:
```css
--primary-teal: #0d9488
--primary-teal-dark: #0f766e
--accent-orange: #f97316
--accent-orange-dark: #ea580c
--background: #f8fafc
--text: #0f172a
```

### Layout:
- Venstre sidebar (mørk teal, kollapsbar)
- Topbar med søk og brukerinfo
- Kort-basert innhold
- Responsivt (PC, tablet, mobil)

## Reklamasjonsnummerering
Format: [LEVERANDØR]-[ÅRMND]-[NUMMER]
Eksempel: UBE-2512-0001 (Ubert, desember 2025, sak #1)

## Status-workflow for reklamasjoner
draft → new → in_progress → pending_supplier → resolved → closed

## Viktige konvensjoner
- Språk: Norsk i UI, engelsk i kode
- Datoformat: dd.mm.yyyy (norsk)
- Valuta: NOK
- Tidssone: Europe/Oslo
- Tabellprefix: myhrvold_

## Kommandoer
```bash
pnpm dev          # Start utvikling
pnpm build        # Bygg for produksjon
pnpm db:push      # Push schema til database
pnpm db:studio    # Åpne Drizzle Studio
pnpm lint         # Kjør linting
pnpm typecheck    # Sjekk TypeScript
```

## Kodestandard
- Bruk TypeScript strict mode
- Komponenter i PascalCase
- Funksjoner i camelCase
- Filer i kebab-case
- Zod for all validering
- Unngå `any` type
- Prefer `const` over `let`

## Eksisterende data (migreres)
- 207 kunder
- 117 serviceavtaler
- 23 reklamasjoner
- 47 servicepartnere

## Viktig kontekst
- Myhrvoldgruppen er lokalisert i Norge
- Alle brukere er norske
- GDPR-compliance er viktig
- Bruker Replit for utvikling og database
- Vercel for produksjons-hosting

## Auth-strategi
### Web (Next.js):
- Replit Auth via X-Replit-User headers
- Middleware for beskyttede ruter

### Mobil (Expo):
- Token-basert autentisering
- SecureStore for token-lagring
- Genereres fra web-portal
