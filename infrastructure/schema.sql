CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE lead_type AS ENUM ('referral', 'consultation', 'contact');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'enrolled', 'closed');
CREATE TYPE admin_role AS ENUM ('superadmin', 'admin', 'manager', 'user');

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type lead_type NOT NULL,
  patient_name VARCHAR(100) NOT NULL,
  provider_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  condition_interest VARCHAR(100),
  message TEXT,
  source_page VARCHAR(255),
  status lead_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_doc VARCHAR(255) NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1024) NOT NULL,
  cluster_tag VARCHAR(2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cluster_centroids (
  cluster_tag VARCHAR(2) PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  centroid VECTOR(1024) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cognito_sub VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  role admin_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Products schema (soft delete / active catalog)
CREATE TYPE product_stock_status AS ENUM ('in_stock', 'out_of_stock', 'archived');
CREATE TYPE product_type AS ENUM ('individual', 'bundle');

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CONSTRAINT products_price_positive CHECK (price > 0),
  stock_status product_stock_status NOT NULL DEFAULT 'in_stock',
  type product_type NOT NULL DEFAULT 'individual',
  image_url VARCHAR(1024),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

