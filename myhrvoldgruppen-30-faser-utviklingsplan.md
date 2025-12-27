# 🚀 Myhrvoldgruppen Service Portal
## Komplett 30-Faser Utviklingsplan

**Basert på:** Gjennomgang av alle prosjektfiler, database-skjema, design-guide, eksisterende system screenshots, og teknisk dokumentasjon.

---

## 📊 Prosjektoversikt

### Eksisterende System (Replit)
Det nåværende systemet på myhrvoldgruppen.replit.app inneholder:
- 23 reklamasjonssaker
- 117 vedlikeholdsavtaler  
- 207 kunder
- 47 servicepartnere
- 7 utlånsmaskiner
- Team chat & forum
- Komplett admin-panel

### Mål
Bygge systemet på nytt med moderne 2025-stack som:
- ✅ Fungerer på Web (PC/Mac)
- ✅ Fungerer på iPad/Tablet
- ✅ iOS App (App Store)
- ✅ Android App (Google Play)
- ✅ Deler 80%+ kode mellom plattformer
- ✅ Er optimalisert for AI-assistert utvikling

### Brukergrupper
| Brukertype | Primær enhet | Hovedfunksjoner |
|------------|--------------|-----------------|
| Teknisk leder | PC + iPad | Full administrasjon, rapporter |
| Service leder | PC + iPad | Vedlikeholdsavtaler, planlegging |
| Service sjef | PC + iPad | Oversikt, KPI, beslutninger |
| Saksbehandler | PC | Reklamasjoner, kundeoppfølging |
| Tekniker | Mobil | Mine oppdrag, registrering i felt |

---

## 🎯 DE 30 FASENE

---

# FUNDAMENT (Fase 1-5)
*Uke 1-2: Sette opp grunnmuren*

---

## Fase 1: Utviklingsmiljø
**Tid:** 2-3 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Installer WSL2 på Windows PC
- [ ] Installer Ubuntu i WSL
- [ ] Installer Node.js 22 via fnm
- [ ] Installer pnpm pakkebehandler
- [ ] Installer Git
- [ ] Installer VS Code + WSL extension
- [ ] Installer Claude Code CLI
- [ ] Koble Claude Code til din Claude Pro-konto

### Verifisering
```bash
node --version    # v22.x.x
pnpm --version    # 9.x.x
git --version     # 2.x.x
claude --version  # Skal vise versjon
```

### Leveranse
✅ Fungerende utviklingsmiljø på Windows PC

---

## Fase 2: Prosjekt-initialisering
**Tid:** 1-2 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Opprett GitHub repository: `myhrvoldgruppen-portal`
- [ ] Klon create-t3-turbo template
- [ ] Konfigurer pnpm workspace
- [ ] Sett opp Turborepo
- [ ] Verifiser at `pnpm dev` starter uten feil

### Kommandoer
```bash
cd ~/projects
npx create-turbo@latest --example https://github.com/t3-oss/create-t3-turbo myhrvoldgruppen-portal
cd myhrvoldgruppen-portal
pnpm install
```

### Mappestruktur som opprettes
```
myhrvoldgruppen-portal/
├── apps/
│   ├── nextjs/          # Web-portal
│   └── expo/            # Mobil-app
├── packages/
│   ├── api/             # tRPC API
│   ├── auth/            # Autentisering
│   ├── db/              # Database (Drizzle)
│   ├── ui/              # Delte komponenter
│   └── validators/      # Zod-skjemaer
├── tooling/
│   ├── eslint/
│   ├── tailwind/
│   └── typescript/
├── turbo.json
└── pnpm-workspace.yaml
```

### Leveranse
✅ Fungerende monorepo med web og mobil apps

---

## Fase 3: Database-oppsett
**Tid:** 1-2 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Opprett Supabase-konto (gratis)
- [ ] Opprett nytt prosjekt: `myhrvoldgruppen`
- [ ] Velg region: **West EU (Frankfurt)** for GDPR
- [ ] Kopier database connection string
- [ ] Legg til i `.env` fil
- [ ] Test tilkobling

### Supabase Setup
1. Gå til https://supabase.com
2. "Start your project" → Logg inn med GitHub
3. "New Project" → Navn: `myhrvoldgruppen`
4. Velg sterkt passord (lagre dette!)
5. Region: **West EU (Frankfurt)**
6. Vent 2-3 min

### Environment Variables
```env
# .env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### Leveranse
✅ PostgreSQL database kjører i EU med tilkobling

---

## Fase 4: CLAUDE.md Konfigurasjon
**Tid:** 30 min | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Opprett CLAUDE.md i prosjektrot
- [ ] Definer prosjektkontekst
- [ ] Sett opp kodestandarder
- [ ] Definer vanlige kommandoer

### CLAUDE.md Innhold
```markdown
# Myhrvoldgruppen Service Portal

## Om prosjektet
Enterprise service portal for håndtering av:
- Reklamasjoner og garantisaker
- Installasjoner og montasje
- Vedlikeholdsavtaler (dagligvare + storkjøkken)
- Kundeadministrasjon
- Leverandørkommunikasjon
- Servicepartnere og teknikere
- Transportskader
- Utlånsmaskiner

## Brukergrupper
- **Ledere/Saksbehandlere**: Web-portal på PC og iPad
- **Teknikere**: Mobil-app i felt (iOS + Android)

## Tech Stack
- **Monorepo**: Turborepo + pnpm
- **Web**: Next.js 15 + React 19 + Tailwind CSS
- **Mobil**: Expo SDK 54 + Expo Router + NativeWind
- **API**: tRPC v11 (delt mellom web og mobil)
- **Database**: PostgreSQL (Supabase) + Drizzle ORM
- **Auth**: Better Auth (eller Clerk)

## Design System
- **Stil**: Nordic Professional
- **Primærfarge**: #0d9488 (teal-600)
- **Sekundær**: #f97316 (orange-500) for actions
- **Font**: Inter
- **Ikoner**: Lucide React

## Mappestruktur
- apps/nextjs/ → Web-portal
- apps/expo/ → Mobil-app
- packages/api/ → tRPC routers
- packages/db/ → Drizzle schema
- packages/ui/ → Delte komponenter

## Viktige Regler
1. All UI-tekst skal være på NORSK
2. Spør ALLTID før du endrer database-skjema
3. Bruk eksisterende komponent-stil
4. Teknikere har dårlig nett - optimaliser for offline
5. Følg eksisterende navnekonvensjoner

## Vanlige Kommandoer
- `pnpm dev` → Start alle apps
- `pnpm build` → Bygg for produksjon
- `pnpm db:push` → Push schema til database
- `pnpm db:studio` → Åpne Drizzle Studio
- `pnpm --filter nextjs dev` → Kun web
- `pnpm --filter expo dev` → Kun mobil

## Når du implementerer
1. Les først relevante filer uten å endre
2. Lag en plan og vis meg
3. Implementer steg for steg
4. Test at det fungerer
5. Commit med beskrivende melding
```

### Leveranse
✅ Claude Code forstår prosjektet og kan jobbe effektivt

---

## Fase 5: Git & Versjonskontroll
**Tid:** 30 min | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Initialiser Git repository
- [ ] Opprett .gitignore
- [ ] Koble til GitHub
- [ ] Første commit
- [ ] Sett opp branch-strategi

### Kommandoer
```bash
git init
git add .
git commit -m "Initial commit: T3 Turbo monorepo setup"
git remote add origin https://github.com/[DITT-BRUKERNAVN]/myhrvoldgruppen-portal.git
git push -u origin main
```

### Branch-strategi
```
main          → Produksjon (alltid stabil)
develop       → Utvikling (daglig arbeid)
feature/xyz   → Nye funksjoner
```

### Leveranse
✅ Prosjektet er under versjonskontroll på GitHub

---

# DATABASE (Fase 6-10)
*Uke 2-3: Bygge datamodellen*

---

## Fase 6: Kjerne-tabeller
**Tid:** 3-4 timer | **Prioritet:** 🔴 Kritisk

### Tabeller å opprette
1. **users** - Brukere i systemet
2. **customers** - Kunder (207 i eksisterende)
3. **suppliers** - Leverandører
4. **products** - Produkter

### Drizzle Schema (packages/db/src/schema/)

#### users.ts
```typescript
import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', [
  'admin', 'manager', 'coordinator', 'tech', 'sales', 'user'
])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: userRoleEnum('role').default('user').notNull(),
  phone: text('phone'),
  department: text('department'),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true).notNull(),
  isApproved: boolean('is_approved').default(false).notNull(),
  approvedBy: integer('approved_by'),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
```

### Leveranse
✅ Grunnleggende tabeller for brukere, kunder, leverandører, produkter

---

## Fase 7: Reklamasjons-tabeller
**Tid:** 3-4 timer | **Prioritet:** 🔴 Kritisk

### Tabeller å opprette
1. **claims** - Reklamasjonssaker (56 felt)
2. **claim_parts** - Deler på reklamasjoner
3. **claim_attachments** - Vedlegg/bilder
4. **claim_comments** - Kommentarer/logg

### Nøkkelfelt for claims
- Saksnummer (ELE-2512-0001 format)
- Status workflow: new → in_progress → pending_supplier → resolved → closed
- Prioritet: low, medium, high, urgent
- Garantistatus: in_warranty, out_of_warranty
- Leverandørsvar og kompensasjon
- Kostnadsestimater

### Leveranse
✅ Komplett reklamasjonsdatamodell

---

## Fase 8: Service-tabeller
**Tid:** 3-4 timer | **Prioritet:** 🟡 Høy

### Tabeller å opprette
1. **maintenance_agreements_retail** - Vedlikeholdsavtaler dagligvare
2. **maintenance_agreements_commercial** - Storkjøkkenavtaler (40+ felt)
3. **service_visits** - Planlagte servicebesøk
4. **service_reports** - Servicerapporter

### Nøkkelfelt for storkjøkkenavtaler
- Avtalenummer
- Kundeinfo + fakturaadresse
- Kontaktpersoner
- Priser (per år, timesats, sonesatser)
- Gyldighetsperiode
- Signatur

### Leveranse
✅ Vedlikeholdsavtaler og servicebesøk-struktur

---

## Fase 9: Øvrige tabeller
**Tid:** 3-4 timer | **Prioritet:** 🟡 Høy

### Tabeller å opprette
1. **installations** - Installasjonsprosjekter (35+ felt)
2. **transport_damages** - Transportskader (28 felt)
3. **loan_equipment** - Utlånsmaskiner
4. **service_partners** - Servicepartnere (47 i systemet)
5. **discussion_issues** - Saker/diskusjoner

### Leveranse
✅ Alle støttetabeller for full funksjonalitet

---

## Fase 10: Relasjoner & Indekser
**Tid:** 2-3 timer | **Prioritet:** 🟡 Høy

### Oppgaver
- [ ] Definer alle foreign keys
- [ ] Sett opp Drizzle relations
- [ ] Opprett indekser for ytelse
- [ ] Push komplett schema til Supabase
- [ ] Verifiser i Drizzle Studio

### Viktige relasjoner
```
claims → customers (customerId)
claims → products (productId)
claims → suppliers (supplierId)
claims → users (assignedUserId)
service_visits → maintenance_agreements
service_partners → users (coordinatorId)
```

### Kommandoer
```bash
pnpm db:push      # Push schema
pnpm db:studio    # Åpne GUI
```

### Leveranse
✅ Komplett, relasjonell database klar til bruk

---

# AUTENTISERING (Fase 11-12)
*Uke 3: Sikker pålogging*

---

## Fase 11: Auth-oppsett
**Tid:** 4-5 timer | **Prioritet:** 🔴 Kritisk

### Valg: Better Auth (anbefalt) eller Clerk

#### Better Auth (gratis, egen database)
- [ ] Installer Better Auth pakker
- [ ] Konfigurer med Drizzle adapter
- [ ] Sett opp session-håndtering
- [ ] Implementer login/logout

#### Clerk (enklest, $0-25/mnd)
- [ ] Opprett Clerk-konto
- [ ] Installer Clerk SDK
- [ ] Legg til ClerkProvider
- [ ] Implementer <SignIn /> komponenter

### Leveranse
✅ Brukere kan logge inn på web

---

## Fase 12: Auth på mobil
**Tid:** 3-4 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Sett opp secure token storage (expo-secure-store)
- [ ] Implementer login-skjerm i Expo
- [ ] Del auth-logikk via tRPC
- [ ] Test login på fysisk enhet

### Leveranse
✅ Samme brukere kan logge inn på web OG mobil

---

# WEB-PORTAL (Fase 13-20)
*Uke 4-6: Bygge hovedapplikasjonen*

---

## Fase 13: Layout & Navigasjon
**Tid:** 4-5 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Implementer sidebar-layout (mørk teal)
- [ ] Lag topbar med søk og brukerinfo
- [ ] Sett opp App Router struktur
- [ ] Implementer responsive design (PC/iPad)

### Sider å opprette
```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── page.tsx              # Dashboard
│   ├── layout.tsx            # Med sidebar
│   ├── reklamasjon/
│   ├── service/
│   ├── salg/
│   ├── montasje/
│   ├── admin/
│   └── kommunikasjon/
```

### Design (fra screenshots)
- Sidebar: bg-teal-900/950
- Aktiv meny: bg-teal-600
- Action buttons: bg-orange-500
- Stats cards: Fargekodet (grønn, gul, rød, blå)

### Leveranse
✅ Grunnleggende navigasjon og layout som matcher eksisterende design

---

## Fase 14: Dashboard
**Tid:** 4-5 timer | **Prioritet:** 🔴 Kritisk

### Komponenter
- [ ] Velkomst-banner med vaktuke-info
- [ ] Hurtighandlinger (Ny reklamasjon, Ny salgsmulighet, etc.)
- [ ] 6 stats-kort (Reklamasjoner, Avtaler, Installasjoner, etc.)
- [ ] Siste reklamasjoner-liste
- [ ] Kommende installasjoner
- [ ] HMS/SJA rapporter
- [ ] Reklamasjonsanalyse (grafer)

### Stats-kort layout
```
| Reklamasjoner | Vedlikeholdsavtaler | Installasjoner |
|     23        |        117          |       2        |

| HMS/SJA | Salg/CRM | Kontrakter | Utlånsmaskiner |
|    0    |    2     |     0      |       7        |
```

### Leveranse
✅ Komplett dashboard som i eksisterende system

---

## Fase 15: Reklamasjonsmodul - Liste
**Tid:** 5-6 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Implementer reklamasjonsliste med tRPC
- [ ] Status-tabs: Utkast (15), Venter (0), Godkjent (6), Avvist (2), Totalt (23)
- [ ] Søk og filter
- [ ] Sortering
- [ ] Status-badges med farger
- [ ] Leverandør-info
- [ ] Kostnadsoversikt

### tRPC Router
```typescript
// packages/api/src/routers/claims.ts
export const claimsRouter = router({
  list: publicProcedure
    .input(z.object({
      status: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      // Hent reklamasjoner med relasjoner
    }),
})
```

### Leveranse
✅ Søkbar, filtrerbar reklamasjonsliste

---

## Fase 16: Reklamasjonsmodul - Opprett/Rediger
**Tid:** 6-8 timer | **Prioritet:** 🔴 Kritisk

### Wizard-steg (fra screenshots)
1. **Kunde & Produkt** - Velg kunde, produkt, leverandør
2. **Deler & Kostnader** - Legg til deler, estimer kostnader
3. **Vedlegg** - Last opp bilder/dokumenter
4. **Garanti** - Garantistatus, leverandør SLA
5. **Oversikt** - Sammendrag før innsending

### Oppgaver
- [ ] Multi-step form med React Hook Form
- [ ] Zod-validering
- [ ] Kunde-søk med autocomplete
- [ ] Produkt-søk
- [ ] Filopplasting
- [ ] Garantiberegning

### Leveranse
✅ Komplett wizard for ny reklamasjon

---

## Fase 17: Reklamasjonsmodul - Detaljer
**Tid:** 4-5 timer | **Prioritet:** 🔴 Kritisk

### Komponenter
- [ ] Header med status og saksnummer
- [ ] Kundeinformasjon-kort
- [ ] Produktinformasjon-kort
- [ ] Problembeskrivelse
- [ ] Deler-liste
- [ ] Leverandørsvar-seksjon
- [ ] Aktivitetslogg/timeline
- [ ] Action-knapper (Send til leverandør, Godkjenn, Avvis)

### Leveranse
✅ Fullstendig saksvisning med alle handlinger

---

## Fase 18: Service-moduler
**Tid:** 8-10 timer | **Prioritet:** 🟡 Høy

### Undermoduler
1. **Vedlikeholdsavtaler - Dagligvare**
   - Kortvisning med status
   - Filter: Alle, Aktive, Service snart, Forfalt
   - Årskalender
   
2. **Vedlikeholdsavtaler - Storkjøkken**
   - Tabell med alle avtaler
   - Detalj-modal med tabs (Oversikt, Utstyr, Deler, Besøk, Vedlegg)
   
3. **Planlagte besøk**
   - Liste med planlagte/forfalt/utført
   - Servicerapport-modal
   
4. **Servicepartnere**
   - Kart over hele Norge (Leaflet)
   - Filter på fagområde (elektriker, kjøletekniker, etc.)
   - Finn nærmeste partner

### Leveranse
✅ Komplett service-modul med alle funksjoner

---

## Fase 19: Salg & Admin-moduler
**Tid:** 6-8 timer | **Prioritet:** 🟡 Høy

### Salg
- [ ] Kundeliste med søk
- [ ] Kundedetaljer (reklamasjoner, avtaler, utlån)
- [ ] CRM Pipeline (Kanban)
- [ ] Avtaler & Kontrakter

### Admin
- [ ] Stamdata (kunder, leverandører, produkter, deler)
- [ ] Brukeradministrasjon
- [ ] Tilgangslogg
- [ ] Varslingsinnstillinger

### Leveranse
✅ Salg og admin-funksjonalitet

---

## Fase 20: Kommunikasjon
**Tid:** 4-5 timer | **Prioritet:** 🟢 Medium

### Moduler
- [ ] Varslingsinnboks
- [ ] Team Chat (kanaler + DM)
- [ ] Team Forum (grupper)
- [ ] AI Dokumentsøk (valgfritt)

### Leveranse
✅ Intern kommunikasjon fungerer

---

# MOBIL-APP (Fase 21-25)
*Uke 7-8: Tekniker-appen*

---

## Fase 21: Expo Setup
**Tid:** 3-4 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Konfigurer Expo app.json
- [ ] Sett opp EAS Build
- [ ] Installer NativeWind (Tailwind for RN)
- [ ] Konfigurer Expo Router
- [ ] Test på fysisk enhet med Expo Go

### app.json
```json
{
  "expo": {
    "name": "Myhrvold Service",
    "slug": "myhrvold-service",
    "scheme": "myhrvold",
    "ios": {
      "bundleIdentifier": "no.myhrvold.service"
    },
    "android": {
      "package": "no.myhrvold.service"
    }
  }
}
```

### Leveranse
✅ Expo-app kjører på telefon

---

## Fase 22: Mobil - Navigasjon & Auth
**Tid:** 4-5 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Tab-navigasjon (Hjem, Oppdrag, Skann, Profil)
- [ ] Login-skjerm
- [ ] Secure token storage
- [ ] Automatisk login ved start

### Navigasjonsstruktur
```
app/
├── (tabs)/
│   ├── index.tsx      # Hjem/Dashboard
│   ├── tasks.tsx      # Mine oppdrag
│   ├── scan.tsx       # QR/Strekkode
│   └── profile.tsx    # Profil
├── claims/
│   ├── [id].tsx       # Reklamasjon detaljer
│   └── new.tsx        # Ny reklamasjon
├── _layout.tsx
└── login.tsx
```

### Leveranse
✅ Fungerende mobil-app med login

---

## Fase 23: Mobil - Mine Oppdrag
**Tid:** 5-6 timer | **Prioritet:** 🔴 Kritisk

### Funksjoner
- [ ] Liste over tildelte oppdrag
- [ ] Filter: Aktive / Arkiverte
- [ ] Pull-to-refresh
- [ ] Statusoppdatering
- [ ] Navigasjon til adresse (Maps)

### Oppgavstyper
- Installasjoner
- Servicebesøk
- Reklamasjoner
- Transportskader

### Leveranse
✅ Teknikere ser og håndterer sine oppdrag

---

## Fase 24: Mobil - Registrering i Felt
**Tid:** 6-8 timer | **Prioritet:** 🔴 Kritisk

### Funksjoner
- [ ] Ta bilder med kamera
- [ ] Registrer ny transportskade
- [ ] Fullfør servicerapport
- [ ] Digital signatur fra kunde
- [ ] GPS-posisjon

### Offline-støtte
- [ ] Lagre lokalt hvis ingen nettilgang
- [ ] Synkroniser når tilbake online
- [ ] Vis synkroniseringsstatus

### Leveranse
✅ Teknikere kan registrere arbeid ute i felt

---

## Fase 25: Mobil - Polering
**Tid:** 3-4 timer | **Prioritet:** 🟡 Høy

### Oppgaver
- [ ] Push notifications
- [ ] App-ikon og splash screen
- [ ] Loading states
- [ ] Error handling
- [ ] Haptic feedback
- [ ] Dark mode (valgfritt)

### Leveranse
✅ Profesjonell, polert mobil-app

---

# DEPLOYMENT (Fase 26-28)
*Uke 9: Lansering*

---

## Fase 26: Web Deployment
**Tid:** 2-3 timer | **Prioritet:** 🔴 Kritisk

### Oppgaver
- [ ] Koble GitHub repo til Vercel
- [ ] Konfigurer environment variables
- [ ] Sett opp custom domain (valgfritt)
- [ ] Test produksjonsbygg
- [ ] Verifiser alle funksjoner

### Vercel Setup
1. Gå til vercel.com
2. "Import Project" → Velg GitHub repo
3. Framework: Next.js (auto-detected)
4. Root Directory: `apps/nextjs`
5. Environment Variables: Legg til DATABASE_URL etc.
6. Deploy!

### Leveranse
✅ Web-portal live på internett

---

## Fase 27: iOS App Store
**Tid:** 4-6 timer + ventetid | **Prioritet:** 🔴 Kritisk

### Forutsetninger
- [ ] Apple Developer Program ($99/år)
- [ ] App Store Connect-konto

### Oppgaver
- [ ] Bygg med EAS: `eas build --platform ios`
- [ ] Opprett app i App Store Connect
- [ ] Last opp screenshots (6.7", 6.5", 5.5" iPhone, iPad)
- [ ] Skriv beskrivelse på norsk
- [ ] Sett aldersgrense
- [ ] Legg til privacy policy URL
- [ ] Submit for review

### Tidsestimat
- Apple review: 24-48 timer (oppdateringer), 1-7 dager (ny app)

### Leveranse
✅ iOS-app tilgjengelig i App Store

---

## Fase 28: Google Play Store
**Tid:** 3-4 timer + ventetid | **Prioritet:** 🔴 Kritisk

### Forutsetninger
- [ ] Google Play Developer-konto ($25 engangskostnad)

### Oppgaver
- [ ] Bygg med EAS: `eas build --platform android`
- [ ] Opprett app i Google Play Console
- [ ] Last opp screenshots
- [ ] Skriv beskrivelse
- [ ] Last opp 512x512 ikon + 1024x500 feature graphic
- [ ] Data safety form
- [ ] Submit for review

### Tidsestimat
- Google review: 1-3 dager

### Leveranse
✅ Android-app tilgjengelig i Google Play

---

# POLERING (Fase 29-30)
*Uke 10: Finish*

---

## Fase 29: Datamigrering
**Tid:** 4-6 timer | **Prioritet:** 🟡 Høy

### Oppgaver
- [ ] Eksporter data fra eksisterende Replit-system
- [ ] Transformer til ny database-struktur
- [ ] Importer kunder (207)
- [ ] Importer vedlikeholdsavtaler (117)
- [ ] Importer reklamasjoner (23)
- [ ] Importer servicepartnere (47)
- [ ] Verifiser dataintegritet

### Leveranse
✅ All eksisterende data migrert til nytt system

---

## Fase 30: Testing & Lansering
**Tid:** 4-6 timer | **Prioritet:** 🔴 Kritisk

### Testing
- [ ] Test alle brukerroller
- [ ] Test på PC, iPad, iPhone, Android
- [ ] Test offline-funksjonalitet
- [ ] Test varsler og notifikasjoner
- [ ] Brukerakseptansetest med ekte brukere

### Dokumentasjon
- [ ] Brukerveiledning (enkel)
- [ ] Admin-guide
- [ ] Tekniker-guide for mobil

### Lansering
- [ ] Informer brukere om nytt system
- [ ] Gradvis utrulling
- [ ] Support-periode

### Leveranse
✅ 🎉 PRODUKSJONSKLAR APPLIKASJON! 🎉

---

# 📅 TIDSPLAN OVERSIKT

| Uke | Faser | Fokusområde |
|-----|-------|-------------|
| 1 | 1-5 | Fundament: Miljø, prosjekt, database-oppsett |
| 2 | 6-10 | Database: Alle tabeller og relasjoner |
| 3 | 11-12 | Auth: Login for web og mobil |
| 4 | 13-15 | Web: Layout, dashboard, reklamasjonsliste |
| 5 | 16-17 | Web: Reklamasjon opprett/detaljer |
| 6 | 18-20 | Web: Service, salg, admin, kommunikasjon |
| 7 | 21-23 | Mobil: Setup, navigasjon, mine oppdrag |
| 8 | 24-25 | Mobil: Feltregistrering, polering |
| 9 | 26-28 | Deploy: Vercel, App Store, Google Play |
| 10 | 29-30 | Finish: Datamigrering, testing, lansering |

---

# 💰 KOSTNADSESTIMAT

### Engangskostnader
| Post | Kostnad |
|------|---------|
| Apple Developer Program | $99/år |
| Google Play Developer | $25 (engangskostnad) |
| **Sum engangskostnader** | **~$124** |

### Månedlige kostnader (etter lansering)
| Post | Kostnad |
|------|---------|
| Vercel Pro | $20/mnd |
| Supabase Pro | $25/mnd |
| Claude Max (valgfritt) | $100/mnd |
| **Sum per måned** | **$45-145/mnd** |

---

# 🎯 SUKSESSKRITERIER

### Teknisk
- [ ] < 2 sekunder loadtid på web
- [ ] Fungerer offline på mobil
- [ ] 99.9% uptime
- [ ] Alle enheter støttet (PC, iPad, iPhone, Android)

### Brukeropplevelse
- [ ] Alle kan logge inn uten problemer
- [ ] Teknikere forstår mobil-appen uten opplæring
- [ ] Saksbehandlere finner frem i web-portalen
- [ ] Data synkroniserer mellom enheter

### Business
- [ ] All eksisterende funksjonalitet bevart
- [ ] Raskere saksbehandling enn gammelt system
- [ ] Færre feil i dataregistrering
- [ ] Bedre oversikt for ledelsen

---

*Denne planen er basert på grundig gjennomgang av alle prosjektfiler, database-dokumentasjon, design-guide, og screenshots av eksisterende system.*

**Lykke til, Christopher! 🚀🇳🇴**
