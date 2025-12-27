# Fase 4: CLAUDE.md Konfigurasjon

**Kategori:** 🏗️ FUNDAMENT  
**Tid:** 30-45 minutter  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 2 fullført

---

## 🎯 Mål
Opprette CLAUDE.md fil som gir Claude Code full kontekst om prosjektet, slik at AI-assistert utvikling blir mest mulig effektiv.

---

## 📋 Sjekkliste

### 4.1 Opprett CLAUDE.md i prosjektroten

```bash
cd ~/myhrvoldgruppen/myhrvoldgruppen-portal
touch CLAUDE.md
```

### 4.2 Legg til innhold

Kopier dette innholdet til `CLAUDE.md`:

```markdown
# Myhrvoldgruppen Service Portal

## Prosjektbeskrivelse
Enterprise service portal for Myhrvoldgruppen AS - en norsk storkjøkken- og dagligvareleverandør.
Portalen håndterer reklamasjoner, serviceavtaler, installasjoner, kunder og leverandører.

## Teknologi-stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Backend:** tRPC v11, Drizzle ORM
- **Database:** PostgreSQL (Supabase, Frankfurt EU)
- **Mobil:** Expo SDK 54, React Native 0.81, NativeWind
- **Monorepo:** Turborepo, pnpm workspaces
- **Auth:** Clerk

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
```

## Database-tabeller (12 hovedtabeller, ~350 felt totalt)
- users (26 felt) - Brukere med roller
- customers (20 felt) - 207 kunder
- suppliers (24 felt) - Leverandører med SLA
- products (21 felt) - Produktkatalog
- claims (56 felt) - Reklamasjoner (hovedmodul)
- claim_parts (15 felt) - Deler til reklamasjoner
- installations (35+ felt) - Installasjonsprosjekter
- storkjokken_agreements (40+ felt) - Serviceavtaler storkjøkken
- transport_damages (28 felt) - Transportskader
- discussion_issues (28 felt) - Saker og diskusjoner
- service_partners (18 felt) - Servicepartnere med GPS
- service_visits (~20 felt) - Planlagte besøk

## Brukerroller
- admin - Full tilgang
- manager - Avdelingsleder
- coordinator - Koordinator
- technician - Tekniker (mobil-fokus)
- sales - Selger
- user - Standard bruker

## Design System - Nordic Professional
### Farger:
- Primary: #0d9488 (teal)
- Accent: #f97316 (orange)
- Background: #f8fafc
- Text: #0f172a

### Layout:
- Venstre sidebar (mørk teal, kollapsbar)
- Topbar med søk og brukerinfo
- Kort-basert innhold

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

## Eksisterende data (migreres fra Replit)
- 207 kunder
- 117 serviceavtaler
- 23 reklamasjoner
- 47 servicepartnere

## Viktig kontekst
- Myhrvoldgruppen er lokalisert i Norge
- Alle brukere er norske
- GDPR-compliance er viktig
- Database må være i EU (Frankfurt)
```

---

### 4.3 Opprett .claude/ mappe for custom commands (valgfritt)

```bash
mkdir -p .claude/commands
```

Opprett `.claude/commands/create-component.md`:
```markdown
# Create Component

Opprett en ny React-komponent i packages/ui/src/

Komponentnavn: $ARGUMENTS

1. Opprett filen med riktig struktur
2. Eksporter fra index.ts
3. Bruk shadcn/ui styling
4. Legg til TypeScript types
```

---

## 🔧 Hvorfor CLAUDE.md er viktig

CLAUDE.md gir Claude Code:
1. **Full prosjektkontekst** - Forstår hva vi bygger
2. **Teknologi-valg** - Vet hvilke verktøy vi bruker
3. **Database-struktur** - Kjenner alle tabeller og felt
4. **Design-regler** - Følger vårt design system
5. **Konvensjoner** - Bruker riktig navngivning

**Uten CLAUDE.md:** Claude må gjette og kan gjøre feil valg
**Med CLAUDE.md:** Claude vet eksakt hvordan prosjektet fungerer

---

## ✅ Verifisering

- [ ] `CLAUDE.md` opprettet i prosjektroten
- [ ] Inneholder all prosjektinformasjon
- [ ] `.claude/` mappe opprettet (valgfritt)

Test at Claude leser filen:
```bash
claude

# Si til Claude:
"Les CLAUDE.md filen og fortell meg hva du vet om dette prosjektet."
```

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ CLAUDE.md med full prosjektkontekst
- ✅ Database-struktur dokumentert
- ✅ Design system definert
- ✅ Konvensjoner etablert
- ✅ Claude Code forstår prosjektet

---

## ➡️ Neste fase
[Fase 5: Git versjonskontroll](./fase-05-git-versjonskontroll.md)
