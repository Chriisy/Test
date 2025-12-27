# Fase 1: Utviklingsmiljø

**Kategori:** 🏗️ FUNDAMENT  
**Tid:** 2-3 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Ingen - dette er første steg!

---

## 🎯 Mål
Sette opp Windows-maskinen din med alle verktøy som trengs for utvikling av Myhrvoldgruppen Service Portal.

---

## 📋 Sjekkliste

### 1.1 Installer WSL2 (Windows Subsystem for Linux)

- [ ] Åpne PowerShell som Administrator
- [ ] Kjør: `wsl --install`
- [ ] Start PC-en på nytt
- [ ] Åpne Ubuntu fra Start-menyen
- [ ] Lag brukernavn og passord (husk dette!)

**Verifiser:**
```bash
wsl --version
```
Skal vise: `WSL version: 2.x.x`

---

### 1.2 Installer Node.js 22 LTS

I Ubuntu/WSL, kjør:
```bash
# Installer nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Last inn nvm (lukk og åpne terminal på nytt, eller kjør:)
source ~/.bashrc

# Installer Node.js 22
nvm install 22
nvm use 22
nvm alias default 22
```

**Verifiser:**
```bash
node --version
# Skal vise: v22.x.x

npm --version
# Skal vise: 10.x.x
```

---

### 1.3 Installer pnpm

```bash
# Installer pnpm globalt
npm install -g pnpm

# Verifiser
pnpm --version
# Skal vise: 9.x.x
```

---

### 1.4 Installer Git

```bash
# Git er ofte forhåndsinstallert i Ubuntu, sjekk:
git --version

# Hvis ikke installert:
sudo apt update && sudo apt install git -y

# Konfigurer Git med din info
git config --global user.name "Christopher Myhrvold"
git config --global user.email "din@email.no"

# Verifiser
git config --list
```

---

### 1.5 Installer VS Code

**På Windows (ikke i WSL):**
1. Last ned fra https://code.visualstudio.com/
2. Installer med standardinnstillinger
3. Åpne VS Code

**Installer WSL-extension:**
1. I VS Code, trykk `Ctrl+Shift+X`
2. Søk etter "WSL"
3. Installer "WSL" av Microsoft

**Installer anbefalte extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma (for Drizzle også)
- Error Lens

---

### 1.6 Installer Claude Code CLI

```bash
# Installer Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Autentiser (åpner nettleser)
claude auth login

# Verifiser
claude --version
```

**Alternativt via Anthropic Console:**
1. Gå til https://console.anthropic.com/
2. Lag API-nøkkel
3. Sett miljøvariabel:
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
```

---

### 1.7 Sett opp GitHub-konto

Hvis du ikke har GitHub-konto:
1. Gå til https://github.com/
2. Registrer deg
3. Verifiser e-post

**Sett opp SSH-nøkkel (anbefalt):**
```bash
# Generer SSH-nøkkel
ssh-keygen -t ed25519 -C "din@email.no"

# Trykk Enter på alle spørsmål (standard verdier)

# Kopier public key
cat ~/.ssh/id_ed25519.pub
```

4. Gå til GitHub → Settings → SSH and GPG keys → New SSH key
5. Lim inn nøkkelen
6. Test:
```bash
ssh -T git@github.com
# Skal si: "Hi username! You've successfully authenticated"
```

---

## 🔧 Vanlige problemer

### "wsl --install" fungerer ikke
- Sørg for at du kjører PowerShell som Administrator
- Sjekk at Virtualization er aktivert i BIOS
- Prøv: `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`

### Node.js versjon er feil
```bash
# Se alle installerte versjoner
nvm ls

# Bytt til versjon 22
nvm use 22

# Sett som standard
nvm alias default 22
```

### "Permission denied" ved npm install
```bash
# Ikke bruk sudo med npm!
# Sjekk at nvm er riktig satt opp
which npm
# Skal vise: /home/username/.nvm/versions/node/v22.x.x/bin/npm
```

### VS Code kobler ikke til WSL
1. Åpne VS Code
2. Trykk `Ctrl+Shift+P`
3. Skriv "WSL: Connect to WSL"
4. Velg Ubuntu

---

## ✅ Verifisering - Kjør alle disse

```bash
# Alle disse kommandoene skal fungere:
wsl --version
node --version
pnpm --version
git --version
claude --version

# Sjekk at du er i WSL (ikke Windows)
uname -a
# Skal inneholde "Linux" og "microsoft"
```

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ WSL2 med Ubuntu installert
- ✅ Node.js 22 LTS via nvm
- ✅ pnpm pakkebehandler
- ✅ Git konfigurert med navn/e-post
- ✅ VS Code med WSL-extension
- ✅ Claude Code CLI autentisert
- ✅ GitHub-konto med SSH-nøkkel

---

## 🔧 Claude Code Prompt

Når alt er installert, test Claude Code:
```bash
# Gå til hjemmemappe
cd ~

# Start Claude Code
claude

# Si til Claude:
"Verifiser at mitt utviklingsmiljø er korrekt satt opp. 
Sjekk at Node.js 22, pnpm, og git er installert."
```

---

## ➡️ Neste fase
[Fase 2: Prosjekt-initialisering](./fase-02-prosjekt-initialisering.md)
