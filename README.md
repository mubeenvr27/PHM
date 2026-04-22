# Priority Home Monitor (PHM)

## Project Overview
Priority Home Monitor (PHM) is an enterprise‑grade, HIPAA‑compliant remote‑patient‑monitoring platform. It provides a secure information hub for patients and families while delivering a high‑conversion lead‑generation and referral engine for healthcare providers. The system is built on a robust microservice architecture to ensure scalability, maintainability, and rapid feature delivery.

## Repository Structure

```text
PHM/
├── apps/
│   ├── web/          # Next.js 14 (App Router) – UI, client‑side routing, lightweight API routes for forms & SES emails
│   ├── backend/      # Standard backend – database migrations, utility APIs, server‑side operations (non‑AI)
│   └── ai-service/   # Python AWS Lambda services – Bedrock RAG pipeline, PDF ingestion, AI‑driven clinical analytics
├── docs/              # Technical architecture, design specifications, and business requirements
├── infrastructure/    # Docker Compose, PostgreSQL 16 + pgvector, and local dev environment scripts
├── scripts/           # Helper scripts (e.g., data import, CI utilities)
└── README.md          # This file – project overview and developer onboarding
```

## Quick Start (Local Development)

### 1️⃣ Database Setup
Requires Docker Desktop.
```bash
cd infrastructure
docker-compose up -d
```

### 2️⃣ Frontend Setup
```bash
cd apps/web
npm install
npm run dev
```
Open **http://localhost:3000** (or **http://localhost:3001** if port 3000 is occupied) to view the PHM routing test dashboard.

## Technical Architecture
PHM follows a **microservice‑oriented design**:
- **`apps/web`** – React/Next.js UI with server‑side rendering and API routes for form handling, protected by JWT‑based session management. UI components are built with Tailwind CSS, Shadcn/UI, and the Inter typeface.
- **`apps/backend`** – Node/TypeScript services handling data persistence, migrations (via Prisma), and ancillary non‑AI APIs. This layer communicates with PostgreSQL 16 + pgvector.
- **`apps/ai-service`** – Python‑based AWS Lambda functions orchestrating Bedrock LLM calls, vector similarity search, and PDF ingestion pipelines. Deployed via AWS SAM/Serverless framework.
- **`infrastructure`** – Docker‑compose orchestration of a local PostgreSQL instance mirroring the production environment, enabling end‑to‑end development without cloud dependencies.
- **`docs`** – Centralized source of truth for architecture diagrams, data models, compliance checklists, and stakeholder requirements.

All services are versioned together in a single Git repository, allowing coordinated releases while preserving clear boundaries between frontend, backend, and AI components.
