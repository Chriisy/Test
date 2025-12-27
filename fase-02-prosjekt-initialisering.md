# Fase 2: Prosjekt-initialisering

**Kategori:** 🏗️ FUNDAMENT  
**Tid:** 1-2 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 1 fullført

---

## 🎯 Mål
Opprette monorepo-prosjektet med T3 Turbo-mal og sette opp GitHub repository.

---

## 📋 Sjekkliste

### 2.1 Opprett prosjektmappe

```bash
# Gå til hjemmemappe
cd ~

# Opprett prosjektmappe
mkdir myhrvoldgruppen
cd myhrvoldgruppen
```

---

### 2.2 Klon T3 Turbo

```bash
# Klon T3 Turbo malen
pnpm create t3-turbo@latest

# Når promptet kommer:
# ? What will your project be called? → myhrvoldgruppen-portal
# ? Will you be using Expo? → Yes
# ? Initialize a new git repository? → Yes
```

**Alternativt (manuelt):**
```bash
npx create-turbo@latest -e https://github.com/t3-oss/create-t3-turbo
```

---

### 2.3 Naviger inn i prosjektet

```bash
cd myhrvoldgruppen-portal

# Se strukturen
ls -la
```

Du skal se:
```
myhrvoldgruppen-portal/
├── apps/
│   ├── expo/          # Mobil-app
│   └── nextjs/        # Web-portal
├── packages/
│   ├── api/           # tRPC routers
│   ├── auth/          # Autentisering
│   ├── db/            # Drizzle schema
│   ├── ui/            # Delte komponenter
│   └── validators/    # Zod schemas
├── tooling/
│   ├── eslint/
│   ├── prettier/
│   ├── tailwind/
│   └── typescript/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

### 2.4 Installer avhengigheter

```bash
# Installer alle pakker
pnpm install

# Dette tar 2-5 minutter første gang
```

---

### 2.5 Opprett GitHub repository

1. Gå til https://github.com/new
2. Repository name: `myhrvoldgruppen-portal`
3. Description: `Enterprise Service Portal - Web + iOS + Android`
4. Velg: **Private**
5. IKKE huk av "Add README" (vi har allerede en)
6. Klikk "Create repository"

---

### 2.6 Koble til GitHub

```bash
# Legg til remote (bytt ut username)
git remote add origin git@github.com:DITT-BRUKERNAVN/myhrvoldgruppen-portal.git

# Sjekk at det fungerer
git remote -v

# Push til GitHub
git branch -M main
git push -u origin main
```

---

### 2.7 Åpne i VS Code

```bash
# Åpne prosjektet i VS Code
code .
```

**I VS Code:**
1. Trykk `Ctrl+Shift+P`
2. Skriv "WSL: Reopen in WSL"
3. Vent til VS Code kobler til

---

### 2.8 Test at alt fungerer

```bash
# Kjør development server
pnpm dev

# Dette starter:
# - Next.js på http://localhost:3000
# - Expo i terminalen
```

Åpne http://localhost:3000 i nettleseren. Du skal se T3 Turbo startside.

Trykk `Ctrl+C` for å stoppe.

---

## 📁 Mappestruktur forklart

```
myhrvoldgruppen-portal/
│
├── apps/                    # Kjørbare applikasjoner
│   ├── expo/                # 📱 Mobil-app (iOS/Android)
│   │   ├── app/             # Expo Router sider
│   │   ├── src/             # Komponenter
│   │   └── app.json         # Expo konfigurasjon
│   │
│   └── nextjs/              # 💻 Web-portal
│       ├── app/             # Next.js App Router
│       ├── src/             # Komponenter
│       └── next.config.js
│
├── packages/                # Delt kode (80%+ gjenbruk!)
│   ├── api/                 # tRPC routers
│   │   └── src/router/      # claims, customers, etc.
│   │
│   ├── auth/                # Clerk konfigurasjon
│   │
│   ├── db/                  # Database
│   │   └── src/schema/      # Drizzle tabeller
│   │
│   ├── ui/                  # shadcn/ui komponenter
│   │   └── src/             # Button, Card, Dialog, etc.
│   │
│   └── validators/          # Zod schemas
│       └── src/             # Delt validering
│
├── tooling/                 # Konfigurasjon
│   ├── eslint/              # Linting regler
│   ├── prettier/            # Formatering
│   ├── tailwind/            # Tailwind config
│   └── typescript/          # TypeScript config
│
├── pnpm-workspace.yaml      # Workspace konfig
├── turbo.json               # Turborepo konfig
└── package.json             # Root package
```

---

## 🔧 Viktige filer

### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

### turbo.json
```json
{
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "db:push": {},
    "db:studio": {}
  }
}
```

---

## 🔧 Vanlige problemer

### "ENOENT: no such file or directory"
```bash
# Slett node_modules og installer på nytt
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### "Port 3000 already in use"
```bash
# Finn prosessen som bruker porten
lsof -i :3000

# Drep prosessen
kill -9 <PID>
```

### Git push feiler
```bash
# Sjekk at SSH er riktig satt opp
ssh -T git@github.com

# Hvis det feiler, sjekk Fase 1 SSH-oppsett
```

---

## ✅ Verifisering

- [ ] `pnpm install` kjører uten feil
- [ ] `pnpm dev` starter uten feil
- [ ] http://localhost:3000 viser T3 startside
- [ ] GitHub repo er opprettet og koden er pushet
- [ ] VS Code åpner prosjektet via WSL

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ T3 Turbo monorepo opprettet
- ✅ Alle avhengigheter installert
- ✅ GitHub repository opprettet
- ✅ Kode pushet til GitHub
- ✅ Development server fungerer

---

## 🔧 Claude Code Prompt

```
Jeg har nå satt opp T3 Turbo monorepo for Myhrvoldgruppen Service Portal.

Kan du verifisere at prosjektstrukturen er korrekt?
Vis meg innholdet i package.json og pnpm-workspace.yaml.
```

---

## ➡️ Neste fase
[Fase 3: Database-oppsett](./fase-03-database-oppsett.md)
