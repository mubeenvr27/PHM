# PHM Admin Dashboard Backend Setup Guide

## Prerequisites
- Docker installed and running
- Node.js 18+ installed
- PostgreSQL client tools (optional, for manual testing)

## Step 1: Start PostgreSQL Docker Container

Run the following command to start a PostgreSQL 16 container:

```bash
docker run --name phm-postgres \
  -e POSTGRES_DB=phm \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5432:5432 \
  -d postgres:16
```

**Container Details:**
- Container name: `phm-postgres`
- Database name: `phm`
- Username: `postgres`
- Password: `postgres123`
- Port: `5432`

**Verify the container is running:**
```bash
docker ps | grep phm-postgres
```

## Step 2: Configure Environment Variables

Update your `.env.local` file in `apps/web/` with the database connection string:

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/phm
```

## Step 3: Initialize Database Schema

Apply the schema to your PostgreSQL database:

```bash
# Using docker exec
docker exec -i phm-postgres psql -U postgres -d phm < schema.sql

# OR using psql directly (if installed locally)
psql -h localhost -U postgres -d phm -f schema.sql
```

**Expected Output:**
```
CREATE TYPE
CREATE TYPE
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
COMMENT
COMMENT
COMMENT
COMMENT
```

## Step 4: Install Required Dependencies

Ensure the `pg` package is installed:

```bash
cd apps/web
npm install pg
npm install --save-dev @types/pg
```

## Step 5: Insert Test Data (Optional)

Create a test data file `test_data.sql`:

```sql
-- Insert sample leads for testing
INSERT INTO leads (type, patient_name, provider_name, phone, email, condition_interest, message, source_page, status) VALUES
('referral', 'John Smith', 'Dr. Sarah Johnson', '555-0101', 'john.smith@email.com', 'Heart Failure Monitoring', 'Patient has history of CHF, needs remote monitoring', '/programs/heart-failure', 'new'),
('consultation', 'Mary Williams', NULL, '555-0102', 'mary.w@email.com', 'Diabetes Management', 'Interested in glucose monitoring program', '/programs/diabetes', 'new'),
('contact', 'Robert Brown', NULL, '555-0103', 'rbrown@email.com', 'General Inquiry', 'Would like more information about your services', '/contact', 'contacted'),
('referral', 'Patricia Davis', 'Dr. Michael Chen', '555-0104', 'patricia.d@email.com', 'COPD Care', 'Patient requires respiratory monitoring', '/programs/copd', 'enrolled'),
('consultation', 'James Wilson', NULL, '555-0105', 'jwilson@email.com', 'Sleep Apnea', 'Interested in sleep monitoring solutions', '/programs/sleep-apnea', 'new');
```

Apply test data:
```bash
docker exec -i phm-postgres psql -U postgres -d phm < test_data.sql
```

## Step 6: Test the API Routes

### Test 1: Get All Leads
```bash
curl http://localhost:3000/api/admin/leads
```

### Test 2: Get Leads with Filtering
```bash
# Filter by status
curl "http://localhost:3000/api/admin/leads?status=new"

# Filter by type
curl "http://localhost:3000/api/admin/leads?type=referral"

# Pagination
curl "http://localhost:3000/api/admin/leads?page=1&limit=10"
```

### Test 3: Get Single Lead
```bash
# Replace {id} with an actual UUID from your database
curl http://localhost:3000/api/admin/leads/{id}
```

### Test 4: Update Lead Status
```bash
# Replace {id} with an actual UUID from your database
curl -X PATCH http://localhost:3000/api/admin/leads/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

## Step 7: Verify Database Connection

You can verify the database connection using the PostgreSQL client:

```bash
# Connect to the database
docker exec -it phm-postgres psql -U postgres -d phm

# Run queries
SELECT * FROM leads;
SELECT COUNT(*) FROM leads;
\dt  -- List tables
\d leads  -- Describe leads table
\q  -- Quit
```

## Troubleshooting

### Container won't start
```bash
# Check if port 5432 is already in use
netstat -an | grep 5432

# Remove existing container
docker rm -f phm-postgres
```

### Connection refused errors
- Ensure Docker container is running: `docker ps`
- Check DATABASE_URL in `.env.local`
- Verify port 5432 is accessible

### Schema errors
- Ensure you're connected to the correct database (`phm`)
- Drop and recreate if needed:
  ```sql
  DROP TABLE IF EXISTS leads CASCADE;
  DROP TYPE IF EXISTS lead_status CASCADE;
  DROP TYPE IF EXISTS lead_type CASCADE;
  ```

## Architecture Compliance

This implementation follows the **Priority Home Monitor | Technical Architecture — Revision 4 | April 2026** specifications:

✅ **No ORM** - Uses native `pg` package with connection pooling  
✅ **Strict Schema** - Matches exact column names and types from architecture doc  
✅ **JWT Placeholders** - TODO comments for Phase 4 Cognito integration  
✅ **PostgreSQL 16** - Running in Docker container  
✅ **Next.js 14 App Router** - API routes in `app/api/admin/leads/`  
✅ **Connection Pooling** - Singleton pattern with max 20 clients  
✅ **Error Handling** - Comprehensive error responses and logging  
✅ **Pagination** - Default 50 items per page  
✅ **UUID Validation** - Regex pattern validation for lead IDs  

## Next Steps (Phase 4)

1. Implement AWS Cognito JWT verification
2. Add CloudWatch logging for audit trail
3. Implement rate limiting
4. Add request validation middleware
5. Set up database migrations system
