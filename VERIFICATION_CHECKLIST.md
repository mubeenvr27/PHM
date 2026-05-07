# PHM Admin Dashboard - Verification Checklist

Use this checklist to verify your backend setup is complete and working correctly.

## ✅ Pre-Setup Verification

- [ ] Docker Desktop is installed and running
- [ ] Node.js 18+ is installed
- [ ] Port 5432 is available (not in use)
- [ ] Git Bash, WSL, or PowerShell available for running scripts

## ✅ Files Created

### Root Directory Files
- [x] `schema.sql` - Database schema with ENUMs and tables
- [x] `test_data.sql` - Sample test data (10 leads)
- [x] `setup.ps1` - Windows PowerShell setup script
- [x] `setup.sh` - Linux/Mac/WSL setup script
- [x] `README_BACKEND_SETUP.md` - Main documentation
- [x] `QUICK_START.md` - Quick reference commands
- [x] `SETUP_GUIDE.md` - Detailed setup instructions
- [x] `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- [x] `VERIFICATION_CHECKLIST.md` - This file

### Application Files
- [x] `apps/web/src/lib/db.ts` - Database connection utility
- [x] `apps/web/src/app/api/admin/leads/route.ts` - GET all leads endpoint
- [x] `apps/web/src/app/api/admin/leads/[id]/route.ts` - GET/PATCH single lead endpoint
- [x] `apps/web/.env.local` - DATABASE_URL configured
- [x] `apps/web/package.json` - pg and @types/pg dependencies

## ✅ Database Setup

Run these commands to verify your database setup:

### 1. Check Docker Container
```bash
docker ps | grep phm-postgres
```
**Expected**: Container named `phm-postgres` is running

### 2. Test Database Connection
```bash
docker exec phm-postgres psql -U postgres -d phm -c "SELECT 1"
```
**Expected**: Returns `1`

### 3. Verify Schema
```bash
docker exec phm-postgres psql -U postgres -d phm -c "\dt"
```
**Expected**: Shows `leads` table

### 4. Check ENUMs
```bash
docker exec phm-postgres psql -U postgres -d phm -c "\dT"
```
**Expected**: Shows `lead_type` and `lead_status` types

### 5. Verify Indexes
```bash
docker exec phm-postgres psql -U postgres -d phm -c "\d leads"
```
**Expected**: Shows indexes on status, type, created_at, email

### 6. Count Leads (if test data inserted)
```bash
docker exec phm-postgres psql -U postgres -d phm -c "SELECT COUNT(*) FROM leads"
```
**Expected**: Returns `10` (if test data was inserted)

## ✅ Application Setup

### 1. Check Dependencies
```bash
cd apps/web
npm list pg @types/pg
```
**Expected**: Shows pg@8.20.0 and @types/pg@8.20.0

### 2. Verify Environment Variables
```bash
cd apps/web
type .env.local
```
**Expected**: Contains `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/phm`

### 3. Check TypeScript Compilation
```bash
cd apps/web
npx tsc --noEmit
```
**Expected**: No TypeScript errors

## ✅ API Testing

### 1. Start Development Server
```bash
cd apps/web
npm run dev
```
**Expected**: Server starts on http://localhost:3000

### 2. Test GET All Leads
```bash
curl http://localhost:3000/api/admin/leads
```
**Expected**: JSON response with success: true and data array

### 3. Test Filtering by Status
```bash
curl "http://localhost:3000/api/admin/leads?status=new"
```
**Expected**: JSON response with only "new" status leads

### 4. Test Filtering by Type
```bash
curl "http://localhost:3000/api/admin/leads?type=referral"
```
**Expected**: JSON response with only "referral" type leads

### 5. Test Pagination
```bash
curl "http://localhost:3000/api/admin/leads?page=1&limit=5"
```
**Expected**: JSON response with 5 leads and pagination metadata

### 6. Get a Lead UUID
```bash
docker exec phm-postgres psql -U postgres -d phm -c "SELECT id FROM leads LIMIT 1" -t
```
**Expected**: Returns a UUID (copy this for next tests)

### 7. Test GET Single Lead
```bash
# Replace YOUR-UUID-HERE with actual UUID from step 6
curl http://localhost:3000/api/admin/leads/YOUR-UUID-HERE
```
**Expected**: JSON response with single lead data

### 8. Test PATCH Lead Status
```bash
# Replace YOUR-UUID-HERE with actual UUID from step 6
curl -X PATCH http://localhost:3000/api/admin/leads/YOUR-UUID-HERE \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```
**Expected**: JSON response with updated lead showing status: "contacted"

### 9. Test Invalid UUID
```bash
curl http://localhost:3000/api/admin/leads/invalid-uuid
```
**Expected**: 400 error with "Invalid lead ID format"

### 10. Test Invalid Status
```bash
# Replace YOUR-UUID-HERE with actual UUID
curl -X PATCH http://localhost:3000/api/admin/leads/YOUR-UUID-HERE \
  -H "Content-Type: application/json" \
  -d '{"status": "invalid"}'
```
**Expected**: 400 error with "Invalid status value"

## ✅ Code Quality Checks

### 1. Verify No ORM Usage
```bash
cd apps/web
grep -r "prisma\|drizzle\|typeorm\|sequelize" src/lib/db.ts src/app/api/admin/
```
**Expected**: No matches found

### 2. Verify JWT Placeholders
```bash
cd apps/web
grep -r "TODO.*Cognito" src/app/api/admin/
```
**Expected**: Shows TODO comments in both route files

### 3. Verify CloudWatch Placeholders
```bash
cd apps/web
grep -r "TODO.*CloudWatch" src/app/api/admin/
```
**Expected**: Shows TODO comment in [id]/route.ts

### 4. Check Connection Pooling
```bash
cd apps/web
grep "max:" src/lib/db.ts
```
**Expected**: Shows `max: 20`

## ✅ Architecture Compliance

- [x] **No ORM**: Uses native `pg` package only
- [x] **PostgreSQL 16**: Running in Docker container
- [x] **Strict Schema**: Exact column names and types from architecture doc
- [x] **ENUMs**: lead_type and lead_status properly defined
- [x] **JWT Placeholders**: TODO comments for Phase 4 Cognito integration
- [x] **CloudWatch Placeholders**: TODO comments for Phase 4 logging
- [x] **Connection Pooling**: Singleton pattern with max 20 clients
- [x] **Error Handling**: Comprehensive try-catch blocks
- [x] **Pagination**: Default 50 items per page, configurable
- [x] **UUID Validation**: Regex pattern validation
- [x] **Indexes**: Performance indexes on key columns
- [x] **Next.js 14**: App Router API routes

## ✅ Security Checks

- [x] **Parameterized Queries**: All SQL uses $1, $2 placeholders (prevents SQL injection)
- [x] **Input Validation**: UUID format and status value validation
- [x] **Error Messages**: No sensitive data exposed in error responses
- [x] **Environment Variables**: Database credentials in .env.local (not committed)
- [ ] **Authentication**: TODO - Phase 4 (Cognito JWT)
- [ ] **Rate Limiting**: TODO - Phase 4
- [ ] **CORS**: TODO - Phase 4

## 🎯 Final Verification

Run this comprehensive test to verify everything works:

```bash
# 1. Check Docker
docker ps | grep phm-postgres

# 2. Check database
docker exec phm-postgres psql -U postgres -d phm -c "SELECT COUNT(*) FROM leads"

# 3. Start dev server (in new terminal)
cd apps/web && npm run dev

# 4. Test API (in original terminal)
curl http://localhost:3000/api/admin/leads

# 5. Get UUID and test update
UUID=$(docker exec phm-postgres psql -U postgres -d phm -c "SELECT id FROM leads LIMIT 1" -t | tr -d ' ')
curl -X PATCH http://localhost:3000/api/admin/leads/$UUID \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

## 📊 Success Criteria

All checks should pass:
- ✅ Docker container running
- ✅ Database schema applied
- ✅ All files created
- ✅ Dependencies installed
- ✅ API endpoints responding
- ✅ Filtering and pagination working
- ✅ CRUD operations successful
- ✅ Error handling working
- ✅ No TypeScript errors
- ✅ Architecture compliance verified

## 🚨 Common Issues

### Issue: Port 5432 already in use
**Solution**: 
```bash
# Find process using port
netstat -ano | findstr :5432
# Stop existing PostgreSQL or change port in docker run command
```

### Issue: Container won't start
**Solution**:
```bash
docker rm -f phm-postgres
# Run setup script again
```

### Issue: API returns 500 error
**Solution**:
1. Check DATABASE_URL in .env.local
2. Verify Docker container is running
3. Check Next.js console for error details
4. Verify schema was applied

### Issue: TypeScript errors
**Solution**:
```bash
cd apps/web
npm install @types/pg
```

## 📝 Notes

- All TODO comments are intentional for Phase 4 implementation
- Test data is optional but recommended for development
- Authentication is not implemented (development only)
- Production deployment requires Phase 4 security features

---

**Last Updated**: May 7, 2026  
**Status**: Ready for Verification
