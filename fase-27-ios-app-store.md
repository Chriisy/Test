# Fase 27: iOS App Store

**Kategori:** 🚀 DEPLOYMENT  
**Tid:** 4-6 timer  
**Prioritet:** 🟡 Høy  
**Avhengigheter:** Fase 25 fullført

---

## 🎯 Mål
Publisere iOS-appen til App Store via EAS Submit.

---

## 📋 Forutsetninger

- Apple Developer Program ($99/år)
- Apple Developer-konto verifisert
- App Store Connect-tilgang
- Produksjons-build klar

---

## 📋 Sjekkliste

### 27.1 Apple Developer Setup
1. Gå til https://developer.apple.com/
2. Registrer for Apple Developer Program
3. Vent på godkjenning (kan ta 24-48 timer)
4. Aksepter alle avtaler i App Store Connect

### 27.2 Opprett App i App Store Connect
1. https://appstoreconnect.apple.com/ → My Apps → "+"
2. Fyll inn:
   - **Name:** Myhrvoldgruppen
   - **Primary Language:** Norwegian
   - **Bundle ID:** no.myhrvoldgruppen.portal
   - **SKU:** myhrvoldgruppen-portal-2025

### 27.3 EAS Credentials
```bash
# Generer certificates og provisioning profiles
eas credentials

# Velg:
# - iOS
# - Production
# - Let EAS handle everything (anbefalt)
```

### 27.4 Bygg for produksjon
```bash
eas build --platform ios --profile production
```

### 27.5 Submit til App Store
```bash
eas submit --platform ios
```

---

## 📸 App Store Assets

### Screenshots (påkrevd)
- 6.7" (iPhone 15 Pro Max): 1290 x 2796 px
- 6.5" (iPhone 11 Pro Max): 1242 x 2688 px
- 5.5" (iPhone 8 Plus): 1242 x 2208 px
- 12.9" iPad Pro: 2048 x 2732 px

### App Icon
- 1024 x 1024 px (ingen avrunding, Apple legger til)

### App Preview (valgfritt)
- Video 15-30 sekunder
- Samme oppløsning som screenshots

---

## 📝 App Store-informasjon

```
Navn: Myhrvoldgruppen Portal
Undertittel: Service og reklamasjonshåndtering
Kategori: Business
Aldersgrense: 4+

Beskrivelse:
Myhrvoldgruppen Portal er en profesjonell app for teknikere og 
servicemedarbeidere. Håndter serviceoppdrag, registrer skader, 
og fullfør besøk med digital signatur - alt fra mobilen.

Funksjoner:
• Se dagens oppdrag og oppgaver
• Registrer transportskader med kamera og GPS
• Digital kundesignatur
• Push-varsler for nye oppdrag
• Fungerer offline

Nøkkelord:
service, reklamasjon, tekniker, storkjøkken, vedlikehold

Support URL: https://myhrvoldgruppen.no/support
Privacy Policy URL: https://myhrvoldgruppen.no/personvern
```

---

## 🔒 Privacy Policy

Du trenger en personvernerklæring som dekker:
- Hvilke data samles inn
- Hvordan data brukes
- GPS/kamera-tilgang
- GDPR-rettigheter

---

## ✅ App Review Tips

Apple kan avvise appen. Vanlige årsaker:
- Manglende demo-konto (legg til i Review Notes)
- Ufullstendig metadata
- Krasjer ved testing
- Manglende privacy policy

**Review Notes eksempel:**
```
Demo-konto for testing:
E-post: demo@myhrvoldgruppen.no
Passord: DemoTest2025!

Appen krever innlogging. Bruk kontoen over for testing.
Alle funksjoner krever aktiv internettforbindelse.
```

---

## ✅ Verifisering

1. Build fullført i EAS
2. App submitted til App Store Connect
3. App in review
4. App godkjent og publisert

---

## 📦 Leveranse

- ✅ Apple Developer konto konfigurert
- ✅ App Store Connect opprettet
- ✅ Produksjons-build
- ✅ App submitted til review

---

## ➡️ Neste fase
[Fase 28: Google Play](./fase-28-google-play.md)
