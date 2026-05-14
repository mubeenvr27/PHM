/**
 * @/lib/stripe — Backward-compatible shim
 *
 * The actual implementation lives in the shared workspace package:
 *   packages/stripe/src/index.ts  →  @phm/stripe
 *
 * All existing imports of `@/lib/stripe` continue to work unchanged.
 * NEVER import this file from a client component ("use client").
 */
export { stripe } from '@phm/stripe';
export type { Stripe } from '@phm/stripe';
