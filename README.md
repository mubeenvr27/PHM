# Priority Home Monitor (PHM) - Admin Dashboard Backend

Complete backend implementation for the PHM Admin Dashboard, following the **Technical Architecture — Revision 4 | April 2026** specifications.

## 🚀 Quick Start (3 Commands)

```bash
# 1. Setup database (Windows PowerShell)
.\setup.ps1

# OR (Linux/Mac/WSL/Git Bash)
bash setup.sh

# 2. Start development server
cd apps/web
npm run dev

# 3. Test the API (Windows PowerShell)
.\test-api.ps1

# OR (Linux/Mac/WSL/Git Bash)
bash test-api.sh
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | This file - Overview and quick start |
| **[README_BACKEND_SETUP.md](README_BACKEND_SETUP.md)** | Complete backend documentation |
| **[ADMIN_DASHBOARD_GUIDE.md](ADMIN_DASHBOARD_GUIDE.md)** | Admin dashboard guide |
| **[FORMS_INTEGRATION_GUIDE.md](FORMS_INTEGRATION_GUIDE.md)** | Forms integration guide (NEW!) |
| **[FORMS_FIX_SUMMARY.md](FORMS_FIX_SUMMARY.md)** | Forms fix summary (NEW!) |
| **[QUICK_START.md](QUICK_START.md)** | Quick reference commands |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Detailed setup and troubleshooting |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | Technical implementation details |
| **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** | Complete verification checklist |

## 🎯 What's Implemented

### Database Layer
- ✅ PostgreSQL 16 in Docker
- ✅ Strict schema with ENUMs (lead_type, lead_status)
- ✅ Leads table with all required columns
- ✅ Performance indexes
- ✅ Native `pg` connection pooling (NO ORM)

### API Endpoints
- ✅ `GET /api/admin/leads` - List all leads with filtering & pagination
- ✅ `GET /api/admin/leads/[id]` - Get single lead by UUID
- ✅ `PATCH /api/admin/leads/[id]` - Update lead status
- ✅ `POST /api/contact` - Submit contact form (NEW!)
- ✅ `POST /api/refer` - Submit referral form (NEW!)

### Admin Dashboard
- ✅ Apple-style minimalist UI design
- ✅ Real-time data fetching and updates
- ✅ Interactive status management with dropdowns
- ✅ Color-coded status badges
- ✅ Toast notifications for actions
- ✅ Beautiful loading and empty states
- ✅ Responsive table design
- ✅ Live statistics footer

### Public Forms (NEW!)
- ✅ Contact form at `/contact`
- ✅ Referral form at `/refer`
- ✅ Creative success animations
- ✅ Toast notifications
- ✅ Form validation with Zod
- ✅ Auto-reset after submission
- ✅ Data appears in admin dashboard

### Features
- ✅ Query filtering (type, status)
- ✅ Pagination (default 50 items/page)
- ✅ UUID validation
- ✅ Error handling
- ✅ Slow query logging
- ✅ JWT placeholders (Phase 4)
- ✅ CloudWatch placeholders (Phase 4)

## 📁 Project Structure

```
PHM/
├── README.md                                     # This file
├── README_BACKEND_SETUP.md                       # Complete documentation
├── ADMIN_DASHBOARD_GUIDE.md                      # Admin dashboard guide (NEW!)
├── QUICK_START.md                                # Quick reference
├── SETUP_GUIDE.md                                # Detailed setup guide
├── IMPLEMENTATION_SUMMARY.md                     # Technical details
├── VERIFICATION_CHECKLIST.md                     # Verification steps
├── schema.sql                                    # Database schema
├── test_data.sql                                 # Sample data
├── setup.ps1                                     # Windows setup script
├── setup.sh                                      # Linux/Mac setup script
├── test-api.ps1                                  # Windows API test script
├── test-api.sh                                   # Linux/Mac API test script
└── apps/web/
    ├── .env.local                                # DATABASE_URL configured
    ├── src/
    │   ├── lib/
    │   │   └── db.ts                             # Database utility
    │   ├── components/
    │   │   └── ui/
    │   │       └── sonner.tsx                    # Toast notifications (NEW!)
    │   └── app/
    │       ├── layout.tsx                        # Updated with Toaster (NEW!)
    │       ├── admin/
    │       │   └── leads/
    │       │       └── page.tsx                  # Admin dashboard (NEW!)
    │       └── api/
    │           └── admin/
    │               └── leads/
    │                   ├── route.ts              # GET all leads
    │                   └── [id]/
    │                       └── route.ts          # GET/PATCH single lead
```

## 🔌 API Examples

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

### Pagination
```bash
curl "http://localhost:3000/api/admin/leads?page=1&limit=10"
```

### Get Single Lead
```bash
curl http://localhost:3000/api/admin/leads/{uuid}
```

### Update Lead Status
```bash
curl -X PATCH http://localhost:3000/api/admin/leads/{uuid} \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

## 🗄️ Database Schema

### ENUMs
- `lead_type`: 'referral' | 'consultation' | 'contact'
- `lead_status`: 'new' | 'contacted' | 'enrolled' | 'closed'

### Leads Table
- `id` (UUID, primary key)
- `type` (lead_type, not null)
- `patient_name` (VARCHAR 255, not null)
- `provider_name` (VARCHAR 255, nullable)
- `phone` (VARCHAR 50, nullable)
- `email` (VARCHAR 255, nullable)
- `condition_interest` (VARCHAR 255, nullable)
- `message` (TEXT, nullable)
- `source_page` (VARCHAR 255, nullable)
- `status` (lead_status, default 'new')
- `created_at` (TIMESTAMP WITH TIME ZONE, default now)

## 🛠️ Manual Setup

If you prefer manual setup over automated scripts:

### 1. Start PostgreSQL
```bash
docker run --name phm-postgres \
  -e POSTGRES_DB=phm \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16
```

### 2. Apply Schema
```bash
docker exec -i phm-postgres psql -U postgres -d phm < schema.sql
```

### 3. Insert Test Data (Optional)
```bash
docker exec -i phm-postgres psql -U postgres -d phm < test_data.sql
```

### 4. Start Dev Server
```bash
cd apps/web
npm run dev
```

## ✅ Architecture Compliance

| Requirement | Status | Implementation |
|------------|--------|----------------|
| No ORM | ✅ | Native `pg` package only |
| PostgreSQL 16 | ✅ | Docker container |
| Strict Schema | ✅ | Exact column names and types |
| JWT Placeholders | ✅ | TODO comments in routes |
| Connection Pooling | ✅ | Max 20 clients |
| Error Handling | ✅ | Comprehensive try-catch |
| Pagination | ✅ | Default 50 items/page |
| UUID Validation | ✅ | Regex pattern validation |

## 🔐 Security Status

### Current (Development)
- ⚠️ No authentication
- ⚠️ Public endpoints
- ⚠️ Local development only

### Phase 4 (Production)
- 🔒 AWS Cognito JWT verification
- 🔒 CloudWatch audit logging
- 🔒 Rate limiting
- 🔒 Request validation
- 🔒 CORS configuration

## 🧪 Testing

### Automated Testing
```bash
# Windows PowerShell
.\test-api.ps1

# Linux/Mac/WSL/Git Bash
bash test-api.sh
```

### Manual Testing
See [QUICK_START.md](QUICK_START.md) for curl commands.

## 🐛 Troubleshooting

### Docker Issues
```bash
# Check container status
docker ps | grep phm-postgres

# View logs
docker logs phm-postgres

# Restart container
docker restart phm-postgres
```

### Connection Issues
1. Verify DATABASE_URL in `apps/web/.env.local`
2. Check Docker container is running
3. Test connection: `docker exec phm-postgres psql -U postgres -d phm -c "SELECT 1"`

### API Issues
1. Ensure dev server is running: `npm run dev`
2. Check browser console for errors
3. Review API error responses
4. Verify database schema is applied

## 🎨 Admin Dashboard

### Access the Dashboard
```
http://localhost:3000/admin/leads
```

### Features
- **Apple-style Design**: Premium, minimalist interface
- **Real-time Updates**: Interactive status management
- **Color-coded Badges**: Visual status indicators
- **Toast Notifications**: Instant feedback on actions
- **Responsive Design**: Works on all devices
- **Loading States**: Professional skeleton loaders
- **Empty States**: Beautiful "no data" screens

### Quick Demo
1. Start the dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin/leads`
3. View all leads in a beautiful table
4. Click any status dropdown to update
5. Watch the toast notification confirm the change

See [ADMIN_DASHBOARD_GUIDE.md](ADMIN_DASHBOARD_GUIDE.md) for complete documentation.

## 📖 Next Steps

1. **Test the Implementation**
   - Run automated tests: `.\test-api.ps1` or `bash test-api.sh`
   - Access admin dashboard: `http://localhost:3000/admin/leads`
   - Test status updates and interactions

2. **Enhance Admin Dashboard**
   - Add search and filtering
   - Implement pagination controls
   - Add lead details modal
   - Export to CSV functionality

3. **Phase 4 Implementation**
   - AWS Cognito JWT verification
   - CloudWatch logging integration
   - Rate limiting and security hardening
   - Protected routes with authentication

4. **Production Deployment**
   - AWS RDS for PostgreSQL
   - ECS/Fargate for Next.js app
   - CloudFront for CDN

## 📞 Support

For detailed information:
- **Setup Issues**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **API Documentation**: See [README_BACKEND_SETUP.md](README_BACKEND_SETUP.md)
- **Verification**: See [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)

## 📝 Files Summary

### Setup Scripts
- `setup.ps1` - Windows PowerShell automated setup
- `setup.sh` - Linux/Mac/WSL automated setup

### Test Scripts
- `test-api.ps1` - Windows PowerShell API testing
- `test-api.sh` - Linux/Mac/WSL API testing

### Database Files
- `schema.sql` - Database schema with ENUMs and tables
- `test_data.sql` - 10 sample leads for testing

### Documentation
- `README.md` - This overview document
- `README_BACKEND_SETUP.md` - Complete backend documentation
- `QUICK_START.md` - Quick reference commands
- `SETUP_GUIDE.md` - Detailed setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `VERIFICATION_CHECKLIST.md` - Complete verification steps

### Implementation Files
- `apps/web/src/lib/db.ts` - Database connection utility
- `apps/web/src/app/api/admin/leads/route.ts` - GET all leads
- `apps/web/src/app/api/admin/leads/[id]/route.ts` - GET/PATCH single lead

---

**Implementation Date**: May 7, 2026  
**Architecture Version**: Revision 4 | April 2026  
**Status**: ✅ Complete and Ready for Testing

**Get Started**: Run `.\setup.ps1` (Windows) or `bash setup.sh` (Linux/Mac)
