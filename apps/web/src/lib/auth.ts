/**
 * ============================================================
 * src/lib/auth.ts — Role-Based Access Control (RBAC)
 * ============================================================
 *
 * Separation of Concerns
 * ──────────────────────
 * This module is IDENTITY-AGNOSTIC. It knows nothing about JWTs,
 * Cognito, sessions, or HTTP. Its sole responsibility is answering:
 *
 *   "Is this role allowed to perform this action?"
 *
 * The Cognito identity layer lives in src/lib/withAuth.ts.
 * This split means you can unit-test permissions without any
 * network or auth infrastructure.
 *
 * Role Hierarchy (highest → lowest privilege)
 * ────────────────────────────────────────────
 *  superadmin  — unrestricted access to every action
 *  admin       — operational management of leads and product viewing
 *  manager     — product lifecycle management, no user/lead export access
 *  user        — read-only across all resources
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

/**
 * Exhaustive union of every role that can be stored in Cognito's
 * custom:role attribute. Add new roles here as the organisation grows.
 *
 * IMPORTANT: If a Cognito token carries a role string NOT in this union,
 * hasPermission() returns false by design — unknown roles are denied by
 * default (Fail-Closed / Principle of Least Privilege).
 */
export type Role = "superadmin" | "admin" | "manager" | "user";

/**
 * Every discrete action that can be performed across the system.
 * Granular action names use the format `<verb>:<resource>` so new
 * resources can be added without restructuring the permission map.
 *
 * Naming convention:
 *  view       — read / list operations
 *  create     — insert new records
 *  update     — mutate existing records
 *  delete     — hard delete records (rare; prefer archive)
 *  export     — bulk data extraction (higher-risk than view)
 *  manage     — full lifecycle control (create + update + delete/archive)
 */
export type Action =
  // ── Leads ────────────────────────────────────────────────
  | "view:leads"
  | "create:leads"
  | "update:leads"
  | "delete:leads"
  | "export:leads"
  // ── Products ─────────────────────────────────────────────
  | "view:products"
  | "create:products"
  | "update:products"
  | "delete:products"
  | "manage:products"
  // ── Orders ───────────────────────────────────────────────
  | "view:orders"
  | "update:orders"
  // ── Users / Admin Management ──────────────────────────────
  | "view:users"
  | "create:users"
  | "update:users"
  | "delete:users"
  | "manage:users"
  // ── Analytics ────────────────────────────────────────────
  | "view:analytics";

// ─────────────────────────────────────────────────────────────
// Permission Matrix
// ─────────────────────────────────────────────────────────────

/**
 * The single source-of-truth for all role → action mappings.
 *
 * Design decisions:
 * - Using a `ReadonlySet` per role makes lookup O(1) and prevents
 *   accidental mutation at runtime.
 * - `satisfies Record<Role, ReadonlySet<Action>>` ensures TypeScript
 *   flags any role or action typo at compile time while still allowing
 *   the inferred literal type to flow through.
 * - superadmin's set is intentionally built from the full Action union
 *   so adding a new Action automatically grants it to superadmin.
 */
const ALL_ACTIONS: ReadonlySet<Action> = new Set<Action>([
  "view:leads",
  "create:leads",
  "update:leads",
  "export:leads",
  "view:products",
  "create:products",
  "update:products",
  "manage:products",
  "view:orders",
  "update:orders",
  "view:users",
  "create:users",
  "update:users",
  "delete:users",
  "manage:users",
  "view:analytics",
]);

const PERMISSION_MAP = {
  /**
   * superadmin — Full system administration except hard deletes.
   * Automatically receives every action in ALL_ACTIONS.
   */
  superadmin: ALL_ACTIONS,

  /**
   * admin — Operational lead management + product management.
   * Can view and update leads, view and manage products/orders.
   * Cannot export leads, cannot manage users.
   */
  admin: new Set<Action>([
    "view:leads",
    "update:leads",
    "view:products",
    "manage:products",
    "view:orders",
    "update:orders",
    "view:analytics",
  ]),

  /**
   * manager — Product catalog management + lead read access.
   * Can view leads and products, manage products (create/update).
   * Explicitly CANNOT: update leads, export leads, or manage users.
   */
  manager: new Set<Action>([
    "view:leads",
    "view:products",
    "create:products",
    "update:products",
    "manage:products",
    "view:orders",
    "view:analytics",
  ]),

  /**
   * user — Strictly read-only across all resources.
   * No write, update, delete, export, or management capabilities.
   */
  user: new Set<Action>([
    "view:leads",
    "view:products",
    "view:orders",
  ]),
} as const satisfies Record<Role, ReadonlySet<Action>>;

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Determines whether a given role is authorised to perform an action.
 *
 * @param role   - The caller's role (typically decoded from a JWT claim).
 * @param action - The action being requested.
 * @returns `true` if permitted, `false` for any unknown role / action or
 *           if the role's permission set does not include the action.
 *
 * Security invariant — Fail-Closed:
 *   Any `role` value not present in the PERMISSION_MAP (e.g., a tampered
 *   or unrecognised token claim) returns `false` rather than throwing.
 *   This means the system defaults to DENY for anything it doesn't
 *   explicitly recognise, preventing privilege escalation through
 *   unknown role injection.
 *
 * @example
 *   hasPermission("admin", "view:leads")    // → true
 *   hasPermission("manager", "export:leads") // → false
 *   hasPermission("hacker" as Role, "manage:users") // → false
 */
export function hasPermission(role: string, action: string): boolean {
  // Validate role — unknown roles are denied by default (fail-closed).
  if (!isKnownRole(role)) return false;

  // Validate action — unknown actions are denied by default.
  if (!isKnownAction(action)) return false;

  return PERMISSION_MAP[role].has(action as Action);
}

// ─────────────────────────────────────────────────────────────
// Internal Type Guards
// ─────────────────────────────────────────────────────────────

/** Narrows an arbitrary string to the `Role` union. */
function isKnownRole(role: string): role is Role {
  return role in PERMISSION_MAP;
}

/** Narrows an arbitrary string to the `Action` union. */
function isKnownAction(action: string): action is Action {
  return ALL_ACTIONS.has(action as Action);
}

// ─────────────────────────────────────────────────────────────
// Convenience Re-exports
// ─────────────────────────────────────────────────────────────

/** All roles, useful for Zod schemas and UI dropdowns. */
export const ROLES: ReadonlyArray<Role> = [
  "superadmin",
  "admin",
  "manager",
  "user",
] as const;

/** All actions, useful for building admin permission editors. */
export const ACTIONS: ReadonlyArray<Action> = Array.from(
  ALL_ACTIONS
) as ReadonlyArray<Action>;
