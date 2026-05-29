-- =============================================================================
-- Priority Home Monitor (PHM) — Database Migration
-- File   : infrastructure/database/02_products_schema.sql
-- Target : Amazon RDS for PostgreSQL 16
-- Author : PHM Engineering
-- Date   : 2026-05-29
-- =============================================================================
--
-- PURPOSE
-- -------
-- Adds the product catalogue table required by the /admin/products UI.
-- Introduces the `product_stock_status` ENUM type and an auto-maintained
-- `updated_at` trigger so the application never needs to supply that
-- timestamp manually.
--
-- EXECUTION ORDER
-- ---------------
--   01_schema.sql          → leads, knowledge_chunks, admin_users
--   02_orders.sql          → orders, order_status ENUM
--   02_products_schema.sql ← THIS FILE (products, product_stock_status ENUM)
--
-- IDEMPOTENCY GUARANTEE
-- ---------------------
-- Every DDL statement in this file is safe to re-run on a database that
-- already has these objects.  Use of:
--   • DO $$ … END $$  blocks with IF NOT EXISTS checks for ENUM types
--     (PostgreSQL has no native CREATE TYPE … IF NOT EXISTS syntax)
--   • CREATE TABLE IF NOT EXISTS
--   • CREATE INDEX  IF NOT EXISTS
--   • CREATE OR REPLACE FUNCTION  for trigger functions
--   • DROP TRIGGER IF EXISTS / CREATE TRIGGER  for the trigger itself
--
-- HOW TO APPLY
-- ------------
-- Local Docker:
--   docker exec -i phm_db psql -U postgres -d phm \
--     < infrastructure/database/02_products_schema.sql
--
-- Amazon RDS (via bastion or psql directly):
--   psql "host=$RDS_HOST port=5432 dbname=phm user=phm_admin sslmode=require" \
--     -f infrastructure/database/02_products_schema.sql
--
-- ROLLBACK
-- --------
-- To undo this migration (data-destructive — use with caution):
--   DROP TABLE  IF EXISTS public.products CASCADE;
--   DROP TYPE   IF EXISTS public.product_stock_status CASCADE;
--   DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;
--
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
-- gen_random_uuid() lives in pgcrypto (PostgreSQL < 13) or is a built-in
-- in PostgreSQL 13+.  We enable pgcrypto defensively so this script works
-- on any PG version this project might target.
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ---------------------------------------------------------------------------
-- 1. ENUM Type — product_stock_status
-- ---------------------------------------------------------------------------
-- PostgreSQL does not support CREATE TYPE … IF NOT EXISTS natively, so we
-- use an anonymous DO block to check pg_type before attempting the CREATE.
-- This preserves idempotency without requiring a manual DROP.
--
-- Values:
--   'in_stock'    — Product is available for purchase / display.
--   'out_of_stock'— Product is visible but temporarily unavailable.
--   'archived'    — Product is hidden from the storefront and search;
--                   corresponds to the "archive" action in the admin UI.
--                   Records are NEVER hard-deleted — archiving is the
--                   permanent soft-delete mechanism.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
    -- Only create the type if it does not already exist in this schema.
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_type t
        JOIN   pg_namespace n ON n.oid = t.typnamespace
        WHERE  t.typname  = 'product_stock_status'
          AND  n.nspname  = 'public'
    ) THEN
        CREATE TYPE public.product_stock_status AS ENUM (
            'in_stock',
            'out_of_stock',
            'archived'
        );

        RAISE NOTICE 'Created ENUM type: public.product_stock_status';
    ELSE
        RAISE NOTICE 'ENUM type public.product_stock_status already exists — skipping.';
    END IF;
END
$$;


-- ---------------------------------------------------------------------------
-- 2. Trigger Function — set_updated_at()
-- ---------------------------------------------------------------------------
-- A shared, reusable trigger function that sets NEW.updated_at = NOW()
-- before any UPDATE.  Using CREATE OR REPLACE means this is always
-- idempotent and picks up any future definition changes.
--
-- This function is intentionally generic (no table dependency) so it can
-- be reused by any future table that also carries an updated_at column.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Guard: only update the timestamp if the row data actually changed.
    -- This prevents unnecessary index churn on no-op UPDATEs.
    IF NEW IS DISTINCT FROM OLD THEN
        NEW.updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at() IS
    'Generic BEFORE UPDATE trigger that refreshes updated_at to NOW(). '
    'Attach to any table with an updated_at TIMESTAMPTZ column.';


-- ---------------------------------------------------------------------------
-- 3. Table — products
-- ---------------------------------------------------------------------------
-- Column design notes:
--
--   id           — UUIDv4 generated by the database.  Never expose
--                  sequential integers to clients (IDOR risk).
--
--   name         — VARCHAR(255): aligns with the Zod schema max(100) on
--                  the admin UI side; the extra headroom in the DB allows
--                  future UI relaxations without a schema migration.
--
--   description  — TEXT (nullable): unbounded free text.  The admin UI
--                  enforces a 500-char soft-cap via Zod; the DB stores
--                  the raw value to preserve admin intent.
--
--   price        — NUMERIC(10, 2): exact decimal arithmetic.  Never use
--                  FLOAT for monetary values (binary floating-point errors).
--                  10 total digits, 2 decimal places → max $99,999,999.99.
--                  A CHECK constraint enforces the business rule that price
--                  must be strictly positive (mirrors Zod's .positive()).
--
--   stock_status — product_stock_status ENUM, NOT NULL.  DEFAULT 'in_stock'
--                  means newly inserted products are immediately visible.
--
--   image_url    — VARCHAR(1024): S3/CDN URL of the product image.
--                  1024 chars accommodates presigned URL query strings.
--                  Nullable because products may exist before an image is
--                  uploaded (the admin UI allows creation without an image).
--
--   created_at   — Set once at INSERT; never updated by the trigger.
--   updated_at   — Maintained automatically by the set_updated_at() trigger.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.products (

    -- Primary key
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Product identity
    name            VARCHAR(255)    NOT NULL,
    description     TEXT,

    -- Pricing — exact decimal, must be strictly positive
    price           NUMERIC(10, 2)  NOT NULL
                    CONSTRAINT products_price_positive CHECK (price > 0),

    -- Availability lifecycle
    stock_status    public.product_stock_status  NOT NULL DEFAULT 'in_stock',

    -- Media
    image_url       VARCHAR(1024),

    -- Audit timestamps
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()

);


-- ---------------------------------------------------------------------------
-- 4. Table Comments
-- ---------------------------------------------------------------------------
-- Inline documentation queried by \d+ in psql and surfaced by tools like
-- pgAdmin, DBeaver, and AWS RDS Performance Insights schema browsers.
-- ---------------------------------------------------------------------------

COMMENT ON TABLE public.products IS
    'Medical monitoring device catalogue managed via the PHM admin portal. '
    'Products are never hard-deleted; set stock_status = ''archived'' instead.';

COMMENT ON COLUMN public.products.id IS
    'UUID primary key, generated by the database via gen_random_uuid().';

COMMENT ON COLUMN public.products.name IS
    'Display name of the product. VARCHAR(255) to accommodate future UI changes '
    'beyond the current 100-char Zod limit.';

COMMENT ON COLUMN public.products.description IS
    'Long-form product description. Nullable; admin UI soft-caps at 500 chars via Zod.';

COMMENT ON COLUMN public.products.price IS
    'Sale price in USD. NUMERIC(10,2) for exact decimal arithmetic. '
    'Must be > 0 (enforced by CHECK constraint and Zod .positive()).';

COMMENT ON COLUMN public.products.stock_status IS
    'Lifecycle state: in_stock | out_of_stock | archived. '
    'Archived products are hidden from the storefront. Never DELETE rows; archive instead.';

COMMENT ON COLUMN public.products.image_url IS
    'S3 or CDN URL of the product image. Set after the presigned upload completes. '
    'VARCHAR(1024) to accommodate presigned URL query strings.';

COMMENT ON COLUMN public.products.created_at IS
    'UTC timestamp of row insertion. Set once; never modified by the trigger.';

COMMENT ON COLUMN public.products.updated_at IS
    'UTC timestamp of the most recent row modification. '
    'Automatically maintained by the products_set_updated_at trigger.';


-- ---------------------------------------------------------------------------
-- 5. Trigger — auto-update updated_at on every row change
-- ---------------------------------------------------------------------------
-- We DROP the trigger first (IF EXISTS) to make this block idempotent.
-- DROP + CREATE is safe here because the trigger definition itself does not
-- carry state — only the function body does, and that is handled by
-- CREATE OR REPLACE FUNCTION above.
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS products_set_updated_at ON public.products;

CREATE TRIGGER products_set_updated_at
    BEFORE UPDATE
    ON      public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TRIGGER products_set_updated_at ON public.products IS
    'Automatically refreshes updated_at to NOW() before any UPDATE, '
    'delegating to the shared public.set_updated_at() function.';


-- ---------------------------------------------------------------------------
-- 6. Indexes
-- ---------------------------------------------------------------------------
-- Covering the most common admin-portal query predicates:
--   • Filter by stock_status  (the table toolbar / status dropdown)
--   • Sort by created_at DESC (default newest-first ordering)
--   • Full-text search on name (future search feature)
--
-- All indexes are created IF NOT EXISTS so re-running is harmless.
-- ---------------------------------------------------------------------------

-- Used by: WHERE stock_status = 'in_stock' / 'out_of_stock' / 'archived'
CREATE INDEX IF NOT EXISTS idx_products_stock_status
    ON public.products (stock_status);

-- Used by: ORDER BY created_at DESC  (default listing order)
CREATE INDEX IF NOT EXISTS idx_products_created_at
    ON public.products (created_at DESC);

-- Used by: ORDER BY updated_at DESC  (recently modified listing)
CREATE INDEX IF NOT EXISTS idx_products_updated_at
    ON public.products (updated_at DESC);

-- Used by: ILIKE / pg_trgm name search (enable pg_trgm extension first if using)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_products_name_trgm
--     ON public.products USING gin (name gin_trgm_ops);


-- ---------------------------------------------------------------------------
-- 7. Verification queries
-- ---------------------------------------------------------------------------
-- Run these manually after applying the migration to confirm the schema
-- landed correctly.  They are intentionally read-only (SELECT / CAST).
-- ---------------------------------------------------------------------------

-- Confirm the ENUM values are what the application expects
SELECT
    enumlabel                   AS stock_status_value,
    enumsortorder               AS sort_order
FROM   pg_enum e
JOIN   pg_type t ON t.oid = e.enumtypid
JOIN   pg_namespace n ON n.oid = t.typnamespace
WHERE  t.typname  = 'product_stock_status'
  AND  n.nspname  = 'public'
ORDER  BY enumsortorder;

-- Confirm the table structure
SELECT
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM   information_schema.columns
WHERE  table_schema = 'public'
  AND  table_name   = 'products'
ORDER  BY ordinal_position;

-- Confirm trigger is attached
SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM   information_schema.triggers
WHERE  event_object_schema = 'public'
  AND  event_object_table  = 'products';

-- Confirm indexes
SELECT
    indexname,
    indexdef
FROM   pg_indexes
WHERE  schemaname = 'public'
  AND  tablename  = 'products'
ORDER  BY indexname;
