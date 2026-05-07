# PHM Admin Dashboard - Backend Setup

Complete backend implementation for the Priority Home Monitor (PHM) Admin Dashboard, following the **Technical Architecture — Revision 4 | April 2026** specifications.

## 🎯 What's Included

This implementation provides a complete backend infrastructure for managing patient and provider leads:

- ✅ PostgreSQL 16 database in Docker
- ✅ Strict schema with ENUMs and proper indexing
- ✅ Native `pg` connection pooling (NO ORM)
- ✅ Three REST API endpoints for lead management
- ✅ JWT authentication placeholders (Phase 4)
- ✅ CloudWatch logging placeholders (Phase 4)
- ✅ Test data and comprehensive documentation

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

**Windows PowerShell:**
```powershell
.\setup.ps1
```

**Linux/Mac/WSL/Git Bash:**
```bash
bash setup.sh
```

### Option 2: Manual Setup

1. **Start PostgreSQL:**
   ```bash
   docker run --name phm-postgres -e POSTGRES_DB=phm -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
   ```

2. **Apply Schema:**
   ```bash
   docker exec -i phm-postgres psql -U postgres -d phm < schema.sql
   ```

3. **Insert Test Data (Optional):**
   ```bash
   docker exec -i phm-postgres psql -U postgres -d phm < test_data.sql
   ```

4. **Start Development Server:**
   ```bash
   cd apps/web
   npm run dev
   ```

## 📁 Project Structure

```
PHM/
├── schema.sql                                    # PostgreSQL schema with ENUMs
├── test_data.sql                                 # Sample test data (10 leads)
├── setup.ps1                                     # Windows PowerShell setup script
├── setup.sh                                      # Linux/Mac/WSL setup script
├── QUICK_START.md                                # Quick reference commands
├── SETUP_GUIDE.md                                # Detailed setup instructions
├── IMPLEMENTATION_SUMMARY.md                     # Complete implementation details
└── apps/web/
    ├── .env.local                                # DATABASE_URL configured
    ├── package.json                              # pg & @types/pg installed
    └── src/
        ├── lib/
        │   └── db.ts                             # Database connection utility
        └── app/
            └── api/
                └── admin/
                    └── leads/
                        ├── route.ts              # GET /api/admin/leads
                        └── [id]/
                            └── route.ts          # GET/PATCH /api/admin/leads/[id]
```

## 🔌 API Endpoints

### 1. GET /api/admin/leads
Fetch all leads with filtering and pagination.

**Query Parameters:**
- `type`: Filter by lead type (referral, consultation, contact)
- `status`: Filter by status (new, contacted, enrolled, closed)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Example:**
```bash
curl "http://localhost:3000/api/admin/leads?status=new&page=1&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. GET /api/admin/leads/[id]
Fetch a single lead by UUID.

**Example:**
```bash
curl http://localhost:3000/api/admin/leads/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "referral",
    "patient_name": "John Smith",
    "provider_name": "Dr. Sarah Johnson",
    "phone": "555-0101",
    "email": "john.smith@email.com",
    "condition_interest": "Heart Failure Monitoring",
    "message": "Patient has history of CHF...",
    "source_page": "/programs/heart-failure",
    "status": "new",
    "created_at": "2026-05-07T10:30:00Z"
  }
}
```

### 3. PATCH /api/admin/leads/[id]
Update lead status.

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/admin/leads/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Lead status updated successfully"
}
```

## 🗄️ Database Schema

### ENUMs
- **lead_type**: `'referral' | 'consultation' | 'contact'`
- **lead_status**: `'new' | 'contacted' | 'enrolled' | 'closed'`

### Leads Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| type | lead_type | NOT NULL |
| patient_name | VARCHAR(255) | NOT NULL |
| provider_name | VARCHAR(255) | NULL |
| phone | VARCHAR(50) | NULL |
| email | VARCHAR(255) | NULL |
| condition_interest | VARCHAR(255) | NULL |
| message | TEXT | NULL |
| source_page | VARCHAR(255) | NULL |
| status | lead_status | NOT NULL, DEFAULT 'new' |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP |

### Indexes
- `idx_leads_status` on status
- `idx_leads_type` on type
- `idx_leads_created_at` on created_at DESC
- `idx_leads_email` on email

## 🔧 Database Connection

The `db.ts` utility provides:
- Singleton connection pool (max 20 clients)
- Automatic connection management
- Slow query logging (>1000ms)
- Error handling and logging
- Graceful shutdown on SIGINT

**Usage:**
```typescript
import { query } from '@/lib/db';

const result = await query('SELECT * FROM leads WHERE status = $1', ['new']);
```

## 🧪 Testing

### Quick Test Commands

```bash
# Get all leads
curl http://localhost:3000/api/admin/leads

# Filter by status
curl "http://localhost:3000/api/admin/leads?status=new"

# Filter by type
curl "http://localhost:3000/api/admin/leads?type=referral"

# Get single lead (replace UUID)
curl http://localhost:3000/api/admin/leads/YOUR-UUID-HERE

# Update lead status (replace UUID)
curl -X PATCH http://localhost:3000/api/admin/leads/YOUR-UUID-HERE \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

### Database Access

```bash
# Connect to database
docker exec -it phm-postgres psql -U postgres -d phm

# View all leads
SELECT * FROM leads ORDER BY created_at DESC;

# Count by status
SELECT status, COUNT(*) FROM leads GROUP BY status;

# Get a UUID for testing
SELECT id FROM leads LIMIT 1;
```

## 🔐 Security

### Current State (Development)
- ⚠️ No authentication implemented
- ⚠️ Endpoints are publicly accessible
- ⚠️ For local development only

### Phase 4 (Production)
All API routes include TODO comments for:
- AWS Cognito JWT verification
- CloudWatch audit logging
- Rate limiting
- Request validation

## 📚 Documentation

- **QUICK_START.md** - Quick reference commands
- **SETUP_GUIDE.md** - Detailed setup and troubleshooting
- **IMPLEMENTATION_SUMMARY.md** - Complete technical details

## 🛠️ Troubleshooting

### Docker Issues
```bash
# Check if container is running
docker ps | grep phm-postgres

# View container logs
docker logs phm-postgres

# Restart container
docker restart phm-postgres

# Remove and recreate
docker rm -f phm-postgres
# Then run setup script again
```

### Connection Issues
1. Verify DATABASE_URL in `apps/web/.env.local`
2. Check if port 5432 is available
3. Ensure Docker container is running
4. Test connection: `docker exec phm-postgres psql -U postgres -d phm -c "SELECT 1"`

### API Issues
1. Check Next.js dev server is running
2. Verify database schema is applied
3. Check browser console for errors
4. Review API route error responses

## ✅ Architecture Compliance

This implementation strictly follows the PHM Technical Architecture:

| Requirement | Implementation |
|------------|----------------|
| No ORM | ✅ Native `pg` package only |
| PostgreSQL 16 | ✅ Docker container |
| Strict Schema | ✅ Exact column names and types |
| JWT Placeholders | ✅ TODO comments in all routes |
| Connection Pooling | ✅ Singleton pattern, max 20 clients |
| Error Handling | ✅ Comprehensive try-catch blocks |
| Pagination | ✅ Default 50 items per page |
| UUID Validation | ✅ Regex pattern validation |

## 🎓 Next Steps

1. **Test the API** - Use curl commands or Postman
2. **Review the Code** - Understand the implementation
3. **Phase 4 Planning** - Prepare for Cognito integration
4. **Frontend Development** - Build admin dashboard UI
5. **Production Deployment** - AWS infrastructure setup

## 📞 Support

For detailed information, refer to:
- Technical questions → SETUP_GUIDE.md
- Implementation details → IMPLEMENTATION_SUMMARY.md
- Quick commands → QUICK_START.md

---

**Implementation Date**: May 7, 2026  
**Architecture Version**: Revision 4 | April 2026  
**Status**: ✅ Complete and Ready for Testing
