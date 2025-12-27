# Fase 12: Auth Mobil (Expo + Replit Backend)

**Kategori:** AUTENTISERING
**Tid:** 3-4 timer
**Prioritet:** Kritisk
**Avhengigheter:** Fase 11 fullført

---

## Mål
Sette opp autentisering for Expo mobil-app som kommuniserer med Replit backend via API tokens.

---

## Strategi for mobil auth

Siden Replit Auth er beregnet for web-bruk, bruker vi en token-basert tilnærming for mobil:

1. Bruker logger inn via web (Replit Auth)
2. Genererer en API-token
3. Mobil-appen bruker token for autentisering

---

## Sjekkliste

### 12.1 Installer pakker

```bash
pnpm add expo-secure-store @react-native-async-storage/async-storage --filter @myhrvold/expo
```

---

### 12.2 Token Storage

```typescript
// apps/expo/src/lib/auth-storage.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'myhrvold_auth_token';
const USER_KEY = 'myhrvold_user';

export const authStorage = {
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async getUser(): Promise<any | null> {
    try {
      const user = await SecureStore.getItemAsync(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  async setUser(user: any): Promise<void> {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },
};
```

---

### 12.3 API Client

```typescript
// apps/expo/src/lib/api.ts
import { authStorage } from './auth-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await authStorage.getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      await authStorage.clear();
      throw new Error('Unauthorized');
    }
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

---

### 12.4 Auth Context

```typescript
// apps/expo/src/providers/auth-provider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authStorage } from '../lib/auth-storage';
import { apiClient } from '../lib/api';

interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = await authStorage.getToken();
      if (token) {
        const userData = await apiClient<User>('/api/auth/me');
        setUser(userData);
        await authStorage.setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      await authStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(token: string) {
    await authStorage.setToken(token);
    await loadUser();
  }

  async function signOut() {
    await authStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

### 12.5 Root Layout

```typescript
// apps/expo/app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/providers/auth-provider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
```

---

### 12.6 Login-skjerm med token

```typescript
// apps/expo/app/sign-in.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/providers/auth-provider';

export default function SignInScreen() {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!token.trim()) {
      setError('Vennligst skriv inn din API-token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(token.trim());
      router.replace('/(auth)/');
    } catch (err) {
      setError('Ugyldig token. Prøv igjen.');
      setLoading(false);
    }
  };

  const openWebPortal = () => {
    Linking.openURL(process.env.EXPO_PUBLIC_WEB_URL || 'https://your-app.replit.app');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Myhrvoldgruppen</Text>
        <Text style={styles.subtitle}>Mobil Portal</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.instructions}>
          Logg inn på web-portalen for å hente din API-token
        </Text>

        <TouchableOpacity style={styles.linkButton} onPress={openWebPortal}>
          <Text style={styles.linkButtonText}>Åpne web-portalen</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Lim inn API-token"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Logg inn</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructions: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  linkButton: {
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#0369a1',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0d9488',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

### 12.7 Beskyttet navigasjon

```typescript
// apps/expo/app/(auth)/_layout.tsx
import { useAuth } from '../../src/providers/auth-provider';
import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

---

### 12.8 Logg ut-knapp

```typescript
// apps/expo/src/components/sign-out-button.tsx
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'expo-router';

export function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert(
      'Logg ut',
      'Er du sikker på at du vil logge ut?',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Logg ut',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/sign-in');
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <Text style={styles.text}>Logg ut</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
  },
  text: {
    color: '#ef4444',
    fontSize: 16,
  },
});
```

---

## Backend: Token-generering

Legg til i web-portalen for å generere API-tokens:

```typescript
// packages/api/src/routers/tokens.ts
import { router, protectedProcedure } from '../trpc';
import { db } from '@myhrvold/db';
import { apiTokens } from '@myhrvold/db/schema';
import { randomBytes } from 'crypto';

export const tokensRouter = router({
  create: protectedProcedure
    .mutation(async ({ ctx }) => {
      const token = randomBytes(32).toString('hex');

      await db.insert(apiTokens).values({
        userId: ctx.user.id,
        token,
        name: 'Mobile App',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 år
      });

      return { token };
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      return db.query.apiTokens.findMany({
        where: (tokens, { eq }) => eq(tokens.userId, ctx.user.id),
      });
    }),

  revoke: protectedProcedure
    .input(z.object({ tokenId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(apiTokens)
        .where(and(
          eq(apiTokens.id, input.tokenId),
          eq(apiTokens.userId, ctx.user.id)
        ));
    }),
});
```

---

## Miljøvariabler for Expo

```bash
# apps/expo/.env
EXPO_PUBLIC_API_URL=https://your-app.replit.app
EXPO_PUBLIC_WEB_URL=https://your-app.replit.app
```

---

## Verifisering

1. Start Expo: `pnpm dev --filter @myhrvold/expo`
2. Åpne i Expo Go eller Development Build
3. Trykk "Åpne web-portalen"
4. Logg inn på web og generer API-token
5. Lim inn token i mobil-appen
6. Sjekk at du kommer til hovedskjermen
7. Test logg ut

---

## Leveranse

- [x] Token-basert auth for mobil
- [x] SecureStore for sikker token-lagring
- [x] Login-skjerm med norsk UI
- [x] Beskyttet navigasjon
- [x] Kobling til Replit backend

---

## Neste fase
[Fase 13: Layout & navigasjon](./fase-13-layout-navigasjon.md)
