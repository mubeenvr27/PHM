/**
 * @phm/types — Centralized TypeScript type definitions
 *
 * All interfaces in this file are the single source of truth for:
 *   - apps/web (Next.js)
 *   - apps/ai-service (Python/TS bridge)
 *   - Any future mobile apps
 *
 * Keep this file free of runtime dependencies. Types only.
 */

// ─── Database ENUM mirrors ────────────────────────────────────────────────────

export type LeadType = 'referral' | 'consultation' | 'contact';
export type LeadStatus = 'new' | 'contacted' | 'enrolled' | 'closed';
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type AdminRole = 'admin' | 'superadmin';

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string;                  // UUID
  type: LeadType;
  patient_name: string;
  provider_name: string | null;
  phone: string | null;
  email: string;
  condition_interest: string | null;
  message: string | null;
  source_page: string | null;
  status: LeadStatus;
  created_at: string;          // ISO 8601 timestamp string from DB
}

export interface LeadFilters {
  type?: LeadType;
  status?: LeadStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LeadListResponse {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface LineItem {
  id: string;        // product slug, e.g. "bt-bp-cuff"
  name: string;
  quantity: number;
  unit_price_cents: number;
}

export interface Order {
  id: string;                          // UUID
  stripe_payment_intent_id: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  shipping_method: string;
  shipping_cents: number;
  subtotal_cents: number;
  total_cents: number;
  line_items: LineItem[];
  created_at: string;
  updated_at: string;
}

// ─── Product Catalog ──────────────────────────────────────────────────────────

export interface Product {
  id: string;             // slug, matches PRODUCT_PRICES_CENTS keys
  name: string;
  description: string;
  price_cents: number;
  category: 'device' | 'bundle';
  image_url?: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DailyLeadCount {
  date: string;   // "YYYY-MM-DD"
  count: number;
}

export interface StatusBreakdown {
  status: LeadStatus;
  count: number;
}

export interface ProgramDistribution {
  condition: string;
  count: number;
}

export interface AnalyticsSummary {
  totalLeads: number;
  newLeads: number;
  enrollmentRate: number;
  activeReferrals: number;
  dailyCounts: DailyLeadCount[];
  statusBreakdown: StatusBreakdown[];
  programDistribution: ProgramDistribution[];
}

// ─── Admin User ───────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;          // UUID
  cognito_sub: string;
  email: string;
  role: AdminRole;
  created_at: string;
  last_login: string | null;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  code?: string;
}

export interface ApiSuccess<T = void> {
  data?: T;
  message?: string;
}
