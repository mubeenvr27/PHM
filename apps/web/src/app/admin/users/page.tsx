"use client";

/**
 * ============================================================
 * /admin/users — Superadmin User Management Page
 * ============================================================
 * Access Control: This route is strictly for superadmin users only.
 * State: All user data is held in local React state (mock).
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  TODO — AWS COGNITO USER POOL INTEGRATION POINT             │
 * │                                                             │
 * │  When AWS Cognito is provisioned, replace the mock state    │
 * │  with real API calls:                                       │
 * │                                                             │
 * │  LIST USERS:                                                │
 * │  import { CognitoIdentityProviderClient,                    │
 * │           ListUsersCommand } from "@aws-sdk/client-cognito  │
 * │           -identity-provider";                              │
 * │  const client = new CognitoIdentityProviderClient({...});   │
 * │  await client.send(new ListUsersCommand({                   │
 * │    UserPoolId: process.env.COGNITO_USER_POOL_ID             │
 * │  }));                                                       │
 * └─────────────────────────────────────────────────────────────┘
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Users,
  PackageSearch,
  ShoppingBag,
  BarChart3,
  ListTodo,
  PlusCircle,
  UserCheck,
  UserX,
  ShieldCheck,
  Shield,
  Mail,
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

// ── Shadcn Components ─────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type UserRole = "admin" | "superadmin";
type UserStatus = "active" | "inactive";

interface StaffUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  last_login: string;
}

// ─────────────────────────────────────────────────────────────
// Zod Schema — Invite User Form
// ─────────────────────────────────────────────────────────────
// Note: No password field. AWS Cognito adminCreateUser generates
// a temporary password and sends it to the user's email automatically.
const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  role: z.enum(["admin", "superadmin"], {
    required_error: "Please select a role.",
  }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

// ─────────────────────────────────────────────────────────────
// Seed Data — mock staff users
// ─────────────────────────────────────────────────────────────
const SEED_USERS: StaffUser[] = [
  {
    id: "usr_001",
    email: "admin@phm.com",
    role: "superadmin",
    status: "active",
    last_login: "2026-06-01T08:14:00Z",
  },
  {
    id: "usr_002",
    email: "staff@phm.com",
    role: "admin",
    status: "active",
    last_login: "2026-05-30T16:40:00Z",
  },
];

// ─────────────────────────────────────────────────────────────
// Badge Helpers
// ─────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: UserRole }) {
  if (role === "superadmin") {
    return (
      <Badge
        variant="outline"
        className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50 gap-1"
      >
        <ShieldCheck size={12} />
        Superadmin
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50 gap-1"
    >
      <Shield size={12} />
      Admin
    </Badge>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === "active") {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
      >
        Active
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100"
    >
      Inactive
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────
// Invite User Dialog
// ─────────────────────────────────────────────────────────────
interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (values: InviteFormValues) => void;
}

function InviteUserDialog({ open, onOpenChange, onInvite }: InviteDialogProps) {
  const form = useForm<InviteFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(inviteSchema) as any,
    defaultValues: {
      email: "",
      role: undefined,
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) form.reset();
    onOpenChange(nextOpen);
  };

  const handleSubmit = form.handleSubmit((values) => {
    onInvite(values);
    handleOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Invite New Staff Member</DialogTitle>
          <DialogDescription>
            An invitation email with a temporary password will be sent via AWS
            Cognito when the backend is provisioned. No password is set here.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="invite-user-form"
            onSubmit={handleSubmit}
            className="space-y-5 py-2"
          >
            {/* ── Email ── */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      id="invite-email-input"
                      type="email"
                      placeholder="staff@phm.com"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Role ── */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <div>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="invite-role-trigger"
                          className="w-full h-10"
                        >
                          <SelectValue placeholder="Select a role…" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Superadmin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── No Password Field ── */}
            {/* ================================================================
                NOTE: Intentionally no Password field.
                AWS Cognito's adminCreateUser API auto-generates a temporary
                password and sends it to the user's email via SES.
                The user is then required to change it on first sign-in.
                ================================================================ */}
          </form>
        </Form>

        <DialogFooter>
          <Button
            id="invite-user-submit-btn"
            type="submit"
            form="invite-user-form"
            className="bg-[#1B3A5C] hover:bg-[#162f4a] text-white gap-2"
          >
            <Mail size={15} />
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const pathname = usePathname();

  // ── Mock user state ─────────────────────────────────────────
  const [users, setUsers] = useState<StaffUser[]>(SEED_USERS);

  // ── Dialog state ────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);

  // ── Optimistic status toggle ────────────────────────────────
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  // ── Invite handler ──────────────────────────────────────────
  const handleInvite = (values: InviteFormValues) => {
    /* ======================================================================
       TODO: AWS COGNITO adminCreateUser INTEGRATION POINT
       ======================================================================
       Replace this mock logic with a server action or API route that calls:

       import { CognitoIdentityProviderClient,
                AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider";

       const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

       await client.send(new AdminCreateUserCommand({
         UserPoolId: process.env.COGNITO_USER_POOL_ID,
         Username: values.email,
         UserAttributes: [
           { Name: "email", Value: values.email },
           { Name: "email_verified", Value: "true" },
           { Name: "custom:role", Value: values.role },
         ],
         DesiredDeliveryMediums: ["EMAIL"],
         // Cognito auto-generates a temporary password and emails it.
       }));

       After the API call succeeds, refetch the user list from Cognito
       to keep the table in sync instead of patching local state.
       ====================================================================== */

    // Mock: append new user to local state
    const newUser: StaffUser = {
      id: `usr_${Date.now()}`,
      email: values.email,
      role: values.role,
      status: "active",
      last_login: "—",
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Page Header & Navigation ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B3A5C]">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage internal staff accounts. Superadmin access only.
            </p>
          </div>

          {/* Admin nav tabs — role-aware via AdminNav */}
          <AdminNav />
        </div>

        {/* ── Table Card ── */}
        <div className="rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden">

          {/* Card toolbar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <p className="text-sm font-semibold text-[#1B3A5C]">
              {users.length} staff member{users.length !== 1 ? "s" : ""}
            </p>
            <Button
              id="open-invite-user-dialog-btn"
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2 bg-[#1B3A5C] hover:bg-[#162f4a] text-white"
            >
              <PlusCircle size={16} />
              Invite New Staff
            </Button>
          </div>

          {/* Data Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last Login
                </TableHead>
                <TableHead className="text-right pr-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Users size={40} className="opacity-30" />
                      <span className="text-sm">No staff users yet.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Email */}
                    <TableCell className="pl-6 font-medium text-[#1B3A5C]">
                      {user.email}
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>

                    {/* Last Login */}
                    <TableCell className="text-sm text-slate-500">
                      {user.last_login === "—"
                        ? "—"
                        : new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(user.last_login))}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-6">
                      <Button
                        id={`toggle-status-btn-${user.id}`}
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className={`gap-1.5 text-xs font-semibold transition-all ${
                          user.status === "active"
                            ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                        }`}
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX size={13} />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck size={13} />
                            Activate
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── No Delete Policy Notice ── */}
        <p className="text-xs text-slate-400 text-center">
          Staff accounts cannot be deleted. Use &ldquo;Deactivate&rdquo; to
          revoke access while preserving the audit trail.
        </p>
      </div>

      {/* ── Invite User Dialog ── */}
      <InviteUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onInvite={handleInvite}
      />
    </div>
  );
}
