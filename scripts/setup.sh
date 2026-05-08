#!/bin/bash

# PHM Admin Dashboard - Automated Setup Script
# Run this script with: bash setup.sh

echo "========================================"
echo "PHM Admin Dashboard - Backend Setup"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "${YELLOW}Checking Docker...${NC}"
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Check if container already exists
echo -e "${YELLOW}Checking for existing PostgreSQL container...${NC}"
if docker ps -a --filter "name=phm-postgres" --format "{{.Names}}" | grep -q "phm-postgres"; then
    echo -e "${YELLOW}Container 'phm-postgres' already exists.${NC}"
    read -p "Do you want to remove it and create a new one? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Stopping and removing existing container...${NC}"
        docker stop phm-postgres > /dev/null 2>&1
        docker rm phm-postgres > /dev/null 2>&1
        echo -e "${GREEN}✓ Existing container removed${NC}"
    else
        echo -e "${YELLOW}Using existing container...${NC}"
        docker start phm-postgres
        sleep 3
    fi
else
    # Start PostgreSQL container
    echo -e "${YELLOW}Starting PostgreSQL 16 container...${NC}"
    docker run --name phm-postgres \
        -e POSTGRES_DB=phm \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -p 5432:5432 \
        -d postgres:16

    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: Failed to start PostgreSQL container${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ PostgreSQL container started${NC}"
    echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
    sleep 5
fi
echo ""

# Apply database schema
echo -e "${YELLOW}Applying database schema...${NC}"
if [ -f "schema.sql" ]; then
    docker exec -i phm-postgres psql -U postgres -d phm < schema.sql > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database schema applied successfully${NC}"
    else
        echo -e "${YELLOW}WARNING: Schema may have already been applied or there was an error${NC}"
    fi
else
    echo -e "${RED}ERROR: schema.sql not found${NC}"
    exit 1
fi
echo ""

# Ask about test data
read -p "Do you want to insert test data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Inserting test data...${NC}"
    if [ -f "test_data.sql" ]; then
        docker exec -i phm-postgres psql -U postgres -d phm < test_data.sql > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Test data inserted successfully${NC}"
        else
            echo -e "${YELLOW}WARNING: Failed to insert test data${NC}"
        fi
    else
        echo -e "${RED}ERROR: test_data.sql not found${NC}"
    fi
    echo ""
fi

# Verify setup
echo -e "${YELLOW}Verifying database setup...${NC}"
docker exec phm-postgres psql -U postgres -d phm -c "\dt" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database is accessible${NC}"
else
    echo -e "${YELLOW}WARNING: Could not verify database${NC}"
fi
echo ""

# Display connection info
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}Database Connection Details:${NC}"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: phm"
echo "  Username: postgres"
echo "  Password: postgres"
echo ""
echo -e "${YELLOW}DATABASE_URL:${NC}"
echo "  postgresql://postgres:postgres@localhost:5432/phm"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. cd apps/web"
echo "  2. npm run dev"
echo "  3. Test API: curl http://localhost:3000/api/admin/leads"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  Connect to DB: docker exec -it phm-postgres psql -U postgres -d phm"
echo "  Stop container: docker stop phm-postgres"
echo "  Start container: docker start phm-postgres"
echo "  View logs: docker logs phm-postgres"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "  Quick Start: QUICK_START.md"
echo "  Setup Guide: SETUP_GUIDE.md"
echo "  Summary: IMPLEMENTATION_SUMMARY.md"
echo ""
