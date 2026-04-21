# Priority Home Monitor (PHM)

## Overview

This is the **Priority Home Monitor** web platform — a Next.js 14 (App Router) application serving as an information hub for patients and families, and a lead-generation and referral engine for healthcare providers.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Icons:** Lucide React
- **Database:** PostgreSQL 16 with pgvector (local Docker)

## Project Structure

```
src/app/
├── page.tsx                          # Home — Routing Test Dashboard
├── programs/
│   ├── page.tsx                      # All Programs
│   ├── copd/page.tsx                 # COPD — Respiratory Care
│   ├── hypertension/page.tsx         # Hypertension Monitoring
│   ├── ccm/
│   │   ├── diabetes/page.tsx         # Diabetes — CCM
│   │   └── heart-failure/page.tsx    # Heart Failure — CCM
│   ├── osa/page.tsx                  # Obstructive Sleep Apnea
│   ├── sleep/
│   │   ├── pediatric/page.tsx        # Pediatric Sleep Monitoring
│   │   ├── adult/page.tsx            # Adult Sleep Monitoring
│   │   └── ent/page.tsx              # ENT Sleep Program
│   ├── wellness/page.tsx             # Wellness
│   ├── nutrition/diet/meals/page.tsx  # Prepared Meal Program
│   └── fall-detection/page.tsx       # Fall Detection
├── contact/page.tsx                  # Contact Us
├── refer/page.tsx                    # Refer a Patient
└── platform/page.tsx                 # Platform Demo Request
```

## Local Development

```bash
# Install dependencies
npm install

# Start local PostgreSQL (requires Docker)
docker-compose up -d

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the routing test dashboard.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values. See the architecture document for details.
