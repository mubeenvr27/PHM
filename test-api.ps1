# PHM Admin Dashboard - API Testing Script
# Run this after starting the dev server: npm run dev

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PHM Admin Dashboard - API Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$apiUrl = "$baseUrl/api/admin/leads"

# Check if dev server is running
Write-Host "Checking if dev server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Dev server is running" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Dev server is not running on $baseUrl" -ForegroundColor Red
    Write-Host "Please start the dev server first:" -ForegroundColor Yellow
    Write-Host "  cd apps\web" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    exit 1
}
Write-Host ""

# Test 1: GET All Leads
Write-Host "Test 1: GET All Leads" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method GET
    if ($response.success -eq $true) {
        Write-Host "✓ Success: Retrieved $($response.data.Count) leads" -ForegroundColor Green
        Write-Host "  Total: $($response.pagination.total)" -ForegroundColor White
        Write-Host "  Page: $($response.pagination.page)/$($response.pagination.totalPages)" -ForegroundColor White
    } else {
        Write-Host "✗ Failed: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Filter by Status
Write-Host "Test 2: Filter by Status (new)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiUrl?status=new" -Method GET
    if ($response.success -eq $true) {
        Write-Host "✓ Success: Retrieved $($response.data.Count) leads with status 'new'" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Filter by Type
Write-Host "Test 3: Filter by Type (referral)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiUrl?type=referral" -Method GET
    if ($response.success -eq $true) {
        Write-Host "✓ Success: Retrieved $($response.data.Count) leads with type 'referral'" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Pagination
Write-Host "Test 4: Pagination (limit=3)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiUrl?limit=3" -Method GET
    if ($response.success -eq $true) {
        Write-Host "✓ Success: Retrieved $($response.data.Count) leads (limit: 3)" -ForegroundColor Green
        Write-Host "  Total Pages: $($response.pagination.totalPages)" -ForegroundColor White
    } else {
        Write-Host "✗ Failed: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Get a UUID for testing
Write-Host "Getting a lead UUID for testing..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiUrl?limit=1" -Method GET
    if ($response.success -eq $true -and $response.data.Count -gt 0) {
        $leadId = $response.data[0].id
        Write-Host "✓ Got UUID: $leadId" -ForegroundColor Green
        Write-Host ""

        # Test 5: GET Single Lead
        Write-Host "Test 5: GET Single Lead" -ForegroundColor Yellow
        try {
            $response = Invoke-RestMethod -Uri "$apiUrl/$leadId" -Method GET
            if ($response.success -eq $true) {
                Write-Host "✓ Success: Retrieved lead" -ForegroundColor Green
                Write-Host "  Patient: $($response.data.patient_name)" -ForegroundColor White
                Write-Host "  Type: $($response.data.type)" -ForegroundColor White
                Write-Host "  Status: $($response.data.status)" -ForegroundColor White
            } else {
                Write-Host "✗ Failed: $($response.error)" -ForegroundColor Red
            }
        } catch {
            Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        }
        Write-Host ""

        # Test 6: PATCH Lead Status
        Write-Host "Test 6: PATCH Lead Status (to 'contacted')" -ForegroundColor Yellow
        try {
            $body = @{ status = "contacted" } | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "$apiUrl/$leadId" -Method PATCH -Body $body -ContentType "application/json"
            if ($response.success -eq $true) {
                Write-Host "✓ Success: Updated lead status to '$($response.data.status)'" -ForegroundColor Green
            } else {
                Write-Host "✗ Failed: $($response.error)" -ForegroundColor Red
            }
        } catch {
            Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        }
        Write-Host ""

        # Test 7: Invalid Status
        Write-Host "Test 7: PATCH with Invalid Status (should fail)" -ForegroundColor Yellow
        try {
            $body = @{ status = "invalid_status" } | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "$apiUrl/$leadId" -Method PATCH -Body $body -ContentType "application/json" -ErrorAction Stop
            Write-Host "✗ Should have failed but didn't" -ForegroundColor Red
        } catch {
            if ($_.Exception.Response.StatusCode -eq 400) {
                Write-Host "✓ Success: Correctly rejected invalid status (400 error)" -ForegroundColor Green
            } else {
                Write-Host "✗ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        Write-Host ""

    } else {
        Write-Host "⚠ No leads found in database. Insert test data first:" -ForegroundColor Yellow
        Write-Host "  docker exec -i phm-postgres psql -U postgres -d phm < test_data.sql" -ForegroundColor White
    }
} catch {
    Write-Host "✗ Error getting UUID: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Invalid UUID Format
Write-Host "Test 8: GET with Invalid UUID (should fail)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$apiUrl/invalid-uuid-format" -Method GET -ErrorAction Stop
    Write-Host "✗ Should have failed but didn't" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✓ Success: Correctly rejected invalid UUID (400 error)" -ForegroundColor Green
    } else {
        Write-Host "✗ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review test results above" -ForegroundColor White
Write-Host "  2. Check VERIFICATION_CHECKLIST.md for complete verification" -ForegroundColor White
Write-Host "  3. Start building the admin dashboard UI" -ForegroundColor White
Write-Host ""
