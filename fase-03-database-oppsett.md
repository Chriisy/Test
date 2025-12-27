# Fase 3: Database-oppsett

**Kategori:** 🏗️ FUNDAMENT  
**Tid:** 1-2 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 2 fullført

---

## 🎯 Mål
Sette opp Supabase PostgreSQL database i EU (Frankfurt) og koble til prosjektet.

---

## 📋 Sjekkliste

### 3.1 Opprett Supabase-konto

1. Gå til https://supabase.com/
2. Klikk "Start your project"
3. Logg inn med GitHub (anbefalt)
4. Godkjenn tilgang

---

### 3.2 Opprett nytt prosjekt

1. Klikk "New project"
2. Velg organisasjon (eller opprett ny)
3. Fyll inn:
   - **Name:** `myhrvoldgruppen-portal`
   - **Database Password:** Generer sterkt passord (LAGRE DETTE!)
   - **Region:** `eu-central-1 (Frankfurt)` ← VIKTIG for GDPR!
   - **Plan:** Free tier (eller Pro $25/mnd)

4. Klikk "Create new project"
5. Vent 2-3 minutter mens databasen opprettes

---

### 3.3 Hent database-URL

1. Gå til Project Settings → Database
2. Finn "Connection string" seksjonen
3. Velg "URI" format
4. Kopier URLen (ser slik ut):
   ```
   postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```

**VIKTIG:** Bytt ut `[password]` med ditt faktiske passord!

---

### 3.4 Konfigurer miljøvariabler

I prosjektmappen, opprett `.env` fil:

```bash
# I WSL terminal
cd ~/myhrvoldgruppen/myhrvoldgruppen-portal

# Opprett .env fil
touch .env
```

Åpne `.env` i VS Code og legg til:

```bash
# Database
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Direct URL (for migrasjoner)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

**Bytt ut:**
- `[ref]` med din prosjekt-referanse (f.eks. `abcd1234`)
- `[password]` med ditt database-passord

---

### 3.5 Oppdater packages/db konfigurasjon

Åpne `packages/db/drizzle.config.ts`:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["myhrvold_*"],
} satisfies Config;
```

---

### 3.6 Test database-tilkobling

```bash
# Push schema til database (selv om den er tom)
pnpm db:push

# Skal vise:
# "Your database is now in sync with your schema"

# Åpne Drizzle Studio
pnpm db:studio

# Åpner http://local.drizzle.studio i nettleseren
```

---

### 3.7 Verifiser i Supabase Dashboard

1. Gå til Supabase Dashboard
2. Velg ditt prosjekt
3. Klikk "Table Editor" i sidemenyen
4. Du skal se en tom database (ingen tabeller enda)

---

## 🔧 Supabase-innstillinger

### Aktiver Row Level Security (RLS) senere
Vi konfigurerer RLS i Fase 10, men det er godt å vite at Supabase bruker dette for sikkerhet.

### Pooler vs Direct connection
- **Pooler** (port 5432): For applikasjonen, håndterer mange tilkoblinger
- **Direct** (port 5432): For migrasjoner og Drizzle Studio

---

## 🔧 Vanlige problemer

### "Connection refused"
1. Sjekk at DATABASE_URL er riktig
2. Sjekk at passord ikke inneholder spesialtegn som må escapes
3. Prøv å bruke Session pooler i stedet

### "Password authentication failed"
1. Gå til Supabase → Settings → Database
2. Klikk "Reset database password"
3. Oppdater `.env` med nytt passord

### "SSL required"
Legg til `?sslmode=require` på slutten av DATABASE_URL:
```
postgresql://...@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require
```

### Drizzle Studio åpner ikke
```bash
# Kjør manuelt
npx drizzle-kit studio

# Eller sjekk at du er i riktig mappe
cd packages/db
npx drizzle-kit studio
```

---

## 📁 Fil-sjekkliste

Disse filene skal eksistere:
```
myhrvoldgruppen-portal/
├── .env                           # DATABASE_URL her
├── packages/
│   └── db/
│       ├── drizzle.config.ts      # Drizzle konfigurasjon
│       ├── src/
│       │   ├── index.ts           # Database eksport
│       │   └── schema/
│       │       └── index.ts       # Schema eksport
│       └── package.json
```

---

## ✅ Verifisering

- [ ] Supabase prosjekt opprettet i `eu-central-1 (Frankfurt)`
- [ ] DATABASE_URL lagret i `.env`
- [ ] `pnpm db:push` kjører uten feil
- [ ] `pnpm db:studio` åpner Drizzle Studio
- [ ] Supabase Dashboard viser prosjektet

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ Supabase PostgreSQL database i Frankfurt (EU)
- ✅ Database-tilkobling konfigurert
- ✅ Drizzle ORM konfigurert
- ✅ Drizzle Studio fungerer
- ✅ Klar til å opprette tabeller

---

## 🔒 Sikkerhet

**VIKTIG:**
- `.env` filen skal ALDRI committes til Git
- Sjekk at `.gitignore` inneholder `.env`
- Database-passordet skal være sterkt (16+ tegn)
- Bruk Frankfurt region for GDPR-compliance

```bash
# Sjekk .gitignore
cat .gitignore | grep env
# Skal vise: .env eller .env*
```

---

## 🔧 Claude Code Prompt

```
Jeg har satt opp Supabase database for Myhrvoldgruppen.

Kan du:
1. Verifisere at drizzle.config.ts er korrekt
2. Sjekke at DATABASE_URL er i .env
3. Teste tilkobling med db:push

Ikke vis meg passord eller sensitive data.
```

---

## ➡️ Neste fase
[Fase 4: CLAUDE.md konfigurasjon](./fase-04-claude-md-konfigurasjon.md)
