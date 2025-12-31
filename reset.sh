#!/bin/bash

# COMPLETE RESET AND FIX SCRIPT
# This will fix EVERYTHING once and for all

set -e

echo "🔧 AEVON Console - Complete Reset & Fix"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}➜ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo "This script will:"
echo "  1. Stop all running servers"
echo "  2. Delete old database"
echo "  3. Reinstall dependencies"
echo "  4. Create fresh database with realistic amounts"
echo "  5. Start both servers"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
print_step "Step 1: Stopping all servers..."
lsof -ti:5001 | xargs kill -9 2>/dev/null && print_success "Backend stopped" || print_warning "Backend not running"
lsof -ti:3000 | xargs kill -9 2>/dev/null && print_success "Frontend stopped" || print_warning "Frontend not running"
pkill -f "node.*aevon" 2>/dev/null || true
sleep 2

echo ""
print_step "Step 2: Cleaning old files..."
rm -f backend/database.sqlite
print_success "Old database deleted"
rm -f backend.log frontend.log
print_success "Old logs deleted"

echo ""
print_step "Step 3: Installing backend dependencies..."
cd backend
rm -rf node_modules package-lock.json
npm install
print_success "Backend dependencies installed"

echo ""
print_step "Step 4: Installing frontend dependencies..."
cd ../frontend
rm -rf node_modules package-lock.json
npm install
print_success "Frontend dependencies installed"

cd ..

echo ""
print_step "Step 5: Creating fresh database..."
cd backend
node -e "
const { initDatabase } = require('./src/models/init');
console.log('Initializing database...');
initDatabase();
console.log('Database created successfully!');
"
print_success "Fresh database created with realistic amounts"

echo ""
print_step "Step 6: Starting backend server..."
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
print_success "Backend starting (PID: $BACKEND_PID)"

cd ..

echo ""
print_step "Step 7: Waiting for backend to be ready..."
sleep 5

# Test backend
if curl -s http://localhost:5001/health > /dev/null; then
    print_success "Backend is running!"
else
    print_error "Backend failed to start. Check backend.log"
    exit 1
fi

echo ""
print_step "Step 8: Starting frontend server..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
print_success "Frontend starting (PID: $FRONTEND_PID)"

cd ..

echo ""
print_step "Step 9: Waiting for frontend to be ready..."
sleep 10

echo ""
echo "========================================"
print_success "AEVON Console is ready!"
echo "========================================"
echo ""
echo "📡 Backend:  http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "🔐 Login credentials:"
echo "   Email:    admin@aevon.com"
echo "   Password: admin123"
echo ""
echo "📊 Expected Dashboard Stats:"
echo "   Total Revenue: ₹3,28,000"
echo "   Lead Value:    ₹2,02,000"
echo "   Projects:      7 demo projects"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   ./stop.sh"
echo "   OR: kill $BACKEND_PID $FRONTEND_PID"
echo ""
print_success "Setup complete! Open http://localhost:3000"
echo ""