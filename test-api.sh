#!/bin/bash

# PHM Admin Dashboard - API Testing Script
# Run this after starting the dev server: npm run dev

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}PHM Admin Dashboard - API Testing${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api/admin/leads"

# Check if dev server is running
echo -e "${YELLOW}Checking if dev server is running...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200\|404"; then
    echo -e "${GREEN}✓ Dev server is running${NC}"
else
    echo -e "${RED}ERROR: Dev server is not running on $BASE_URL${NC}"
    echo -e "${YELLOW}Please start the dev server first:${NC}"
    echo -e "${WHITE}  cd apps/web${NC}"
    echo -e "${WHITE}  npm run dev${NC}"
    exit 1
fi
echo ""

# Test 1: GET All Leads
echo -e "${YELLOW}Test 1: GET All Leads${NC}"
response=$(curl -s "$API_URL")
if echo "$response" | grep -q '"success":true'; then
    count=$(echo "$response" | grep -o '"data":\[.*\]' | grep -o '{' | wc -l)
    total=$(echo "$response" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
    echo -e "${GREEN}✓ Success: Retrieved leads${NC}"
    echo -e "${WHITE}  Total: $total${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi
echo ""

# Test 2: Filter by Status
echo -e "${YELLOW}Test 2: Filter by Status (new)${NC}"
response=$(curl -s "$API_URL?status=new")
if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Success: Retrieved leads with status 'new'${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi
echo ""

# Test 3: Filter by Type
echo -e "${YELLOW}Test 3: Filter by Type (referral)${NC}"
response=$(curl -s "$API_URL?type=referral")
if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Success: Retrieved leads with type 'referral'${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi
echo ""

# Test 4: Pagination
echo -e "${YELLOW}Test 4: Pagination (limit=3)${NC}"
response=$(curl -s "$API_URL?limit=3")
if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Success: Retrieved leads with pagination${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi
echo ""

# Get a UUID for testing
echo -e "${YELLOW}Getting a lead UUID for testing...${NC}"
response=$(curl -s "$API_URL?limit=1")
if echo "$response" | grep -q '"success":true'; then
    LEAD_ID=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$LEAD_ID" ]; then
        echo -e "${GREEN}✓ Got UUID: $LEAD_ID${NC}"
        echo ""

        # Test 5: GET Single Lead
        echo -e "${YELLOW}Test 5: GET Single Lead${NC}"
        response=$(curl -s "$API_URL/$LEAD_ID")
        if echo "$response" | grep -q '"success":true'; then
            patient=$(echo "$response" | grep -o '"patient_name":"[^"]*"' | cut -d'"' -f4)
            type=$(echo "$response" | grep -o '"type":"[^"]*"' | cut -d'"' -f4)
            status=$(echo "$response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
            echo -e "${GREEN}✓ Success: Retrieved lead${NC}"
            echo -e "${WHITE}  Patient: $patient${NC}"
            echo -e "${WHITE}  Type: $type${NC}"
            echo -e "${WHITE}  Status: $status${NC}"
        else
            echo -e "${RED}✗ Failed${NC}"
        fi
        echo ""

        # Test 6: PATCH Lead Status
        echo -e "${YELLOW}Test 6: PATCH Lead Status (to 'contacted')${NC}"
        response=$(curl -s -X PATCH "$API_URL/$LEAD_ID" \
            -H "Content-Type: application/json" \
            -d '{"status": "contacted"}')
        if echo "$response" | grep -q '"success":true'; then
            new_status=$(echo "$response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
            echo -e "${GREEN}✓ Success: Updated lead status to '$new_status'${NC}"
        else
            echo -e "${RED}✗ Failed${NC}"
        fi
        echo ""

        # Test 7: Invalid Status
        echo -e "${YELLOW}Test 7: PATCH with Invalid Status (should fail)${NC}"
        response=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/$LEAD_ID" \
            -H "Content-Type: application/json" \
            -d '{"status": "invalid_status"}')
        http_code=$(echo "$response" | tail -n1)
        if [ "$http_code" = "400" ]; then
            echo -e "${GREEN}✓ Success: Correctly rejected invalid status (400 error)${NC}"
        else
            echo -e "${RED}✗ Failed: Expected 400, got $http_code${NC}"
        fi
        echo ""

    else
        echo -e "${YELLOW}⚠ No leads found in database. Insert test data first:${NC}"
        echo -e "${WHITE}  docker exec -i phm-postgres psql -U postgres -d phm < test_data.sql${NC}"
    fi
else
    echo -e "${RED}✗ Error getting leads${NC}"
fi

# Test 8: Invalid UUID Format
echo -e "${YELLOW}Test 8: GET with Invalid UUID (should fail)${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_URL/invalid-uuid-format")
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" = "400" ]; then
    echo -e "${GREEN}✓ Success: Correctly rejected invalid UUID (400 error)${NC}"
else
    echo -e "${RED}✗ Failed: Expected 400, got $http_code${NC}"
fi
echo ""

# Summary
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${WHITE}  1. Review test results above${NC}"
echo -e "${WHITE}  2. Check VERIFICATION_CHECKLIST.md for complete verification${NC}"
echo -e "${WHITE}  3. Start building the admin dashboard UI${NC}"
echo ""
