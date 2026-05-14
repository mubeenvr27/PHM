-- Orders table for Stripe checkout
-- Run: docker exec -i phm_db psql -U postgres -d phm < apps/web/src/sql/orders.sql

CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',

    -- Contact
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,

    -- Shipping address
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    country VARCHAR(2) NOT NULL DEFAULT 'US',

    -- Shipping method
    shipping_method VARCHAR(20) NOT NULL,
    shipping_cents INTEGER NOT NULL DEFAULT 0,

    -- Money (all in cents)
    subtotal_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL,

    -- Line items stored as JSONB for flexibility
    line_items JSONB NOT NULL DEFAULT '[]',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_stripe_pi ON orders(stripe_payment_intent_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
