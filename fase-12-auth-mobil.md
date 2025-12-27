# Fase 12: Auth Mobil (Expo + Clerk)

**Kategori:** 🔐 AUTENTISERING  
**Tid:** 3-4 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 11 fullført

---

## 🎯 Mål
Sette opp Clerk autentisering for Expo mobil-app med secure storage.

---

## 📋 Sjekkliste

### 12.1 Installer pakker
```bash
pnpm add @clerk/clerk-expo expo-secure-store --filter @myhrvold/expo
```

### 12.2 Konfigurer token-cache
```typescript
// apps/expo/src/lib/token-cache.ts
import * as SecureStore from 'expo-secure-store'

export const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key)
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value)
  },
}
```

### 12.3 Provider-oppsett
```typescript
// apps/expo/src/app/_layout.tsx
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { tokenCache } from '../lib/token-cache'

export default function RootLayout() {
  return (
    <ClerkProvider 
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <Stack />
      </ClerkLoaded>
    </ClerkProvider>
  )
}
```

### 12.4 Login-skjerm
```typescript
// apps/expo/src/app/sign-in.tsx
import { useSignIn } from '@clerk/clerk-expo'
import { useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet } from 'react-native'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSignIn = async () => {
    if (!isLoaded) return
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Innlogging feilet')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logg inn</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Passord"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Logg inn" onPress={onSignIn} color="#0d9488" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', padding: 15, marginBottom: 15, borderRadius: 8 },
  error: { color: '#ef4444', marginBottom: 15, textAlign: 'center' },
})
```

### 12.5 Beskyttet navigasjon
```typescript
// apps/expo/src/app/(auth)/_layout.tsx
import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href="/sign-in" />

  return <Stack />
}
```

---

## ✅ Verifisering

1. Start Expo: `pnpm dev --filter @myhrvold/expo`
2. Åpne på telefon via Expo Go
3. Prøv å logge inn
4. Sjekk at session lagres i SecureStore

---

## 📦 Leveranse

- ✅ Clerk for Expo konfigurert
- ✅ SecureStore for tokens
- ✅ Login-skjerm
- ✅ Beskyttet navigasjon

---

## ➡️ Neste fase
[Fase 13: Layout & navigasjon](./fase-13-layout-navigasjon.md)
