# Fase 5: Git Versjonskontroll

**Kategori:** 🏗️ FUNDAMENT  
**Tid:** 30 minutter  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 2 fullført

---

## 🎯 Mål
Etablere god Git-praksis med branch-strategi, commit-konvensjoner og .gitignore for sikker utvikling.

---

## 📋 Sjekkliste

### 5.1 Verifiser .gitignore

Åpne `.gitignore` og sørg for at disse er med:

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Environment
.env
.env.local
.env.*.local

# Build
.next/
.turbo/
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Expo
.expo/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*

# Testing
coverage/

# Database
*.db
*.sqlite

# Logs
*.log
npm-debug.log*
```

---

### 5.2 Opprett branch-struktur

```bash
# Opprett develop branch
git checkout -b develop

# Push til GitHub
git push -u origin develop

# Gå tilbake til main
git checkout main
```

**Branch-strategi:**
```
main        ← Produksjon (alltid stabil)
  └── develop    ← Utvikling (aktiv)
        ├── feature/claims-list     ← Nye features
        ├── feature/mobile-nav
        └── fix/login-bug           ← Bugfikser
```

---

### 5.3 Sett opp commit-konvensjoner

Vi bruker **Conventional Commits**:

```
<type>(<scope>): <beskrivelse>

Typer:
- feat:     Ny funksjonalitet
- fix:      Bugfiks
- docs:     Dokumentasjon
- style:    Formatering (ikke kode)
- refactor: Kodeendring uten ny funksjon
- test:     Testing
- chore:    Vedlikehold

Eksempler:
feat(claims): add claim list component
fix(auth): resolve login redirect issue
docs(readme): update installation steps
chore(deps): upgrade drizzle to v0.44
```

---

### 5.4 Opprett feature branch eksempel

```bash
# Sørg for at du er på develop
git checkout develop

# Opprett ny feature branch
git checkout -b feature/database-schema

# Gjør endringer...
# git add .
# git commit -m "feat(db): add users table schema"

# Push feature branch
git push -u origin feature/database-schema
```

---

### 5.5 Konfigurer Git-aliaser (valgfritt)

```bash
# Nyttige aliaser
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
```

Nå kan du bruke:
```bash
git co develop      # checkout develop
git st              # status
git lg              # visuell log
```

---

## 🔄 Workflow

### Daglig utvikling:
```bash
# 1. Start fra develop
git checkout develop
git pull origin develop

# 2. Opprett feature branch
git checkout -b feature/mitt-arbeid

# 3. Gjør endringer
# ... kode ...

# 4. Commit ofte
git add .
git commit -m "feat(module): beskrivelse"

# 5. Push til GitHub
git push -u origin feature/mitt-arbeid

# 6. Lag Pull Request på GitHub
# 7. Merge til develop etter review
```

### Når feature er ferdig:
```bash
# 1. Oppdater develop
git checkout develop
git pull origin develop

# 2. Merge feature (via GitHub PR eller lokalt)
git merge feature/mitt-arbeid

# 3. Slett feature branch
git branch -d feature/mitt-arbeid
git push origin --delete feature/mitt-arbeid
```

---

## 🔧 GitHub-innstillinger (anbefalt)

På GitHub, gå til **Settings → Branches**:

1. **Add branch protection rule** for `main`:
   - [x] Require pull request reviews
   - [x] Require status checks to pass
   - [x] Include administrators

2. **Add branch protection rule** for `develop`:
   - [x] Require pull request reviews (optional)

---

## ✅ Verifisering

```bash
# Sjekk branches
git branch -a
# Skal vise: main, develop

# Sjekk .gitignore fungerer
git status
# .env skal IKKE vises

# Sjekk remote
git remote -v
# Skal vise: origin git@github.com:...
```

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ .gitignore konfigurert korrekt
- ✅ main og develop branches opprettet
- ✅ Branch-strategi etablert
- ✅ Commit-konvensjoner definert
- ✅ Klar for team-utvikling

---

## 🔒 Sikkerhet

**ALDRI commit:**
- `.env` filer
- API-nøkler
- Database-passord
- Private nøkler

**Sjekk alltid før push:**
```bash
# Se hva som vil bli pushet
git diff --cached

# Sjekk status
git status
```

---

## ➡️ Neste fase
[Fase 6: Kjerne-tabeller](./fase-06-kjerne-tabeller.md)

---

## 🎉 Fundament fullført!

Du har nå:
- ✅ WSL2 + Node.js + pnpm
- ✅ T3 Turbo monorepo
- ✅ Supabase database (Frankfurt)
- ✅ CLAUDE.md for AI-assistanse
- ✅ Git med branch-strategi

**Neste: Database-design!** 🗄️
