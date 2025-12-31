#!/bin/bash

# AEVON Console - Business Features Test Script
# This script tests all new business API endpoints

echo "🧪 AEVON Console - Business Features Test"
echo "=========================================="
echo ""

# Configuration
API_URL="http://localhost:5001/api"
EMAIL="admin@aevon.com"
PASSWORD="admin123"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected_status=$4
    
    echo -n "Testing $name... "
    
    if [ -z "$TOKEN" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        ((FAILED++))
        return 1
    fi
}

# Start tests
echo "1. Testing Authentication"
echo "-------------------------"

# Login
echo -n "Logging in... "
login_response=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Could not obtain authentication token. Make sure backend is running."
    exit 1
fi

echo ""
echo "2. Testing Dashboard Endpoints"
echo "------------------------------"
test_endpoint "Dashboard Stats" "GET" "/dashboard/stats" "200"
test_endpoint "Dashboard Charts" "GET" "/dashboard/charts" "200"

echo ""
echo "3. Testing Clients Endpoints"
echo "----------------------------"
test_endpoint "List Clients" "GET" "/clients" "200"
test_endpoint "Get Client #1" "GET" "/clients/1" "200"

echo ""
echo "4. Testing Tasks Endpoints"
echo "--------------------------"
test_endpoint "List Tasks" "GET" "/tasks" "200"
test_endpoint "Get Task #1" "GET" "/tasks/1" "200"
test_endpoint "Filter Tasks by Project" "GET" "/tasks?project_id=1" "200"
test_endpoint "Filter Tasks by Status" "GET" "/tasks?status=In%20Progress" "200"

echo ""
echo "5. Testing Leads Endpoints"
echo "--------------------------"
test_endpoint "List Leads" "GET" "/leads" "200"
test_endpoint "Get Lead #1" "GET" "/leads/1" "200"
test_endpoint "Filter Leads by Stage" "GET" "/leads?stage=Contacted" "200"

echo ""
echo "6. Testing Services Endpoints"
echo "-----------------------------"
test_endpoint "List Services" "GET" "/services" "200"
test_endpoint "Get Service #1" "GET" "/services/1" "200"

echo ""
echo "7. Testing Projects Endpoints"
echo "-----------------------------"
test_endpoint "List Projects" "GET" "/projects" "200"
test_endpoint "Get Project #1" "GET" "/projects/1" "200"

echo ""
echo "8. Verifying Demo Data"
echo "----------------------"

# Get stats and verify counts
echo -n "Checking demo data counts... "
stats=$(curl -s -X GET "$API_URL/dashboard/stats" \
    -H "Authorization: Bearer $TOKEN")

clients_count=$(echo $stats | grep -o '"total":[0-9]*' | head -1 | cut -d':' -f2)
projects_count=$(echo $stats | grep -o '"total":[0-9]*' | head -2 | tail -1 | cut -d':' -f2)

if [ "$clients_count" -ge "7" ] && [ "$projects_count" -ge "7" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Clients: $clients_count, Projects: $projects_count)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (Clients: $clients_count, Projects: $projects_count)"
    ((FAILED++))
fi

# Summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    echo "Your AEVON Console backend is working perfectly!"
    echo "Demo data is loaded and all endpoints are functional."
    echo ""
    echo "Next steps:"
    echo "1. Open http://localhost:3000 in your browser"
    echo "2. Login with: admin@aevon.com / admin123"
    echo "3. Explore the dashboard and features"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo ""
    echo "Please check:"
    echo "1. Backend is running on port 5001"
    echo "2. Database is initialized with demo data"
    echo "3. No errors in backend console"
    exit 1
fi