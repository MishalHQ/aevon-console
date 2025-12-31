#!/bin/bash

# AEVON Console - Quick Fix Script
# Fixes common issues without full reinstall

echo "🔧 AEVON Console - Quick Fix"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory (aevon-console/)"
    exit 1
fi

print_info "Killing processes on ports 5001 and 3000..."

# Kill process on port 5001 (backend)
if lsof -ti:5001 &> /dev/null; then
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    print_success "Port 5001 freed"
fi

# Kill process on port 3000 (frontend)
if lsof -ti:3000 &> /dev/null; then
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    print_success "Port 3000 freed"
fi

print_info "Checking environment files..."

# Check backend .env
if [ ! -f "backend/.env" ]; then
    cd backend
    cp .env.example .env
    print_success "Created backend .env"
    cd ..
else
    print_success "Backend .env exists"
fi

# Check frontend .env
if [ ! -f "frontend/.env" ]; then
    cd frontend
    cp .env.example .env
    print_success "Created frontend .env"
    cd ..
else
    print_success "Frontend .env exists"
fi

print_info "Removing old database..."
if [ -f "backend/database.sqlite" ]; then
    rm -f backend/database.sqlite
    print_success "Old database removed"
fi

echo ""
print_success "Quick fix complete!"
echo ""
echo "Now try starting the servers:"
echo "  ./start.sh"
echo ""
echo "Or manually:"
echo "  cd backend && npm start"
echo "  cd frontend && npm start"
echo ""