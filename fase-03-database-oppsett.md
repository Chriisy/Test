# Fase 3: Database-oppsett (Replit PostgreSQL)

**Kategori:** FUNDAMENT
**Tid:** 1-2 timer
**Prioritet:** Kritisk
**Avhengigheter:** Fase 2 fullført

---

## Mål
Sette opp Replit PostgreSQL database og koble til prosjektet med Drizzle ORM.

---

## Hvorfor Replit PostgreSQL?

| Fordel | Beskrivelse |
|--------|-------------|
| Integrert | Database inkludert i Replit-plattformen |
| Enkel oppsett | Automatisk provisjonering |
| Samme miljø | Alt utviklingsverktøy på ett sted |
| Skalerbart | Oppgrader enkelt ved behov |

---

## Sjekkliste

### 3.1 Opprett Replit-konto

1. Gå til https://replit.com/
2. Klikk "Sign Up"
3. Logg inn med GitHub (anbefalt)
4. Velg "Core" plan for PostgreSQL-tilgang

---

### 3.2 Opprett nytt Repl

1. Klikk "Create Repl"
2. Velg "Node.js" som template
3. Gi det navn: `myhrvoldgruppen-portal`
4. Klikk "Create Repl"

---

### 3.3 Aktiver PostgreSQL

1. I Replit, klikk på "Tools" i sidepanelet
2. Velg "Database"
3. Klikk "Create a database"
4. Velg "PostgreSQL"
5. Vent mens databasen provisjoneres

Replit oppretter automatisk miljøvariabelen `DATABASE_URL`.

---

### 3.4 Hent database-URL

Miljøvariabelen er allerede satt i Replit. Du finner den under:

1. Klikk "Secrets" (låsikon) i sidepanelet
2. Se `DATABASE_URL` - den ser slik ut:
   ```
   postgresql://user:password@host:5432/database
   ```

For lokal utvikling, kopier denne til din `.env` fil.

---

### 3.5 Konfigurer for lokal utvikling

I prosjektmappen lokalt, opprett `.env` fil:

```bash
# I terminal
cd ~/myhrvoldgruppen/myhrvoldgruppen-portal

# Opprett .env fil
touch .env
```

Åpne `.env` og legg til:

```bash
# Database (kopier fra Replit Secrets)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Direct URL (samme som DATABASE_URL for Replit)
DIRECT_URL="postgresql://user:password@host:5432/database"
```

---

### 3.6 Oppdater packages/db konfigurasjon

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

### 3.7 Database-klient

Opprett `packages/db/src/client.ts`:

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

export const db = drizzle(pool, { schema });
```

---

### 3.8 Test database-tilkobling

```bash
# Push schema til database
pnpm db:push

# Skal vise:
# "Your database is now in sync with your schema"

# Åpne Drizzle Studio
pnpm db:studio

# Åpner http://local.drizzle.studio i nettleseren
```

---

### 3.9 Verifiser i Replit

1. Gå til Replit Dashboard
2. Åpne ditt prosjekt
3. Klikk "Database" i sidepanelet
4. Du skal se en tom database (ingen tabeller enda)

---

## Replit Database Verktøy

Replit inkluderer et database-grensesnitt:

1. Klikk "Database" i sidepanelet
2. Bla gjennom tabeller
3. Kjør SQL-spørringer direkte
4. Se data og skjema

---

## Vanlige problemer

### "Connection refused"
1. Sjekk at DATABASE_URL er korrekt kopiert fra Replit
2. Verifiser at databasen er aktiv i Replit
3. Sjekk nettverkstilgang

### "SSL required"
Legg til SSL-konfigurasjon i pool:
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
```

### "Password authentication failed"
1. Gå til Replit → Secrets
2. Kopier DATABASE_URL på nytt
3. Oppdater `.env` lokalt

### Drizzle Studio åpner ikke
```bash
# Kjør manuelt
npx drizzle-kit studio

# Eller sjekk at du er i riktig mappe
cd packages/db
npx drizzle-kit studio
```

---

## Fil-sjekkliste

Disse filene skal eksistere:
```
myhrvoldgruppen-portal/
├── .env                           # DATABASE_URL her
├── packages/
│   └── db/
│       ├── drizzle.config.ts      # Drizzle konfigurasjon
│       ├── src/
│       │   ├── index.ts           # Database eksport
│       │   ├── client.ts          # Database-klient
│       │   └── schema/
│       │       └── index.ts       # Schema eksport
│       └── package.json
```

---

## Verifisering

- [ ] Replit prosjekt opprettet
- [ ] PostgreSQL database aktivert
- [ ] DATABASE_URL lagret i Secrets
- [ ] DATABASE_URL kopiert til lokal `.env`
- [ ] `pnpm db:push` kjører uten feil
- [ ] `pnpm db:studio` åpner Drizzle Studio

---

## Leveranse

Når denne fasen er fullført har du:
- PostgreSQL database i Replit
- Database-tilkobling konfigurert
- Drizzle ORM konfigurert
- Drizzle Studio fungerer
- Klar til å opprette tabeller

---

## Sikkerhet

**VIKTIG:**
- `.env` filen skal ALDRI committes til Git
- Sjekk at `.gitignore` inneholder `.env`
- Bruk Replit Secrets for produksjonsmiljø
- Aldri del DATABASE_URL offentlig

```bash
# Sjekk .gitignore
cat .gitignore | grep env
# Skal vise: .env eller .env*
```

---

## Claude Code Prompt

```
Jeg har satt opp Replit PostgreSQL database for Myhrvoldgruppen.

Kan du:
1. Verifisere at drizzle.config.ts er korrekt
2. Sjekke at DATABASE_URL er i .env
3. Teste tilkobling med db:push

Ikke vis meg passord eller sensitive data.
```

---

## Neste fase
[Fase 4: CLAUDE.md konfigurasjon](./fase-04-claude-md-konfigurasjon.md)
