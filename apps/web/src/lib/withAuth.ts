/**
 * ============================================================
 * src/lib/withAuth.ts — Secured API Route Wrapper (HOF)
 * ============================================================
 *
 * Architecture Overview
 * ──────────────────────
 * This Higher-Order Function (HOF) wraps any Next.js 14 App Router
 * Route Handler and injects a full auth + RBAC pipeline BEFORE the
 * handler executes. The inner handler never runs if auth fails.
 *
 * Request Pipeline:
 *
 *   Incoming NextRequest
 *        │
 *        ▼
 *   ① Extract Authorization header            →  401 if missing
 *        │
 *        ▼
 *   ② Validate "Bearer <token>" format        →  400 if malformed
 *        │
 *        ▼
 *   ③ Decode / Verify JWT                     →  401 if invalid sig
 *        │                                         (mock now → Cognito later)
 *        ▼
 *   ④ Extract custom:role claim               →  401 if claim absent
 *        │
 *        ▼
 *   ⑤ hasPermission(role, requiredAction)     →  403 if denied
 *        │
 *        ▼
 *   ⑥ Invoke inner handler with AuthContext
 *
 * Usage Example:
 * ──────────────
 *   // src/app/api/admin/leads/route.ts
 *   import { withAuth } from "@/lib/withAuth";
 *
 *   export const GET = withAuth(
 *     { action: "view:leads" },
 *     async (req, { role }) => {
 *       // role is guaranteed valid and permitted here
 *       const leads = await fetchLeads();
 *       return NextResponse.json({ data: leads });
 *     }
 *   );
 */

import { NextRequest, NextResponse } from "next/server";
import { hasPermission, type Action, type Role } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

/**
 * Structured context injected into every protected handler.
 * Add additional decoded claim fields here as Cognito attributes expand.
 */
export interface AuthContext {
  /** The caller's role, already validated against the permission map. */
  role: Role;
  /** The raw Cognito `sub` (subject / user UUID). */
  sub: string;
  /** The caller's email from the `email` claim. */
  email: string;
  /** ISO-8601 token issue time (from `iat` claim). */
  issuedAt: string;
  /** ISO-8601 token expiry (from `exp` claim). */
  expiresAt: string;
}

/**
 * Shape of the decoded JWT payload we expect from Cognito.
 * All fields are typed as `unknown` initially because we cannot
 * trust the raw decoded payload — we validate each field explicitly.
 */
interface CognitoJwtPayload {
  sub?: unknown;
  email?: unknown;
  "custom:role"?: unknown;
  iat?: unknown;
  exp?: unknown;
  iss?: unknown;
  aud?: unknown;
  token_use?: unknown;
}

/**
 * Configuration for each protected route — the required action that
 * the caller's role must be permitted to perform.
 */
export interface WithAuthOptions {
  /**
   * The action required to access this route.
   * Passed directly to `hasPermission(role, action)`.
   *
   * @example
   *   { action: "export:leads" }   // only superadmin may export
   *   { action: "manage:products" } // superadmin + manager
   */
  action: Action;
}

/**
 * Signature of the inner handler function that withAuth wraps.
 * Identical to a Next.js Route Handler but receives AuthContext as a
 * second argument.
 */
export type AuthenticatedHandler = (
  req: NextRequest,
  ctx: AuthContext
) => Promise<NextResponse> | NextResponse;

// ─────────────────────────────────────────────────────────────
// ┌─────────────────────────────────────────────────────────────┐
// │  COGNITO JWT VERIFICATION — INTEGRATION POINT               │
// │                                                             │
// │  CURRENT STATE: Mock decoder (development / CI only)        │
// │                                                             │
// │  The function `decodeAndVerifyJwt()` below currently splits │
// │  the raw JWT and base64-decodes the payload. This provides  │
// │  structure but performs NO signature verification.          │
// │                                                             │
// │  ── REPLACE THIS BLOCK WHEN COGNITO IS PROVISIONED ──       │
// │                                                             │
// │  Step 1 — Install the AWS verifier library:                 │
// │    npm install aws-jwt-verify                               │
// │    (or: npm install jwks-rsa jsonwebtoken @types/jsonwebtoken)│
// │                                                             │
// │  Step 2 — Add env vars to .env.local / AWS Secrets:        │
// │    COGNITO_USER_POOL_ID=us-east-1_XXXXXXXX                  │
// │    COGNITO_APP_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX          │
// │    COGNITO_REGION=us-east-1                                 │
// │                                                             │
// │  Step 3 — Replace decodeAndVerifyJwt() with:               │
// │                                                             │
// │  import { CognitoJwtVerifier } from "aws-jwt-verify";       │
// │                                                             │
// │  const verifier = CognitoJwtVerifier.create({               │
// │    userPoolId: process.env.COGNITO_USER_POOL_ID!,           │
// │    tokenUse: "access",   // or "id" depending on your flow  │
// │    clientId: process.env.COGNITO_APP_CLIENT_ID!,            │
// │  });                                                        │
// │                                                             │
// │  async function decodeAndVerifyJwt(                         │
// │    token: string                                            │
// │  ): Promise<CognitoJwtPayload> {                            │
// │    // Verifies signature, expiry, issuer, and audience.     │
// │    // Throws CognitoJwtVerificationError on any failure.    │
// │    return verifier.verify(token) as Promise<CognitoJwtPayload>;│
// │  }                                                          │
// │                                                             │
// │  Step 4 — Remove the MOCK_JWT_WARN console.warn() call.     │
// │                                                             │
// │  Step 5 — Add token refresh logic if using ID tokens:       │
// │    The Cognito hosted UI issues short-lived (1h) ID tokens. │
// │    Handle token_use: "id" | "access" based on your Amplify  │
// │    or custom auth flow configuration.                       │
// │                                                             │
// │  Reference: https://github.com/awslabs/aws-jwt-verify       │
// └─────────────────────────────────────────────────────────────┘

/**
 * MOCK implementation — base64-decodes the JWT payload section
 * WITHOUT verifying the signature.
 *
 * This is intentionally unsafe and is only acceptable during development
 * before the Cognito User Pool is provisioned. The MOCK_JWT_WARN log
 * serves as a loud reminder that real verification is absent.
 *
 * @throws {Error} if the token does not have the expected 3-part structure
 *                 or if the payload is not valid JSON.
 */
async function decodeAndVerifyJwt(token: string): Promise<CognitoJwtPayload> {
  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "[withAuth] ⚠️  MOCK_JWT_WARN: JWT signature is NOT verified. " +
        "Replace decodeAndVerifyJwt() with aws-jwt-verify once Cognito is provisioned."
    );
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT does not have the expected 3-part (header.payload.signature) structure.");
  }

  const payloadBase64 = parts[1];
  // atob is available in the Next.js Edge / Node.js 18+ runtime.
  // For Node < 18, use: Buffer.from(payloadBase64, "base64").toString("utf-8")
  const payloadJson =
    typeof atob !== "undefined"
      ? atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
      : Buffer.from(payloadBase64, "base64url").toString("utf-8");

  let payload: CognitoJwtPayload;
  try {
    payload = JSON.parse(payloadJson) as CognitoJwtPayload;
  } catch {
    throw new Error("JWT payload is not valid JSON.");
  }

  // ── Mock expiry check ───────────────────────────────────────
  // Even in mock mode we honour the `exp` claim to prevent using
  // obviously stale tokens during development.
  if (typeof payload.exp === "number") {
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp < nowSec) {
      throw new Error(`JWT expired at ${new Date(payload.exp * 1000).toISOString()}.`);
    }
  }

  return payload;
}

// ─────────────────────────────────────────────────────────────
// JSON response helpers
// ─────────────────────────────────────────────────────────────

interface ErrorBody {
  success: false;
  error: string;
  code: string;
}

function errorResponse(
  message: string,
  code: string,
  status: 400 | 401 | 403 | 500
): NextResponse<ErrorBody> {
  return NextResponse.json<ErrorBody>(
    { success: false, error: message, code },
    { status }
  );
}

// ─────────────────────────────────────────────────────────────
// Main HOF — withAuth
// ─────────────────────────────────────────────────────────────

/**
 * Higher-Order Function that wraps a Next.js 14 App Router handler
 * with full JWT authentication and RBAC permission enforcement.
 *
 * Execution is terminated early (before the inner handler runs) if:
 *  - The `Authorization` header is absent                    → 401
 *  - The header value is not `Bearer <token>`               → 400
 *  - The JWT cannot be decoded / is expired                 → 401
 *  - The `custom:role` claim is absent or unrecognised      → 401
 *  - The role lacks permission for the required action       → 403
 *
 * On success, the inner handler receives the original `NextRequest`
 * plus a strongly-typed `AuthContext` containing the verified claims.
 *
 * @param options - Route-level configuration (required action).
 * @param handler - The inner handler to execute when auth passes.
 * @returns A standard Next.js Route Handler function.
 *
 * @example
 *   export const DELETE = withAuth(
 *     { action: "delete:leads" },
 *     async (req, { role, sub }) => {
 *       await deleteLead(id, { deletedBy: sub });
 *       return NextResponse.json({ success: true });
 *     }
 *   );
 */
export function withAuth(
  options: WithAuthOptions,
  handler: AuthenticatedHandler
): (req: NextRequest) => Promise<NextResponse> {
  return async function authGuard(req: NextRequest): Promise<NextResponse> {
    // ── Step ①: Presence check ─────────────────────────────
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return errorResponse(
        "Missing Authorization header. Provide a Bearer token.",
        "MISSING_AUTH_HEADER",
        401
      );
    }

    // ── Step ②: Format validation ──────────────────────────
    // RFC 6750 §2.1 — Bearer token MUST match: "Bearer <credentials>"
    // where <credentials> is one or more non-whitespace characters.
    const BEARER_RE = /^Bearer\s+(\S+)$/i;
    const match = BEARER_RE.exec(authHeader.trim());

    if (!match) {
      return errorResponse(
        "Malformed Authorization header. Expected format: 'Bearer <token>'.",
        "MALFORMED_BEARER_TOKEN",
        400
      );
    }

    const rawToken = match[1];

    // ── Step ③: Decode / Verify JWT ────────────────────────
    let payload: CognitoJwtPayload;
    try {
      payload = await decodeAndVerifyJwt(rawToken);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "JWT verification failed.";
      return errorResponse(
        `Invalid or expired token: ${message}`,
        "JWT_INVALID",
        401
      );
    }

    // ── Step ④: Extract custom:role claim ──────────────────
    const rawRole = payload["custom:role"];

    if (typeof rawRole !== "string" || rawRole.trim() === "") {
      return errorResponse(
        "Token is missing the required 'custom:role' claim. " +
          "Ensure the Cognito User Pool attribute is mapped to the ID/access token.",
        "MISSING_ROLE_CLAIM",
        401
      );
    }

    // ── Step ⑤: RBAC enforcement ───────────────────────────
    // hasPermission() is fail-closed: unknown roles → false.
    if (!hasPermission(rawRole, options.action)) {
      return errorResponse(
        `Role '${rawRole}' is not permitted to perform '${options.action}'.`,
        "FORBIDDEN",
        403
      );
    }

    // ── Step ⑥: Build AuthContext and delegate ─────────────
    const ctx: AuthContext = {
      role: rawRole as Role,
      sub:
        typeof payload.sub === "string" ? payload.sub : "unknown",
      email:
        typeof payload.email === "string" ? payload.email : "unknown",
      issuedAt:
        typeof payload.iat === "number"
          ? new Date(payload.iat * 1000).toISOString()
          : new Date().toISOString(),
      expiresAt:
        typeof payload.exp === "number"
          ? new Date(payload.exp * 1000).toISOString()
          : "unknown",
    };

    // All checks passed — execute the real handler.
    return handler(req, ctx);
  };
}
