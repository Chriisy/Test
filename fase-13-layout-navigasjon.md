# Fase 13: Layout & Navigasjon

**Kategori:** 💻 WEB-PORTAL  
**Tid:** 4-5 timer  
**Prioritet:** 🔴 Kritisk  
**Avhengigheter:** Fase 11 fullført

---

## 🎯 Mål
Bygge hovedlayout med sidebar-navigasjon i vårt Nordic Professional design.

---

## 🎨 Design-spesifikasjoner

### Farger
```css
--sidebar-bg: #0d9488;        /* Teal */
--sidebar-hover: #0f766e;
--sidebar-text: #ffffff;
--accent: #f97316;            /* Orange */
--content-bg: #f8fafc;
```

### Layout
- Sidebar: 280px bredde (kollapsbar til 80px)
- Topbar: 64px høyde
- Hovedinnhold: Resten av skjermen

---

## 📄 Komponenter

### Sidebar
```typescript
// packages/ui/src/sidebar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileWarning, 
  Users, 
  Building2,
  Wrench,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/claims', icon: FileWarning, label: 'Reklamasjoner' },
  { href: '/customers', icon: Users, label: 'Kunder' },
  { href: '/suppliers', icon: Building2, label: 'Leverandører' },
  { href: '/service', icon: Wrench, label: 'Service' },
  { href: '/installations', icon: Truck, label: 'Installasjoner' },
  { href: '/settings', icon: Settings, label: 'Innstillinger' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-teal-600 text-white
      transition-all duration-300
      ${collapsed ? 'w-20' : 'w-72'}
    `}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && <span className="text-xl font-bold">Myhrvoldgruppen</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-teal-700 rounded">
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                transition-colors
                ${isActive ? 'bg-teal-700 text-white' : 'hover:bg-teal-700/50'}
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

### Topbar
```typescript
// packages/ui/src/topbar.tsx
import { UserButton } from '@clerk/nextjs'
import { Bell, Search } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Søk */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Søk etter kunder, reklamasjoner..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Høyre side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full" />
        </button>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  )
}
```

### Layout-wrapper
```typescript
// apps/nextjs/src/app/(dashboard)/layout.tsx
import { Sidebar } from '@myhrvold/ui/sidebar'
import { Topbar } from '@myhrvold/ui/topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-72 transition-all duration-300">
        <Topbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## 📱 Responsivt design

### iPad/Tablet (768-1024px)
- Sidebar kan kollapses
- 2-kolonne grids

### Mobil (<768px)
- Sidebar skjult, hamburger-meny
- 1-kolonne layout
- Bottom navigation (vurderes)

---

## ✅ Verifisering

1. Start dev server: `pnpm dev`
2. Sjekk at sidebar vises
3. Klikk på menypunkter
4. Kollaps sidebar
5. Test på ulike skjermstørrelser

---

## 📦 Leveranse

- ✅ Sidebar med navigasjon
- ✅ Topbar med søk og bruker
- ✅ Responsivt layout
- ✅ Nordic Professional design

---

## ➡️ Neste fase
[Fase 14: Dashboard](./fase-14-dashboard.md)
