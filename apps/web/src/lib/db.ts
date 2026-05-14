/**
 * @/lib/db — Backward-compatible shim
 *
 * The actual implementation lives in the shared workspace package:
 *   packages/database/src/index.ts  →  @phm/database
 *
 * All existing imports of `@/lib/db` continue to work unchanged.
 * This pattern allows a future mobile app or AI service to import
 * `@phm/database` directly without going through the Next.js app.
 */
export { getPool, query } from '@phm/database';
