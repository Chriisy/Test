# Fase 20: Kommunikasjon

**Kategori:** 💻 WEB-PORTAL  
**Tid:** 4-5 timer  
**Prioritet:** 🟢 Medium  
**Avhengigheter:** Fase 19 fullført

---

## 🎯 Mål
Bygge kommunikasjonsmoduler: varslinger, team chat og forum.

---

## 📊 Moduler

### 1. Varslinger
- In-app notifikasjoner
- E-postvarslinger (konfigurerbart)
- Push (mobil)
- Varslingsinnstillinger per bruker

### 2. Team Chat
- Kanaler (generelt, service, salg)
- Direktemeldinger
- Filvedlegg
- @mentions

### 3. Forum
- Grupper/kategorier
- Innlegg og kommentarer
- Likes og reaksjoner

---

## 🔔 Varslinger

```typescript
// packages/db/src/schema/notifications.ts
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),  // claim_created, visit_scheduled, etc.
  title: text('title').notNull(),
  message: text('message'),
  link: text('link'),  // /claims/123
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// Varslingstyper
const notificationTypes = {
  claim_created: 'Ny reklamasjon',
  claim_updated: 'Reklamasjon oppdatert',
  claim_assigned: 'Reklamasjon tildelt deg',
  visit_scheduled: 'Nytt servicebesøk planlagt',
  comment_added: 'Ny kommentar',
}
```

### Varslings-dropdown
```typescript
// packages/ui/src/notifications-dropdown.tsx
export function NotificationsDropdown() {
  const { data: notifications } = api.notifications.getUnread.useQuery()
  const markAsRead = api.notifications.markAsRead.useMutation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications?.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="p-2 font-semibold border-b">Varslinger</div>
        {notifications?.map((n) => (
          <DropdownMenuItem key={n.id} onClick={() => markAsRead.mutate(n.id)}>
            <Link href={n.link} className="w-full">
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-gray-600">{n.message}</div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 💬 Team Chat (forenklet)

```typescript
// apps/nextjs/src/app/(dashboard)/chat/page.tsx
'use client'
import { useState } from 'react'
import { api } from '@/trpc/react'

export default function TeamChatPage() {
  const [message, setMessage] = useState('')
  const { data: messages } = api.chat.getMessages.useQuery({ channel: 'general' })
  const sendMessage = api.chat.send.useMutation()

  const handleSend = () => {
    sendMessage.mutate({ channel: 'general', content: message })
    setMessage('')
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Kanaler */}
      <div className="w-64 bg-gray-100 p-4">
        <h3 className="font-semibold mb-4">Kanaler</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-2 rounded bg-white"># generelt</button>
          <button className="w-full text-left p-2 rounded hover:bg-white"># service</button>
          <button className="w-full text-left p-2 rounded hover:bg-white"># salg</button>
        </div>
      </div>

      {/* Meldinger */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages?.map((msg) => (
            <div key={msg.id} className="mb-4">
              <div className="font-medium">{msg.user.firstName}</div>
              <div>{msg.content}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2">
          <Input 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Skriv en melding..."
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}
```

---

## ✅ Verifisering

1. Test varslinger i header
2. Test team chat
3. Test varslings-innstillinger

---

## 📦 Leveranse

- ✅ Varslingssystem
- ✅ Team chat med kanaler
- ✅ Varslings-innstillinger

---

## 🎉 Web-portal fullført!

Du har nå bygget hele web-portalen:
- Dashboard
- Reklamasjoner (liste, wizard, detaljer)
- Service (avtaler, besøk, partnere)
- Salg & Admin
- Kommunikasjon

---

## ➡️ Neste fase
[Fase 21: Expo Setup](./fase-21-expo-setup.md)
