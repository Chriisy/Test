"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileWarning,
  Users,
  Building2,
  Truck,
  Wrench,
  Calendar,
  MapPin,
  Settings,
  Package,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Reklamasjoner", href: "/claims", icon: FileWarning },
  { name: "Kunder", href: "/customers", icon: Users },
  { name: "Leverandører", href: "/suppliers", icon: Building2 },
  { name: "Produkter", href: "/products", icon: Package },
  { name: "Installasjoner", href: "/installations", icon: Wrench },
  { name: "Transportskader", href: "/damages", icon: Truck },
  { name: "Serviceavtaler", href: "/agreements", icon: Calendar },
  { name: "Servicepartnere", href: "/partners", icon: MapPin },
  { name: "Innstillinger", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col bg-teal-800">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <span className="text-xl font-bold text-white">
          Myhrvold<span className="text-orange-400">gruppen</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-900 text-white"
                  : "text-teal-100 hover:bg-teal-700 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-teal-700 p-4">
        <p className="text-xs text-teal-300">
          Myhrvoldgruppen AS
          <br />
          Service Portal v1.0
        </p>
      </div>
    </aside>
  );
}
