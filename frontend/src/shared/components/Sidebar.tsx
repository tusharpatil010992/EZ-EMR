"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { logoutAction } from "@/modules/auth/actions/auth.actions";

type Role = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "STAFF";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    { href: "/super-admin/tenants", label: "Tenants", icon: "⬡" },
    { href: "/super-admin/subscription-plans", label: "Subscription Plans", icon: "◈" },
  ],
  ADMIN: [
    { href: "/dashboard", label: "Dashboard", icon: "⊞" },
    { href: "/patients", label: "Patients", icon: "○" },
    { href: "/patients/new", label: "Register Patient", icon: "+" },
    { href: "/appointments", label: "Appointments", icon: "▦" },
    { href: "/walk-in-queue", label: "Walk-in Queue", icon: "▷" },
    { href: "/admin/users", label: "Users", icon: "◉" },
    { href: "/subscription", label: "Subscription", icon: "◈" },
  ],
  DOCTOR: [
    { href: "/doctor/appointments", label: "My Appointments", icon: "▦" },
    { href: "/walk-in-queue", label: "Walk-in Queue", icon: "▷" },
  ],
  STAFF: [
    { href: "/appointments", label: "Appointments", icon: "▦" },
    { href: "/appointments/new", label: "Book Appointment", icon: "+" },
    { href: "/walk-in-queue", label: "Walk-in Queue", icon: "▷" },
    { href: "/patients", label: "Patients", icon: "○" },
    { href: "/patients/new", label: "Register Patient", icon: "+" },
  ],
};

interface SidebarProps {
  role: Role;
  userEmail?: string;
}

export function Sidebar({ role, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.ADMIN;

  return (
    <aside className="flex h-full w-56 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <span className="text-sm font-bold text-blue-600 tracking-wide">EZ-EMR</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="w-4 text-center text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200 px-4 py-3">
        {userEmail && <p className="mb-2 truncate text-xs text-gray-400">{userEmail}</p>}
        <button
          disabled={pending}
          onClick={() => startTransition(() => logoutAction())}
          className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
