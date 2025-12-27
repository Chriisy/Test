# Fase 11: Auth-oppsett (Replit Auth)

**Kategori:** AUTENTISERING
**Tid:** 4-5 timer
**Prioritet:** Kritisk
**Avhengigheter:** Fase 3 fullført (Database-oppsett)

---

## Mål
Sette opp Replit Auth for web-portalen med beskyttede ruter og rollebasert tilgang.

---

## Hvorfor Replit Auth?

| Fordel | Beskrivelse |
|--------|-------------|
| Integrert | Samme plattform som database |
| Enkelt | Minimalt oppsett kreves |
| Sikkert | Håndtert av Replit |
| Gratis | Inkludert i Replit-planen |

---

## Sjekkliste

### 11.1 Aktiver Auth i Replit

1. Åpne Replit-prosjektet
2. Klikk "Tools" i sidepanelet
3. Velg "Authentication"
4. Klikk "Enable authentication"
5. Velg innloggingsmetoder (Google, GitHub, etc.)

---

### 11.2 Installer pakker

```bash
pnpm add @replit/repl-auth --filter @myhrvold/nextjs
```

---

### 11.3 Miljøvariabler

Replit setter automatisk opp auth-variabler. For lokal utvikling:

```bash
# .env
REPLIT_DB_URL=your-replit-db-url
REPL_ID=your-repl-id
REPL_OWNER=your-username
```

---

## Auth Wrapper

### 1. Auth Utility

```typescript
// packages/db/src/auth/replit.ts
import { getUserInfo } from '@replit/repl-auth';
import type { NextRequest } from 'next/server';

export interface ReplitUser {
  id: string;
  name: string;
  profileImage?: string;
  roles?: string[];
}

export async function getReplitUser(request: NextRequest): Promise<ReplitUser | null> {
  const userInfo = await getUserInfo(request);

  if (!userInfo) {
    return null;
  }

  return {
    id: userInfo.id,
    name: userInfo.name,
    profileImage: userInfo.profileImage,
    roles: userInfo.roles || ['user'],
  };
}

export function isAuthenticated(request: NextRequest): boolean {
  const userHeader = request.headers.get('X-Replit-User-Id');
  return !!userHeader;
}
```

---

### 2. Middleware

```typescript
// apps/nextjs/src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const userId = request.headers.get('X-Replit-User-Id');
  const userName = request.headers.get('X-Replit-User-Name');

  // Offentlige ruter
  const publicRoutes = ['/sign-in', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!userId && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // Legg til brukerinfo i response headers for bruk i komponenter
  const response = NextResponse.next();
  if (userId) {
    response.headers.set('x-user-id', userId);
    response.headers.set('x-user-name', userName || '');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
```

---

## Auth-sider

### 1. Sign-in side

```typescript
// apps/nextjs/src/app/sign-in/page.tsx
'use client';

import { Button } from '@myhrvold/ui/button';

export default function SignInPage() {
  const handleSignIn = () => {
    // Replit Auth redirect
    window.location.href = '/__replauthLogin';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Myhrvoldgruppen</h1>
          <p className="text-gray-600 mt-2">Logg inn på portalen</p>
        </div>

        <Button onClick={handleSignIn} className="w-full">
          Logg inn med Replit
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Bruk din Replit-konto for å logge inn
        </p>
      </div>
    </div>
  );
}
```

---

### 2. Auth Context

```typescript
// apps/nextjs/src/providers/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hent brukerinfo fra Replit headers
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const signOut = () => {
    window.location.href = '/__replauthLogout';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
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

### 3. Auth API Route

```typescript
// apps/nextjs/src/app/api/auth/me/route.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('X-Replit-User-Id');
  const userName = request.headers.get('X-Replit-User-Name');
  const userImage = request.headers.get('X-Replit-User-Profile-Image');

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({
    id: userId,
    name: userName,
    profileImage: userImage,
  });
}
```

---

### 4. Root Layout

```typescript
// apps/nextjs/src/app/layout.tsx
import { AuthProvider } from '../providers/auth-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### 5. Logg ut-knapp

```typescript
// apps/nextjs/src/components/sign-out-button.tsx
'use client';

import { Button } from '@myhrvold/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '../providers/auth-provider';

export function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Button variant="ghost" onClick={signOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Logg ut
    </Button>
  );
}
```

---

## Hent bruker på server

```typescript
// I en Server Component
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const headersList = await headers();
  const userId = headersList.get('X-Replit-User-Id');
  const userName = headersList.get('X-Replit-User-Name');

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1>Velkommen, {userName}!</h1>
    </div>
  );
}
```

---

## Synkroniser med users-tabell

```typescript
// packages/api/src/routers/auth.ts
import { router, publicProcedure } from '../trpc';
import { db } from '@myhrvold/db';
import { users } from '@myhrvold/db/schema';
import { eq } from 'drizzle-orm';

export const authRouter = router({
  syncUser: publicProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.headers.get('X-Replit-User-Id');
      const userName = ctx.headers.get('X-Replit-User-Name');

      if (!userId || !userName) {
        throw new Error('Not authenticated');
      }

      // Sjekk om bruker finnes
      const existingUser = await db.query.users.findFirst({
        where: eq(users.replitId, userId),
      });

      if (existingUser) {
        return existingUser;
      }

      // Opprett ny bruker
      const [newUser] = await db.insert(users).values({
        replitId: userId,
        name: userName,
        role: 'user',
        isActive: true,
      }).returning();

      return newUser;
    }),
});
```

---

## Verifisering

1. Start dev server: `pnpm dev`
2. Gå til http://localhost:3000 (eller Replit preview)
3. Du skal bli redirectet til /sign-in
4. Klikk "Logg inn med Replit"
5. Autentiser med Replit-kontoen din
6. Bekreft at dashboard vises

---

## Leveranse

- [x] Replit Auth konfigurert
- [x] Beskyttede ruter via middleware
- [x] Sign-in side
- [x] Bruker-synkronisering til database
- [x] Norsk UI

---

## Neste fase
[Fase 12: Auth mobil](./fase-12-auth-mobil.md)
