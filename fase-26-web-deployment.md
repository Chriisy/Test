# Fase 26: Web Deployment (Vercel)

**Kategori:** 🚀 DEPLOYMENT  
**Tid:** 2-3 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 20 fullført

---

## 🎯 Mål
Deploye web-portalen til Vercel med automatisk CI/CD fra GitHub.

---

## 📋 Sjekkliste

### 26.1 Opprett Vercel-konto
1. Gå til https://vercel.com/
2. Registrer med GitHub
3. Velg Pro plan ($20/mnd) for team-funksjonalitet

### 26.2 Koble til GitHub
1. Vercel Dashboard → "Add New Project"
2. Velg `myhrvoldgruppen-portal` repository
3. Konfigurer:
   - **Root Directory:** `apps/nextjs`
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm build`
   - **Install Command:** `pnpm install`

### 26.3 Miljøvariabler
Legg til i Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

### 26.4 Deploy
```bash
# Vercel CLI (valgfritt)
npm i -g vercel
vercel login
vercel --prod
```

Eller push til `main` branch - Vercel deployer automatisk.

---

## 🌐 Domene-oppsett

### Custom domain (valgfritt)
1. Vercel → Project → Settings → Domains
2. Legg til: `portal.myhrvoldgruppen.no`
3. Konfigurer DNS hos domeneleverandør:
   ```
   Type: CNAME
   Name: portal
   Value: cname.vercel-dns.com
   ```

### SSL
Vercel gir automatisk SSL-sertifikat (Let's Encrypt).

---

## 🔄 CI/CD Workflow

```
GitHub Push → Vercel Build → Deploy

main branch     → Produksjon (portal.myhrvoldgruppen.no)
develop branch  → Preview (develop-xxx.vercel.app)
feature/*       → Preview (feature-xxx.vercel.app)
```

### Preview deployments
Hver Pull Request får automatisk en preview-URL for testing.

---

## ⚡ Vercel-optimalisering

### Edge Functions
```typescript
// next.config.js
export const config = {
  runtime: 'edge',
}
```

### Image Optimization
```typescript
// Automatisk med next/image
import Image from 'next/image'
<Image src="/logo.png" width={200} height={50} alt="Logo" />
```

### Analytics
1. Vercel Dashboard → Analytics
2. Aktiver Web Vitals
3. Se Core Web Vitals i sanntid

---

## ✅ Verifisering

1. Push til main → Sjekk at build kjører
2. Besøk produksjons-URL
3. Test innlogging
4. Sjekk at database-tilkobling fungerer
5. Test preview deployment fra PR

---

## 📦 Leveranse

- ✅ Vercel-prosjekt konfigurert
- ✅ Automatisk deployment fra GitHub
- ✅ Miljøvariabler satt
- ✅ Preview deployments aktive

---

## ➡️ Neste fase
[Fase 27: iOS App Store](./fase-27-ios-app-store.md)
