# Priority Home Monitor (PHM) Platform

## Project Overview
Priority Home Monitor is a remote patient monitoring platform designed to serve as an information hub for patients and a lead-generation/referral engine for healthcare providers.

## Repository Structure

```text
PHM/
├── apps/
│   ├── web/                 # Next.js 14 App (Frontend + API Routes)
│   └── ai-engine/           # Python Backend (AWS Lambda / AI / RAG)
├── docs/                    # Technical Architecture & Business Requirements
├── infrastructure/          # Docker & Database Configuration
├── scripts/                 # Utility scripts
└── README.md
```

## Quick Start (Local Development)

### 1. Database Setup
Requires Docker Desktop.
```bash
cd infrastructure
docker-compose up -d
```

### 2. Frontend Setup
```bash
cd apps/web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Technical Architecture
For detailed specifications, refer to [docs/architecture.txt](docs/architecture.txt) or the PDF in the `docs/` folder.
