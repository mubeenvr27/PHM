import { Pool, QueryResult, QueryResultRow } from 'pg';

// Singleton connection pool
let pool: Pool | null = null;

/**
 * Get or create the PostgreSQL connection pool
 * Uses DATABASE_URL from environment variables
 */
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Log pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      if (pool) {
        await pool.end();
        console.log('PostgreSQL pool has ended');
      }
      process.exit(0);
    });
  }

  return pool;
}

/**
 * Execute a query with automatic connection management
 * Logs slow queries (>1000ms) for performance monitoring
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries
    if (duration > 1000) {
      console.warn('Slow query detected:', {
        text,
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', {
      text,
      params,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}
