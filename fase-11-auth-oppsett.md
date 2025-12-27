# Fase 11: Auth-oppsett (Supabase Auth)

**Kategori:** AUTENTISERING
**Tid:** 4-5 timer
**Prioritet:** Kritisk
**Avhengigheter:** Fase 3 fullført (Supabase-oppsett)

---

## Mål
Sette opp Supabase Auth for web-portalen med e-post/passord, beskyttede ruter og rollebasert tilgang.

---

## Hvorfor Supabase Auth?

| Fordel | Beskrivelse |
|--------|-------------|
| Allerede inkludert | Du bruker allerede Supabase for database |
| Gratis | Inkludert i Supabase-planen |
| RLS-integrasjon | Row Level Security fungerer automatisk |
| Enkel oppsett | Samme SDK for web og mobil |

---

## Sjekkliste

### 11.1 Aktiver Auth i Supabase
- [ ] Gå til Supabase Dashboard -> Authentication
- [ ] Enable Email provider
- [ ] (Valgfritt) Enable Google OAuth
- [ ] Sett "Site URL" til `http://localhost:3000`
- [ ] Legg til redirect URLs

### 11.2 Installer pakker
```bash
pnpm add @supabase/supabase-js @supabase/ssr --filter @myhrvold/nextjs
```

### 11.3 Miljøvariabler
```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

---

## Supabase Client Setup

### 1. Browser Client

```typescript
// packages/db/src/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 2. Server Client

```typescript
// packages/db/src/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
```

### 3. Middleware

```typescript
// apps/nextjs/src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Offentlige ruter
  const publicRoutes = ['/sign-in', '/sign-up', '/auth/callback']
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

---

## Auth-sider

### 1. Sign-in side

```typescript
// apps/nextjs/src/app/sign-in/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@myhrvold/db/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@myhrvold/ui/button'
import { Input } from '@myhrvold/ui/input'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Myhrvoldgruppen</h1>
          <p className="text-gray-600 mt-2">Logg inn på portalen</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-post
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passord
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logger inn...' : 'Logg inn'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Har du ikke konto?{' '}
          <a href="/sign-up" className="text-teal-600 hover:underline">
            Registrer deg
          </a>
        </p>
      </div>
    </div>
  )
}
```

### 2. Sign-up side

```typescript
// apps/nextjs/src/app/sign-up/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@myhrvold/db/supabase/client'
import { Button } from '@myhrvold/ui/button'
import { Input } from '@myhrvold/ui/input'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-green-600 mb-2">Sjekk e-posten din!</h2>
          <p className="text-gray-600">
            Vi har sendt deg en bekreftelseslink. Klikk på den for å aktivere kontoen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Registrer deg</h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fornavn</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Etternavn</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-post</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Passord</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Registrer deg
          </Button>
        </form>
      </div>
    </div>
  )
}
```

### 3. Auth Callback

```typescript
// apps/nextjs/src/app/auth/callback/route.ts
import { createClient } from '@myhrvold/db/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`)
}
```

### 4. Logg ut-knapp

```typescript
// apps/nextjs/src/components/sign-out-button.tsx
'use client'
import { createClient } from '@myhrvold/db/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@myhrvold/ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <Button variant="ghost" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Logg ut
    </Button>
  )
}
```

---

## Hent bruker på server

```typescript
// I en Server Component
import { createClient } from '@myhrvold/db/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <h1>Velkommen, {user?.user_metadata.first_name}!</h1>
    </div>
  )
}
```

---

## Synkroniser med users-tabell

```typescript
// Supabase Database Trigger (kjør i SQL Editor)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, first_name, last_name, role, is_active)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    'user',
    true
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## Verifisering

1. Start dev server: `pnpm dev`
2. Gå til http://localhost:3000
3. Du skal bli redirectet til /sign-in
4. Registrer deg med e-post
5. Sjekk e-post for bekreftelseslink
6. Logg inn og bekreft at dashboard vises

---

## Leveranse

- [x] Supabase Auth konfigurert
- [x] Beskyttede ruter via middleware
- [x] Sign-in og sign-up sider
- [x] Bruker-synkronisering til database
- [x] Norsk UI

---

## Neste fase
[Fase 12: Auth mobil](./fase-12-auth-mobil.md)
