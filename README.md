# Priority Home Monitor (PHM) â€” Monorepo

> **AWS-ready, npm-workspace monorepo** for the Priority Home Monitor remote patient monitoring platform.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?logo=stripe)](https://stripe.com)

---

## ðŸ“‚ Monorepo Structure

```
PHM/
â”œâ”€â”€ apps/
â”‚   â”œâ”€â”€ web/                        # Next.js 14 â€” Patient & Admin frontend
â”‚   â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”‚   â”œâ”€â”€ app/                # App Router pages & API routes
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ admin/          # Admin dashboard (leads, orders, analytics)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ api/            # REST endpoints + Stripe webhooks
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ shop/           # Device store
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ programs/       # Clinical program pages
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ checkout/       # Stripe checkout flow
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ contact/ refer/ # Lead capture forms
â”‚   â”‚   â”‚   â”œâ”€â”€ components/         # Reusable UI components
â”‚   â”‚   â”‚   â”œâ”€â”€ lib/                # Shims â†’ shared packages
â”‚   â”‚   â”‚   â””â”€â”€ store/              # Zustand client state (cart, checkout)
â”‚   â”‚   â”œâ”€â”€ .env.example            # Template â€” copy to .env.local
â”‚   â”‚   â””â”€â”€ package.json            # @phm/web
â”‚   â”œâ”€â”€ ai-service/                 # RAG pipeline (ingestion + retrieval)
â”‚   â””â”€â”€ backend/                    # Future standalone API service
â”‚
â”œâ”€â”€ packages/                       # Shared code (zero duplication)
â”‚   â”œâ”€â”€ database/                   # @phm/database â€” PostgreSQL pool + query helper
â”‚   â”œâ”€â”€ stripe/                     # @phm/stripe â€” Stripe server singleton
â”‚   â””â”€â”€ types/                      # @phm/types â€” All TypeScript interfaces & enums
â”‚
â”œâ”€â”€ infrastructure/
â”‚   â”œâ”€â”€ docker-compose.yml          # Local PostgreSQL 16 + pgvector
â”‚   â””â”€â”€ database/
â”‚       â”œâ”€â”€ schema.sql              # Core schema (leads, users, knowledge_chunks)
â”‚       â”œâ”€â”€ orders.sql              # Orders table + Stripe payment schema
â”‚       â””â”€â”€ test_data.sql           # Sample data for local development
â”‚
â”œâ”€â”€ scripts/
â”‚   â”œâ”€â”€ setup.ps1                   # Windows: Docker DB setup
â”‚   â””â”€â”€ setup.sh                    # Linux/macOS: Docker DB setup
â”‚
â”œâ”€â”€ docs/                           # Architecture PDFs and reference materials
â”œâ”€â”€ .env.example                    # All env var documentation for the monorepo
â”œâ”€â”€ .gitignore                      # Monorepo-wide (covers all apps & packages)
â””â”€â”€ package.json                    # npm workspaces root
```

---

## ðŸš€ Quick Start (Local Dev)

### Prerequisites
- Node.js â‰¥ 18, npm â‰¥ 9
- Docker Desktop (for local PostgreSQL)

### 1 â€” Install all dependencies (runs once for the entire repo)
```bash
npm install
```

### 2 â€” Start the database
```bash
cd infrastructure
docker-compose up -d
```

### 3 â€” Configure environment
```bash
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local with your Stripe test keys
```

### 4 â€” Start the dev server
```bash
npm run dev
# or: cd apps/web && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ðŸ“¦ Shared Packages

| Package | Import | Purpose |
|---------|--------|---------|
| `@phm/database` | `import { query } from '@phm/database'` | PostgreSQL connection pool singleton |
| `@phm/stripe` | `import { stripe } from '@phm/stripe'` | Server-side Stripe instance (never expose to client) |
| `@phm/types` | `import type { Lead, Order } from '@phm/types'` | All TypeScript interfaces â€” single source of truth |

> These packages are resolved locally via npm workspaces. No publishing to npm registry is needed.

---

## ðŸŒ Key Pages & API Endpoints

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero slideshow |
| `/programs/*` | 11 clinical program pages |
| `/shop` | Device shop (Care Bundles & Individual Devices) |
| `/checkout` | Stripe-powered checkout flow |
| `/contact` | Lead capture form |
| `/refer` | Provider referral form |
| `/admin/leads` | Admin: lead management table |
| `/admin/analytics` | Admin: analytics dashboard (Recharts) |
| `/admin/orders` | Admin: order management |
| `POST /api/contact` | Submit contact lead |
| `POST /api/refer` | Submit referral lead |
| `POST /api/checkout/create-intent` | Create Stripe PaymentIntent |
| `POST /api/webhooks/stripe` | Stripe event handler (paid/failed) |
| `GET /api/admin/leads` | Paginated lead list |
| `GET /api/admin/analytics` | High-performance aggregation |

---

## â˜ï¸ AWS Deployment Architecture

```
Internet â†’ CloudFront CDN
              â†“
       AWS Amplify (SSR)           â† Next.js standalone build
              â†“
       ECS / Lambda
              â†“
       AWS RDS (PostgreSQL 16)     â† Replace DATABASE_URL
       AWS Cognito                 â† JWT auth (Phase 4)
       AWS SES                     â† Order confirmation emails
       AWS Secrets Manager         â† STRIPE_SECRET_KEY, DB credentials
```

**Next.js is already configured for `output: "standalone"`** â€” the `.next/standalone/` directory contains everything needed for a lean Docker image or Amplify SSR deployment.

---

## ðŸ—„ï¸ Database Schema

### Core Tables
- **`leads`** â€” Patient and provider inquiries (type: referral | consultation | contact)
- **`orders`** â€” Stripe-backed device orders with JSONB line items
- **`admin_users`** â€” Cognito-linked admin accounts
- **`knowledge_chunks`** â€” pgvector embeddings for AI RAG queries
- **`cluster_centroids`** â€” Semantic cluster centroids for AI routing

### Schema Files
| File | Purpose |
|------|---------|
| `infrastructure/database/schema.sql` | Core schema with pgvector, ENUMs, indexes |
| `infrastructure/database/orders.sql` | Orders table and Stripe-related columns |
| `infrastructure/database/test_data.sql` | 10 sample leads for local testing |

---

## ðŸ” Security Status

| Layer | Local Dev | AWS Production |
|-------|-----------|----------------|
| Database auth | Docker default | RDS IAM + Secrets Manager |
| Admin routes | Unprotected | Cognito JWT verification |
| Stripe keys | `.env.local` | Amplify / Secrets Manager |
| HTTPS | localhost | CloudFront + ACM certificate |

---

## ðŸ§ª Testing

```bash
# Run all tests (from root)
npm run test

# API smoke test (Windows)
.\test-api.ps1

# API smoke test (Linux/macOS)
bash test-api.sh
```

---

## ðŸ“– Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | This file â€” monorepo overview |
| `VERIFICATION_CHECKLIST.md` | Feature verification checklist |
| `docs/PHM_Technical_Architecture_Plan_v4.pdf` | Full architecture specification |
| `apps/web/.env.example` | Environment variable reference |

---

**Architecture Version**: Revision 4 | April 2026  
**Stack**: Next.js 14 Â· TypeScript 5 Â· PostgreSQL 16 Â· Stripe Â· pgvector Â· Docker Â· AWS

