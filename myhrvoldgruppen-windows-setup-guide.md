# 🚀 Myhrvoldgruppen - Komplett Windows Oppsett Guide

## Din status ✅
- [x] GitHub-konto
- [x] Vercel-konto  
- [x] Claude Pro abonnement
- [ ] Apple Developer ($99/år) - kan vente til mobil-app er klar
- [ ] Google Play Developer ($25) - kan vente til mobil-app er klar

---

## DEL 1: Installer WSL (Windows Subsystem for Linux)
**Tid: ~15 minutter**

WSL lar deg kjøre Linux inne i Windows - dette er standarden for moderne webutvikling.

### Steg 1.1: Åpne PowerShell som Administrator
1. Trykk `Windows-tasten`
2. Skriv `PowerShell`
3. Høyreklikk på "Windows PowerShell"
4. Velg **"Kjør som administrator"**

### Steg 1.2: Installer WSL
Kopier og lim inn denne kommandoen:
```powershell
wsl --install
```

⏳ **Vent** - dette tar 5-10 minutter og laster ned Ubuntu.

### Steg 1.3: Start PC-en på nytt
Når installasjonen er ferdig, **restart PC-en**.

### Steg 1.4: Sett opp Ubuntu
Etter restart åpnes Ubuntu automatisk. Hvis ikke:
1. Trykk `Windows-tasten`
2. Skriv `Ubuntu`
3. Klikk på Ubuntu-appen

Du blir bedt om å lage bruker:
- **Skriv et brukernavn** (f.eks. `christopher`) - trykk Enter
- **Skriv et passord** - trykk Enter (du ser ikke tegnene, det er normalt!)
- **Bekreft passordet** - trykk Enter

✅ **Ferdig!** Du ser nå en Linux-terminal.

---

## DEL 2: Installer utviklerverktøy
**Tid: ~20 minutter**

Alle disse kommandoene kjøres i Ubuntu-terminalen.

### Steg 2.1: Oppdater Ubuntu
```bash
sudo apt update && sudo apt upgrade -y
```
Skriv passordet ditt hvis den spør (du ser ikke tegnene).

### Steg 2.2: Installer Git
```bash
sudo apt install git -y
```

### Steg 2.3: Konfigurer Git med din GitHub-konto
```bash
git config --global user.name "DITT NAVN HER"
git config --global user.email "din-email@example.com"
```
⚠️ **Bytt ut** med ditt faktiske navn og GitHub-email!

### Steg 2.4: Installer fnm (Node.js version manager)
```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

Lukk og åpne Ubuntu på nytt, eller kjør:
```bash
source ~/.bashrc
```

### Steg 2.5: Installer Node.js
```bash
fnm install 22
fnm use 22
fnm default 22
```

### Steg 2.6: Installer pnpm
```bash
npm install -g pnpm
```

### Steg 2.7: Verifiser at alt fungerer
```bash
node --version
pnpm --version
git --version
```

Du skal se versjonsnumre (f.eks. `v22.x.x`, `9.x.x`, `2.x.x`).

✅ **Gratulerer!** Utviklerverktøyene er klare.

---

## DEL 3: Installer VS Code
**Tid: ~10 minutter**

VS Code er editoren hvor du ser og redigerer kode.

### Steg 3.1: Last ned VS Code
1. Gå til: https://code.visualstudio.com/
2. Klikk **"Download for Windows"**
3. Kjør installasjonsfilen
4. ✅ Huk av "Add to PATH" under installasjonen

### Steg 3.2: Installer WSL-utvidelsen
1. Åpne VS Code
2. Trykk `Ctrl+Shift+X` (åpner Extensions)
3. Søk etter **"WSL"**
4. Klikk **"Install"** på "WSL" fra Microsoft

### Steg 3.3: Test at VS Code kobler til WSL
I Ubuntu-terminalen, skriv:
```bash
code .
```
VS Code skal åpne seg og vise "WSL: Ubuntu" nederst til venstre.

✅ **VS Code er klar!**

---

## DEL 4: Installer Claude Code
**Tid: ~5 minutter**

Claude Code er AI-assistenten som bygger koden for deg.

### Steg 4.1: Installer Claude Code
I Ubuntu-terminalen:
```bash
npm install -g @anthropic-ai/claude-code
```

### Steg 4.2: Koble til Claude-kontoen din
```bash
claude
```
- Trykk Enter for å åpne nettleseren
- Logg inn med din Claude Pro-konto
- Godkjenn tilkoblingen

### Steg 4.3: Verifiser
```bash
claude --version
```

✅ **Claude Code er klar!**

---

## DEL 5: Klon starter-prosjektet
**Tid: ~15 minutter**

Nå henter vi create-t3-turbo som gir deg hele grunnstrukturen.

### Steg 5.1: Lag en prosjektmappe
```bash
cd ~
mkdir projects
cd projects
```

### Steg 5.2: Klon T3 Turbo-templaten
```bash
npx create-turbo@latest --example https://github.com/t3-oss/create-t3-turbo myhrvoldgruppen-portal
```

Svar på spørsmålene:
- Package manager: Velg `pnpm`
- Eventuelle andre spørsmål: Trykk Enter for standard

### Steg 5.3: Gå inn i prosjektmappen
```bash
cd myhrvoldgruppen-portal
```

### Steg 5.4: Installer avhengigheter
```bash
pnpm install
```
⏳ Dette tar 2-5 minutter.

### Steg 5.5: Åpne i VS Code
```bash
code .
```

✅ **Du har nå et komplett monorepo-prosjekt!**

---

## DEL 6: Sett opp Supabase (database)
**Tid: ~10 minutter**

### Steg 6.1: Opprett Supabase-konto
1. Gå til: https://supabase.com/
2. Klikk **"Start your project"**
3. Logg inn med GitHub

### Steg 6.2: Opprett nytt prosjekt
1. Klikk **"New Project"**
2. Gi det navn: `myhrvoldgruppen`
3. Sett et sterkt passord (lagre dette!)
4. Velg region: **"West EU (Frankfurt)"** ← VIKTIG for GDPR!
5. Klikk **"Create new project"**

⏳ Vent 2-3 minutter mens databasen opprettes.

### Steg 6.3: Hent database-URL
1. Gå til **Settings → Database**
2. Scroll ned til **"Connection string"**
3. Velg **"URI"**
4. Kopier hele strengen (starter med `postgresql://...`)

### Steg 6.4: Legg til i prosjektet
I VS Code, åpne filen `.env` (eller lag den hvis den ikke finnes).

Legg til:
```
DATABASE_URL="postgresql://postgres:[DITT-PASSORD]@db.[PROSJEKT-REF].supabase.co:5432/postgres"
```
⚠️ Bytt ut med din faktiske connection string!

✅ **Database er klar!**

---

## DEL 7: Første test!
**Tid: ~5 minutter**

### Steg 7.1: Push database-skjema
```bash
pnpm db:push
```

### Steg 7.2: Start utviklingsserveren
```bash
pnpm dev
```

### Steg 7.3: Åpne i nettleseren
- Web-app: http://localhost:3000
- (Eventuelt expo mobil vises med QR-kode)

🎉 **GRATULERER! Du har et fungerende prosjekt!**

---

## DEL 8: Lag CLAUDE.md filen
**Tid: ~5 minutter**

Denne filen forteller Claude Code om prosjektet ditt.

### Lag filen `CLAUDE.md` i prosjektets rotmappe:

```markdown
# Myhrvoldgruppen Service Portal

## Om prosjektet
Enterprise service portal for Myhrvoldgruppen AS.
Håndterer reklamasjoner, installasjoner, kunder, leverandører og serviceavtaler.

## Brukergrupper
- **Saksbehandlere/Ledere**: Bruker web-portalen på PC og iPad
- **Teknikere**: Bruker mobil-appen i felt

## Teknisk stack
- Monorepo med Turborepo + pnpm
- Web: Next.js 15 + React 19 + Tailwind CSS + shadcn/ui
- Mobil: Expo SDK 54 + Expo Router + NativeWind
- API: tRPC v11 (delt mellom web og mobil)
- Database: PostgreSQL (Supabase) + Drizzle ORM
- Auth: Better Auth

## Mappestruktur
- apps/nextjs/ - Web-portal (Next.js)
- apps/expo/ - Mobil-app (Expo)
- packages/api/ - Delt tRPC API
- packages/db/ - Database-skjema (Drizzle)
- packages/ui/ - Delte UI-komponenter
- packages/validators/ - Delte Zod-skjemaer

## Design
- "Nordic Professional" - skandinavisk blå/grå palett
- Primærfarge: #2563eb
- Font: Inter
- Minimalistisk og data-fokusert

## Viktige regler
- All UI-tekst skal støtte norsk
- Spør FØR du endrer database-skjema
- Teknikere kan ha dårlig nettforbindelse - optimaliser for offline
- Følg eksisterende kode-stil i prosjektet

## Vanlige kommandoer
- `pnpm dev` - Start alle apper
- `pnpm build` - Bygg for produksjon
- `pnpm db:push` - Oppdater database-skjema
- `pnpm db:studio` - Åpne database GUI
- `pnpm --filter nextjs dev` - Kun web-app
- `pnpm --filter expo dev` - Kun mobil-app
```

---

## DEL 9: Start å bygge med Claude Code!
**Tid: Fra nå av 😊**

### Steg 9.1: Start Claude Code
```bash
claude
```

### Steg 9.2: La Claude lese prosjektet først
Skriv i Claude Code:
```
Les gjennom hele prosjektstrukturen og gi meg en oppsummering av hva som finnes. Ikke gjør noen endringer ennå.
```

### Steg 9.3: Be om en plan før du bygger
Eksempel:
```
Jeg vil lage et reklamasjonssystem. Saksbehandlere skal kunne:
- Se liste over alle reklamasjoner
- Opprette nye reklamasjoner
- Se detaljer og status på hver sak
- Tilordne saker til teknikere

Lag en plan for hvordan vi implementerer dette. Ikke skriv kode ennå, bare forklar hva som trengs.
```

### Steg 9.4: Godkjenn planen, så implementer
Når du er fornøyd med planen:
```
OK, dette høres bra ut. Implementer steg 1 - database-skjemaet for reklamasjoner.
```

---

## 📋 Quick Reference - Kommandoer du bruker ofte

| Hva | Kommando |
|-----|----------|
| Start Ubuntu | Søk "Ubuntu" i Windows |
| Gå til prosjektet | `cd ~/projects/myhrvoldgruppen-portal` |
| Åpne VS Code | `code .` |
| Start Claude Code | `claude` |
| Start utviklingsserver | `pnpm dev` |
| Stopp serveren | `Ctrl+C` |
| Se database | `pnpm db:studio` |
| Lagre endringer til Git | `git add . && git commit -m "beskrivelse"` |
| Push til GitHub | `git push` |

---

## 🆘 Vanlige problemer og løsninger

### "command not found: pnpm"
```bash
source ~/.bashrc
```

### "permission denied"
Legg til `sudo` foran kommandoen.

### VS Code åpner ikke fra terminal
Lukk VS Code helt og prøv igjen.

### Database-feil
Sjekk at `.env` filen har riktig DATABASE_URL.

---

## Neste steg etter oppsett

1. ✅ Sette opp utviklingsmiljø (denne guiden)
2. ⬜ Tilpasse database-skjema for Myhrvoldgruppen
3. ⬜ Bygge reklamasjonssystemet
4. ⬜ Bygge kundeadministrasjon
5. ⬜ Bygge mobil-app for teknikere
6. ⬜ Sette opp autentisering
7. ⬜ Deploy til Vercel
8. ⬜ Publisere til App Store / Google Play

---

*Lykke til! 🇳🇴 Du er nå klar til å bygge Myhrvoldgruppen Service Portal!*
