# Fase 28: Google Play

**Kategori:** 🚀 DEPLOYMENT  
**Tid:** 3-4 timer  
**Prioritet:** 🟡 Høy  
**Avhengigheter:** Fase 25 fullført

---

## 🎯 Mål
Publisere Android-appen til Google Play via EAS Submit.

---

## 📋 Forutsetninger

- Google Play Developer-konto ($25 engangsavgift)
- Produksjons-build klar
- Privacy policy URL

---

## 📋 Sjekkliste

### 28.1 Google Play Console Setup
1. Gå til https://play.google.com/console/
2. Registrer som utvikler ($25)
3. Verifiser identitet (kan ta 24-48 timer)

### 28.2 Opprett App
1. Play Console → "Create app"
2. Fyll inn:
   - **App name:** Myhrvoldgruppen Portal
   - **Default language:** Norwegian
   - **App or game:** App
   - **Free or paid:** Free

### 28.3 Service Account for EAS
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create Service Account
3. Grant rolle: "Service Account User"
4. Create JSON key, last ned

```bash
# Legg til i EAS
eas credentials
# Velg Android → Production → Upload service account key
```

### 28.4 Bygg for produksjon
```bash
eas build --platform android --profile production
```

### 28.5 Submit til Google Play
```bash
eas submit --platform android
```

---

## 📸 Google Play Assets

### Screenshots
- Minimum 2, maks 8
- JPEG eller PNG, 24-bit
- Min: 320px, Max: 3840px
- Anbefalt: 1080 x 1920 (9:16)

### Feature Graphic (påkrevd)
- 1024 x 500 px
- Vises øverst i Play Store

### App Icon
- 512 x 512 px
- PNG med transparens støttet

---

## 📝 Store Listing

```
Tittel: Myhrvoldgruppen Portal
Kort beskrivelse (80 tegn):
Servicehåndtering for teknikere - oppdrag, skader og signaturer

Full beskrivelse:
Myhrvoldgruppen Portal er den ultimate appen for teknikere og 
servicemedarbeidere i storkjøkken- og dagligvarebransjen.

🔧 HOVEDFUNKSJONER:
• Oversikt over dagens serviceoppdrag
• Registrer transportskader med kamera og GPS
• Fullfør servicebesøk med digital signatur
• Push-varsler for nye oppdrag
• Fungerer offline - synkroniserer når du er online

📱 ENKEL Å BRUKE:
Appen er designet for å være rask og effektiv i felten.
Ta bilder, registrer skader, og få kundens signatur på sekunder.

🔒 SIKKER:
All data overføres kryptert og lagres sikkert i EU (Frankfurt).
GDPR-kompatibel.

Kategori: Business
Innholdsgradering: Everyone
```

---

## 🔒 Data Safety

Google krever informasjon om data collection:

**Data types collected:**
- Location (approximate and precise)
- Photos/videos
- Personal info (name, email)

**Data usage:**
- App functionality
- Analytics

**Security practices:**
- Data encrypted in transit
- Data can be deleted

---

## ✅ Verifisering

1. Build fullført i EAS
2. App lastet opp til Play Console
3. Store listing komplett
4. Data safety utfylt
5. App i review / publisert

---

## 📦 Leveranse

- ✅ Google Play Developer konto
- ✅ Produksjons-build (.aab)
- ✅ Store listing komplett
- ✅ App publisert

---

## ➡️ Neste fase
[Fase 29: Datamigrering](./fase-29-datamigrering.md)
