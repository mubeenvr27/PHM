import { Pool, QueryResult, QueryResultRow } from 'pg';

// Singleton connection pool — one pool per process
let pool: Pool | null = null;

/**
 * Get or create the PostgreSQL connection pool.
 * Reads DATABASE_URL from the environment at runtime.
 * Works identically for local Docker, AWS RDS, and test environments.
 */
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        '[PHM/database] DATABASE_URL environment variable is not set. ' +
        'For local dev, copy apps/web/.env.example to apps/web/.env.local. ' +
        'For AWS, configure the environment variable in Amplify/ECS task definitions.'
      );
    }

    pool = new Pool({
      connectionString,
      max: 20,                     // Maximum concurrent clients
      idleTimeoutMillis: 30_000,   // Close idle clients after 30s
      connectionTimeoutMillis: 2_000,
    });

    // Surface any background pool errors to the runtime log
    pool.on('error', (err) => {
      console.error('[PHM/database] Unexpected error on idle PostgreSQL client:', err);
    });

    // Graceful shutdown: drain the pool when the process exits
    process.on('SIGINT', async () => {
      if (pool) {
        await pool.end();
        console.log('[PHM/database] PostgreSQL connection pool closed.');
      }
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      if (pool) {
        await pool.end();
        console.log('[PHM/database] PostgreSQL connection pool closed (SIGTERM).');
      }
      process.exit(0);
    });
  }

  return pool;
}

/**
 * Execute a parameterized query.
 * Logs slow queries (>1 000 ms) for CloudWatch / Datadog integration.
 *
 * @example
 * const res = await query<Lead>('SELECT * FROM leads WHERE id = $1', [id]);
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const client = getPool();
  const start = Date.now();

  try {
    const result = await client.query<T>(text, params);
    const duration = Date.now() - start;

    if (duration > 1_000) {
      console.warn('[PHM/database] Slow query detected:', {
        text,
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }

    return result;
  } catch (error) {
    console.error('[PHM/database] Query error:', {
      text,
      params,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}
