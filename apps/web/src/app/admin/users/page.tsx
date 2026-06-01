/**
 * ============================================================
 * /admin/users — Server Component Gate (403 Enforcement)
 * ============================================================
 * This Server Component runs on every request to /admin/users.
 * It reads the mock_admin_token cookie from next/headers and
 * performs a hard, server-side role check BEFORE any client-side
 * JavaScript is executed or sent to the browser.
 *
 * Security Model:
 *  - The 403 Forbidden UI is rendered entirely server-side.
 *  - Non-superadmin users NEVER receive the UsersClient bundle.
 *  - This is defence-in-depth on top of the Next.js middleware
 *    (which handles overall /admin/* authentication) and the
 *    AdminNav RBAC (which hides the tab from the UI).
 *
 * TODO: When Cognito is live, replace cookie reading with JWT
 * verification. Decode the Cognito ID token from the Authorization
 * header or session cookie and extract the custom:role claim.
 */

import { cookies } from "next/headers";
import { ShieldX } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import UsersClient from "./UsersClient";

export default function AdminUsersPage() {
  const role = cookies().get("mock_admin_token")?.value;

  // ── Hard 403 Guard ───────────────────────────────────────────
  // If the role is anything other than "superadmin", render a
  // full-page Forbidden error. The UsersClient component and its
  // interactive state are never instantiated.
  if (role !== "superadmin") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <Card className="w-full max-w-lg border-red-200 shadow-xl text-center">
          <CardHeader className="pt-10 pb-4 flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border-2 border-red-100">
              <ShieldX size={40} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">
                Access Denied
              </p>
              <CardTitle className="text-4xl font-black text-red-600 tracking-tight">
                403 — Forbidden
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-10 space-y-4">
            <CardDescription className="text-base leading-relaxed text-slate-600 max-w-sm mx-auto">
              You do not have the required{" "}
              <span className="font-bold text-slate-800">Superadmin</span>{" "}
              clearance to view or manage staff accounts.
            </CardDescription>
            <p className="text-sm text-slate-400">
              If you believe this is an error, contact your system administrator.
            </p>
            <div className="pt-2">
              <a
                href="/admin/products"
                className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-[#1B3A5C] text-white text-sm font-semibold hover:bg-[#162f4a] transition-colors"
              >
                Return to Dashboard
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Authorised: render the interactive users management UI ──
  return <UsersClient />;
}
