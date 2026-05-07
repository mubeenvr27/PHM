# PHM Admin Dashboard - Quick Start

## 🚀 One-Command Setup

### 1. Start PostgreSQL Container
```bash
docker run --name phm-postgres -e POSTGRES_DB=phm -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### 2. Apply Database Schema
```bash
docker exec -i phm-postgres psql -U postgres -d phm < schema.sql
```

### 3. (Optional) Insert Test Data
```bash
docker exec -i phm-postgres psql -U postgres -d phm < test_data.sql
```

### 4. Start Next.js Development Server
```bash
cd apps/web
npm run dev
```

## 🧪 Quick API Tests

### Get All Leads
```bash
curl http://localhost:3000/api/admin/leads
```

### Filter by Status
```bash
curl "http://localhost:3000/api/admin/leads?status=new"
```

### Filter by Type
```bash
curl "http://localhost:3000/api/admin/leads?type=referral"
```

### Get Single Lead (replace UUID)
```bash
curl http://localhost:3000/api/admin/leads/YOUR-UUID-HERE
```

### Update Lead Status (replace UUID)
```bash
curl -X PATCH http://localhost:3000/api/admin/leads/YOUR-UUID-HERE \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

## 📊 Database Quick Access

### Connect to Database
```bash
docker exec -it phm-postgres psql -U postgres -d phm
```

### Useful SQL Commands
```sql
-- View all leads
SELECT * FROM leads ORDER BY created_at DESC;

-- Count by status
SELECT status, COUNT(*) FROM leads GROUP BY status;

-- Count by type
SELECT type, COUNT(*) FROM leads GROUP BY type;

-- Get a UUID for testing
SELECT id FROM leads LIMIT 1;
```

## 🛑 Stop/Remove Container

### Stop Container
```bash
docker stop phm-postgres
```

### Remove Container
```bash
docker rm phm-postgres
```

### Restart Container
```bash
docker start phm-postgres
```

## ✅ Implementation Checklist

- [x] PostgreSQL 16 Docker container
- [x] Database schema with ENUMs (lead_type, lead_status)
- [x] Leads table with all required columns
- [x] Database connection utility (src/lib/db.ts)
- [x] GET /api/admin/leads (with filtering & pagination)
- [x] GET /api/admin/leads/[id]
- [x] PATCH /api/admin/leads/[id]
- [x] JWT verification placeholders (Phase 4)
- [x] CloudWatch logging placeholders (Phase 4)
- [x] No ORM - native pg package only
- [x] Connection pooling (max 20 clients)
- [x] Error handling and logging
- [x] UUID validation
- [x] Test data for development

## 📁 Files Created

```
PHM/
├── schema.sql                                    # Database schema
├── test_data.sql                                 # Sample test data
├── SETUP_GUIDE.md                                # Detailed setup guide
├── QUICK_START.md                                # This file
└── apps/web/
    ├── .env.local                                # DATABASE_URL configured
    ├── src/
    │   ├── lib/
    │   │   └── db.ts                             # Database connection utility
    │   └── app/
    │       └── api/
    │           └── admin/
    │               └── leads/
    │                   ├── route.ts              # GET all leads
    │                   └── [id]/
    │                       └── route.ts          # GET/PATCH single lead
```

## 🔐 Security Notes

- **Current State**: No authentication (development only)
- **Phase 4**: Will implement AWS Cognito JWT verification
- **TODO Comments**: Marked in code for future implementation
- **Production**: Never expose these endpoints without authentication

## 📖 Architecture Compliance

This implementation strictly follows:
- **Priority Home Monitor | Technical Architecture — Revision 4 | April 2026**
- No ORM requirement (native pg only)
- Exact schema matching architecture document
- JWT placeholders for Phase 4 integration
