#!/bin/bash

# AEVON Console - Stop Script
# Stops both backend and frontend servers

echo "🛑 Stopping AEVON Console..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Kill process on port 5001 (backend)
if lsof -ti:5001 &> /dev/null; then
    echo "Stopping backend (port 5001)..."
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    print_success "Backend stopped"
else
    print_error "Backend is not running"
fi

# Kill process on port 3000 (frontend)
if lsof -ti:3000 &> /dev/null; then
    echo "Stopping frontend (port 3000)..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    print_success "Frontend stopped"
else
    print_error "Frontend is not running"
fi

# Kill any node processes related to the project
pkill -f "node.*aevon" 2>/dev/null || true

echo ""
print_success "All servers stopped"
echo ""