# 🚀 Myhrvoldgruppen Service Portal
## Komplett 30-Faser Utviklingsplan - MASTER DOKUMENT

---

## 📊 Prosjektoversikt

**Hva vi bygger:**
- Web-portal (PC + iPad)
- iOS-app (iPhone)
- Android-app
- Felles backend med 80%+ kodedeling

**Eksisterende system har:**
- 207 kunder
- 117 serviceavtaler
- 23 reklamasjoner
- 47 servicepartnere
- 6 brukerroller

---

## 🗄️ Database - KOMPLETT OVERSIKT

### Alle 12 hovedtabeller:

| Tabell | Felt | Beskrivelse |
|--------|------|-------------|
| **users** | 26 | Brukere med roller, OAuth, GDPR |
| **customers** | 20 | Kunder med Visma-felter |
| **suppliers** | 24 | Leverandører med SLA, garanti |
| **products** | 21 | Produkter med specs (jsonb) |
| **claims** | 56 | Reklamasjoner - hovedtabell |
| **claim_parts** | 15 | Deler til reklamasjoner |
| **installations** | 35+ | Installasjonsprosjekter |
| **storkjokken_agreements** | 40+ | Storkjøkken serviceavtaler |
| **transport_damages** | 28 | Transportskader med GPS |
| **discussion_issues** | 28 | Saker/diskusjoner/møter |
| **service_partners** | 18 | Servicepartnere med kart |
| **service_visits** | ~20 | Planlagte besøk |

**Totalt: ~350+ databasefelt**

---

## 🎨 Design - Nordic Professional

### Fargepalett:
```css
--primary-teal: #0d9488      /* Hovedfarge - mørk teal */
--primary-teal-dark: #0f766e /* Hover */
--accent-orange: #f97316     /* Action buttons */
--accent-orange-dark: #ea580c
--gray-900: #0f172a          /* Tekst */
--gray-50: #f8fafc           /* Bakgrunn */
```

### Layout:
- **Venstre sidebar** (mørk teal, kollapsbar)
- **Topbar** med søk og brukerinfo
- **Hovedinnhold** med kort-basert design

---

## 📁 Alle 30 Faser

### 🏗️ FUNDAMENT (Uke 1) - 8 timer
| # | Fase | Tid | Fil |
|---|------|-----|-----|
| 1 | Utviklingsmiljø | 2-3t | [fase-01](./fase-01-utviklingsmiljo.md) |
| 2 | Prosjekt-initialisering | 1-2t | [fase-02](./fase-02-prosjekt-initialisering.md) |
| 3 | Database-oppsett | 1-2t | [fase-03](./fase-03-database-oppsett.md) |
| 4 | CLAUDE.md konfig | 30min | [fase-04](./fase-04-claude-md-konfigurasjon.md) |
| 5 | Git versjonskontroll | 30min | [fase-05](./fase-05-git-versjonskontroll.md) |

### 🗄️ DATABASE (Uke 2-3) - 18 timer
| # | Fase | Tid | Fil |
|---|------|-----|-----|
| 6 | Kjerne-tabeller (users, customers, suppliers, products) | 4t | [fase-06](./fase-06-kjerne-tabeller.md) |
| 7 | Reklamasjons-tabeller (claims 56 felt, claim_parts) | 4t | [fase-07](./fase-07-reklamasjons-tabeller.md) |
| 8 | Service-tabeller (storkjokken 40+ felt, visits) | 4t | [fase-08](./fase-08-service-tabeller.md) |
| 9 | Øvrige tabeller (installations, transport, issues, partners) | 4t | [fase-09](./fase-09-ovrige-tabeller.md) |
| 10 | Relasjoner og indekser | 2t | [fase-10](./fase-10-relasjoner-indekser.md) |

### 🔐 AUTENTISERING (Uke 3) - 8 timer
| # | Fase | Tid | Fil |
|---|------|-----|-----|
| 11 | Auth web (Replit Auth) | 4-5t | [fase-11](./fase-11-auth-oppsett.md) |
| 12 | Auth mobil (Expo + Replit) | 3-4t | [fase-12](./fase-12-auth-mobil.md) |

### 💻 WEB-PORTAL (Uke 4-6) - 55 timer
| # | Fase | Tid | Fil |
|---|------|-----|-----|
| 13 | Layout & navigasjon (sidebar) | 4-5t | [fase-13](./fase-13-layout-navigasjon.md) |
| 14 | Dashboard | 4-5t | [fase-14](./fase-14-dashboard.md) |
| 15 | Reklamasjonsliste | 5-6t | [fase-15](./fase-15-reklamasjonsliste.md) |
| 16 | Reklamasjon wizard (5 steg) | 6-8t | [fase-16](./fase-16-reklamasjon-wizard.md) |
| 17 | Reklamasjon detaljer | 4-5t | [fase-17](./fase-17-reklamasjon-detaljer.md) |
| 18 | Service-moduler (avtaler, besøk, partnere) | 8-10t | [fase-18](./fase-18-service-moduler.md) |
| 19 | Salg & Admin (kunder, CRM, stamdata) | 6-8t | [fase-19](./fase-19-salg-admin.md) |
| 20 | Kommunikasjon (varsler, chat, forum) | 4-5t | [fase-20](./fase-20-kommunikasjon.md) |

### 📱 MOBIL-APP (Uke 7-8) - 25 timer
| # | Fase | Tid | Fil |
|---|------|-----|-----|
| 21 | Expo setup | 3-4t | [fase-21](./fase-21-expo-setup.md) |
| 22 | Mobil navigasjon | 4-5t | [fase-22](./fase-22-mobil-navigasjon.md) |
| 23 | Mine oppdrag | 5-6t | [fase-23](./fase-23-mine-oppdrag.md) |
| 24 | Feltregistrering (kamera, GPS, signatur) | 6-8t | [fase-24](./fase-24-feltregistrering.md) |
| 25 | Mobil polering | 3-4t | [fase-25](./fase-25-mobil-polering.md) |

### 🚀 DEPLOYMENT (Uke 9) - 12 timer
| # | Fase | Tid | Fil |
|---|------|-----|-----|
| 26 | Web deployment (Vercel) | 2-3t | [fase-26](./fase-26-web-deployment.md) |
| 27 | iOS App Store | 4-6t | [fase-27](./fase-27-ios-app-store.md) |
| 28 | Google Play | 3-4t | [fase-28](./fase-28-google-play.md) |

### 🏁 POLERING (Uke 10) - 10 timer
| # | Fase | Tid | Fil |
|---|------|-----|-----|
| 29 | Datamigrering fra Replit | 4-6t | [fase-29](./fase-29-datamigrering.md) |
| 30 | Testing & lansering | 4-6t | [fase-30](./fase-30-testing-lansering.md) |

---

## ⏱️ Totalt

| Kategori | Timer |
|----------|-------|
| Fundament | 8 |
| Database | 18 |
| Auth | 8 |
| Web-portal | 55 |
| Mobil-app | 25 |
| Deployment | 12 |
| Polering | 10 |
| **TOTALT** | **~136 timer** |

**Tidsramme:** 8-10 uker ved deltidsarbeid

---

## 💰 Kostnader

### Engangsutgifter:
- Apple Developer Program: $99/år
- Google Play Developer: $25 (engang)

### Månedlige:
- Vercel Pro: $20/mnd
- Replit Core: $25/mnd (inkl. PostgreSQL, Auth, Object Storage)
- (Valgfritt) Claude Max: $100/mnd

### År 1 totalt: ~$700-$1900

---

## 🛠️ Teknologi-stack

```
├── Frontend
│   ├── Next.js 15 (App Router)
│   ├── React 19
│   ├── Tailwind CSS v4
│   └── shadcn/ui
│
├── Backend
│   ├── tRPC v11
│   ├── Drizzle ORM
│   └── PostgreSQL (Replit)
│
├── Mobil
│   ├── Expo SDK 54
│   ├── React Native 0.81
│   └── NativeWind v4
│
├── Auth
│   └── Replit Auth (web + mobil)
│
├── Tilleggstjenester
│   ├── Sentry (feilhåndtering)
│   ├── Resend (e-post)
│   ├── @react-pdf/renderer (PDF-generering)
│   └── Replit Object Storage (bilder, filer)
│
├── Hosting
│   ├── Replit (utvikling + database)
│   └── Vercel (produksjon web)
│
└── Monorepo
    ├── Turborepo
    └── pnpm workspaces
```

---

## 📱 Moduler fra eksisterende system

### ✅ Dekket i fasene:
- [x] Dashboard med statistikk
- [x] Reklamasjonshåndtering (full workflow)
- [x] Kundeoversikt (207 kunder)
- [x] Leverandøroversikt
- [x] Installasjoner med kalender
- [x] Transportskader
- [x] Serviceavtaler (dagligvare + storkjøkken)
- [x] Planlagte besøk
- [x] Servicepartnere med kart
- [x] Utlånsmaskiner
- [x] CRM & Pipeline
- [x] Brukeradministrasjon
- [x] Stamdata
- [x] Varslinger
- [x] Team Chat
- [x] Forum

### 🔄 Vurderes senere:
- [ ] Vaktliste (skift-planlegging)
- [ ] AI Dokumentsøk (Gemini)
- [ ] Hjemmeside-synk
- [ ] Garantioversikt (leverandør)
- [ ] Stinkers (gjengangere)

---

## 🚀 Start her!

1. **Les denne filen først**
2. **Gå til [Fase 1](./fase-01-utviklingsmiljo.md)**
3. **Følg sjekklistene**
4. **Spør meg hvis du står fast**

Lykke til! 🇳🇴
