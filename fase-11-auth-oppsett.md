# Fase 11: Auth-oppsett (Clerk)

**Kategori:** 🔐 AUTENTISERING  
**Tid:** 4-5 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 2 fullført

---

## 🎯 Mål
Sette opp Clerk autentisering for web-portalen med norsk lokalisering og beskyttede ruter.

---

## 📋 Sjekkliste

### 11.1 Opprett Clerk-konto
- [ ] Gå til https://clerk.com/
- [ ] Registrer deg (gratis tier)
- [ ] Opprett ny applikasjon: "Myhrvoldgruppen Portal"

### 11.2 Konfigurer Clerk Dashboard
- [ ] Aktiver Email + Password
- [ ] Aktiver Google OAuth (valgfritt)
- [ ] Sett opp norsk lokalisering
- [ ] Kopier API-nøkler

### 11.3 Installer Clerk
```bash
pnpm add @clerk/nextjs --filter @myhrvold/nextjs
```

### 11.4 Konfigurer miljøvariabler
```bash
# .env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## 📄 Clerk-oppsett

### 1. Middleware

```typescript
// apps/nextjs/src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

### 2. Layout-provider

```typescript
// apps/nextjs/src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { nbNO } from '@clerk/localizations'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={nbNO}>
      <html lang="no">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### 3. Sign-in side

```typescript
// apps/nextjs/src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-lg",
            headerTitle: "text-gray-900",
            headerSubtitle: "text-gray-600",
            formButtonPrimary: "bg-teal-600 hover:bg-teal-700",
          }
        }}
      />
    </div>
  )
}
```

### 4. Sign-up side

```typescript
// apps/nextjs/src/app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: "bg-teal-600 hover:bg-teal-700",
          }
        }}
      />
    </div>
  )
}
```

### 5. User-button i header

```typescript
// apps/nextjs/src/components/header.tsx
import { UserButton } from '@clerk/nextjs'

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Myhrvoldgruppen Portal</h1>
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  )
}
```

---

## 🔒 Rollebasert tilgang

### Synkroniser Clerk-bruker med database

```typescript
// apps/nextjs/src/app/api/webhook/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@myhrvold/db'
import { users } from '@myhrvold/db/schema'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id!,
      'svix-timestamp': svix_timestamp!,
      'svix-signature': svix_signature!,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Webhook verification failed', { status: 400 })
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data
    
    await db.insert(users).values({
      email: email_addresses[0]?.email_address ?? '',
      firstName: first_name ?? '',
      lastName: last_name ?? '',
      oauthProvider: 'clerk',
      oauthId: id,
      role: 'user',
      isActive: true,
      isApproved: false,  // Må godkjennes av admin
    })
  }

  return new Response('OK', { status: 200 })
}
```

---

## 🇳🇴 Norsk lokalisering

Clerk støtter norsk bokmål (`nbNO`):

```typescript
import { nbNO } from '@clerk/localizations'

<ClerkProvider localization={nbNO}>
```

Dette gir:
- "Logg inn" i stedet for "Sign in"
- "Registrer deg" i stedet for "Sign up"
- "Glemt passord?" i stedet for "Forgot password?"
- Norske feilmeldinger

---

## 🎨 Tilpass Clerk-utseende

```typescript
// Matcher vårt design system
appearance={{
  variables: {
    colorPrimary: '#0d9488',        // Teal
    colorDanger: '#ef4444',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorNeutral: '#64748b',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '0.5rem',
  },
  elements: {
    card: 'shadow-lg border border-gray-200',
    formButtonPrimary: 'bg-teal-600 hover:bg-teal-700',
    footerActionLink: 'text-teal-600 hover:text-teal-700',
  }
}}
```

---

## ✅ Verifisering

1. Start dev server: `pnpm dev`
2. Gå til http://localhost:3000
3. Du skal bli redirectet til /sign-in
4. Registrer deg med e-post
5. Etter innlogging, sjekk at UserButton vises

---

## 📦 Leveranse

Når denne fasen er fullført har du:
- ✅ Clerk konfigurert for web
- ✅ Beskyttede ruter
- ✅ Norsk lokalisering
- ✅ Bruker-synkronisering til database
- ✅ Tilpasset utseende

---

## ➡️ Neste fase
[Fase 12: Auth mobil](./fase-12-auth-mobil.md)
