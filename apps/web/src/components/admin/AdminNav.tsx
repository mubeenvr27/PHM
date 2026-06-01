"use client";

/**
 * AdminNav — Shared Admin Navigation Pill
 * =========================================
 * Client Component that reads the mock_admin_token cookie at runtime to
 * determine which navigation items are visible for the current role.
 *
 * RBAC Visibility Rule:
 *  - "Users" tab is ONLY rendered when role === "superadmin".
 *  - For admin, manager, and user roles the tab is completely absent from
 *    the DOM (not just hidden via CSS) to prevent information disclosure.
 *
 * Cookie is read via document.cookie because this component is used inside
 * pages that are already "use client" boundaries (products, leads, users).
 * For a fully server-rendered layout, the role would be passed as a prop
 * from a parent Server Component reading next/headers cookies() instead.
 *
 * TODO: When Cognito is live, role will come from the Cognito session.
 * Replace document.cookie parsing with a call to Auth.currentSession()
 * or decode the id_token JWT to extract the custom:role claim.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ListTodo,
  ShoppingBag,
  PackageSearch,
  BarChart3,
  Users,
} from "lucide-react";

export type AdminRole = "superadmin" | "admin" | "manager" | "user";

/** Parse a single cookie value from document.cookie by name. */
function getCookieValue(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

const NAV_LINK_BASE =
  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 min-h-0 min-w-0";
const NAV_LINK_ACTIVE = "bg-[#1B3A5C] text-white shadow-md";
const NAV_LINK_IDLE = "text-slate-500 hover:text-[#1B3A5C] hover:bg-slate-50";

function NavLink({
  href,
  icon: Icon,
  label,
  pathname,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  pathname: string;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<AdminRole>("user");

  // Read the role from the cookie after hydration
  useEffect(() => {
    const cookieRole = getCookieValue("mock_admin_token") as AdminRole | undefined;
    if (cookieRole) setRole(cookieRole);
  }, []);

  return (
    <div className="flex w-fit items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm overflow-x-auto gap-1">
      <NavLink href="/admin/leads"     icon={ListTodo}      label="Leads"     pathname={pathname} />
      <NavLink href="/admin/orders"    icon={ShoppingBag}   label="Orders"    pathname={pathname} />
      <NavLink href="/admin/products"  icon={PackageSearch} label="Products"  pathname={pathname} />
      <NavLink href="/admin/analytics" icon={BarChart3}     label="Analytics" pathname={pathname} />

      {/* ── RBAC: Only superadmin can see the Users management tab ──
          This element is conditionally rendered — it does NOT exist in the
          DOM at all for admin, manager, or user roles. */}
      {role === "superadmin" && (
        <NavLink href="/admin/users" icon={Users} label="Users" pathname={pathname} />
      )}
    </div>
  );
}
