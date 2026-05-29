# PHM Admin Dashboard - Automated Setup Script for Windows
# Run this script with: .\setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PHM Admin Dashboard - Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host ""

# Check if container already exists
Write-Host "Checking for existing PostgreSQL container..." -ForegroundColor Yellow
$existingContainer = docker ps -a --filter "name=phm-postgres" --format "{{.Names}}"
if ($existingContainer -eq "phm-postgres") {
    Write-Host "Container 'phm-postgres' already exists." -ForegroundColor Yellow
    $response = Read-Host "Do you want to remove it and create a new one? (y/n)"
    if ($response -eq "y") {
        Write-Host "Stopping and removing existing container..." -ForegroundColor Yellow
        docker stop phm-postgres 2>$null
        docker rm phm-postgres 2>$null
        Write-Host "✓ Existing container removed" -ForegroundColor Green
    } else {
        Write-Host "Using existing container..." -ForegroundColor Yellow
        docker start phm-postgres
        Start-Sleep -Seconds 3
    }
} else {
    # Start PostgreSQL container
    Write-Host "Starting PostgreSQL 16 container..." -ForegroundColor Yellow
    docker run --name phm-postgres `
        -e POSTGRES_DB=phm `
        -e POSTGRES_USER=postgres `
        -e POSTGRES_PASSWORD=postgres `
        -p 5432:5432 `
        -d postgres:16

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to start PostgreSQL container" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ PostgreSQL container started" -ForegroundColor Green
    Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}
Write-Host ""

# Apply database schema
Write-Host "Applying database schema..." -ForegroundColor Yellow
$schemaApplied = $true

if (Test-Path "infrastructure/database/schema.sql") {
    Get-Content "infrastructure/database/schema.sql" | docker exec -i phm-postgres psql -U postgres -d phm
    if ($LASTEXITCODE -ne 0) { $schemaApplied = $false }
} else {
    Write-Host "ERROR: infrastructure/database/schema.sql not found" -ForegroundColor Red
    exit 1
}

if (Test-Path "infrastructure/database/orders.sql") {
    Get-Content "infrastructure/database/orders.sql" | docker exec -i phm-postgres psql -U postgres -d phm
    if ($LASTEXITCODE -ne 0) { $schemaApplied = $false }
}

if (Test-Path "infrastructure/database/02_products_schema.sql") {
    Get-Content "infrastructure/database/02_products_schema.sql" | docker exec -i phm-postgres psql -U postgres -d phm
    if ($LASTEXITCODE -ne 0) { $schemaApplied = $false }
}

if ($schemaApplied) {
    Write-Host "✓ Database schema applied successfully (leads, orders, products)" -ForegroundColor Green
} else {
    Write-Host "WARNING: Schema may have already been applied or there was an error" -ForegroundColor Yellow
}
Write-Host ""

# Ask about test data
$response = Read-Host "Do you want to insert test data? (y/n)"
if ($response -eq "y") {
    Write-Host "Inserting test data..." -ForegroundColor Yellow
    if (Test-Path "infrastructure/database/test_data.sql") {
        Get-Content "infrastructure/database/test_data.sql" | docker exec -i phm-postgres psql -U postgres -d phm
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Test data inserted successfully" -ForegroundColor Green
        } else {
            Write-Host "WARNING: Failed to insert test data" -ForegroundColor Yellow
        }
    } else {
        Write-Host "ERROR: infrastructure/database/test_data.sql not found" -ForegroundColor Red
    }
    Write-Host ""
}


# Verify setup
Write-Host "Verifying database setup..." -ForegroundColor Yellow
$tableCheck = docker exec phm-postgres psql -U postgres -d phm -c "\dt" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database is accessible" -ForegroundColor Green
} else {
    Write-Host "WARNING: Could not verify database" -ForegroundColor Yellow
}
Write-Host ""

# Display connection info
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database Connection Details:" -ForegroundColor Yellow
Write-Host "  Host: localhost" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host "  Database: phm" -ForegroundColor White
Write-Host "  Username: postgres" -ForegroundColor White
Write-Host "  Password: postgres" -ForegroundColor White
Write-Host ""
Write-Host "DATABASE_URL:" -ForegroundColor Yellow
Write-Host "  postgresql://postgres:postgres@localhost:5432/phm" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. cd apps\web" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
Write-Host "  3. Test API: curl http://localhost:3000/api/admin/leads" -ForegroundColor White
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Yellow
Write-Host "  Connect to DB: docker exec -it phm-postgres psql -U postgres -d phm" -ForegroundColor White
Write-Host "  Stop container: docker stop phm-postgres" -ForegroundColor White
Write-Host "  Start container: docker start phm-postgres" -ForegroundColor White
Write-Host "  View logs: docker logs phm-postgres" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  Quick Start: QUICK_START.md" -ForegroundColor White
Write-Host "  Setup Guide: SETUP_GUIDE.md" -ForegroundColor White
Write-Host "  Summary: IMPLEMENTATION_SUMMARY.md" -ForegroundColor White
Write-Host ""
