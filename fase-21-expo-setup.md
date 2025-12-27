# Fase 21: Expo Setup

**Kategori:** 📱 MOBIL-APP  
**Tid:** 3-4 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 12 fullført

---

## 🎯 Mål
Sette opp Expo-appen for iOS og Android med Development Builds.

---

## ⚠️ VIKTIG: Bruk Development Builds, IKKE Expo Go

For enterprise-apper må vi bruke **EAS Development Builds** i stedet for Expo Go fordi:
- Expo Go støtter ikke alle native moduler
- Bedre ytelse
- Mer lik produksjonsappen
- Støtte for egne native pakker

---

## 📋 Sjekkliste

### 21.1 Installer EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 21.2 Konfigurer EAS
```bash
cd apps/expo
eas build:configure
```

### 21.3 Opprett app.json
```json
{
  "expo": {
    "name": "Myhrvoldgruppen",
    "slug": "myhrvoldgruppen",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0d9488"
    },
    "ios": {
      "bundleIdentifier": "no.myhrvoldgruppen.portal",
      "supportsTablet": true
    },
    "android": {
      "package": "no.myhrvoldgruppen.portal",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0d9488"
      }
    },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ],
    "scheme": "myhrvoldgruppen"
  }
}
```

### 21.4 Opprett eas.json
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 21.5 Bygg Development Client
```bash
# For iOS simulator
eas build --profile development --platform ios

# For Android emulator
eas build --profile development --platform android

# For fysisk enhet (krever Apple Developer konto)
eas build --profile development --platform ios
```

---

## 📦 Prosjektstruktur

```
apps/expo/
├── app/                    # Expo Router sider
│   ├── (auth)/            # Beskyttede sider
│   │   ├── _layout.tsx
│   │   ├── index.tsx      # Hjem
│   │   ├── tasks/         # Mine oppdrag
│   │   └── profile/       # Profil
│   ├── sign-in.tsx        # Innlogging
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # UI-komponenter
│   ├── lib/              # Utilities
│   └── utils/            # Hjelpefunksjoner
├── assets/
│   ├── icon.png          # App-ikon (1024x1024)
│   ├── splash.png        # Splash screen
│   └── adaptive-icon.png # Android adaptive
├── app.json
├── eas.json
└── package.json
```

---

## 🔧 NativeWind (Tailwind for React Native)

```bash
pnpm add nativewind tailwindcss --filter @myhrvold/expo
```

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        teal: {
          600: '#0d9488',
          700: '#0f766e',
        },
        orange: {
          500: '#f97316',
        },
      },
    },
  },
}
```

---

## ✅ Verifisering

1. `eas build --profile development --platform ios` fullfører
2. Installer development build på simulator/enhet
3. Appen starter og viser innloggingsskjerm

---

## 📦 Leveranse

- ✅ EAS konfigurert
- ✅ Development build bygget
- ✅ NativeWind satt opp
- ✅ Prosjektstruktur klar

---

## ➡️ Neste fase
[Fase 22: Mobil Navigasjon](./fase-22-mobil-navigasjon.md)
