#!/bin/bash

# AEVON Console - Complete Setup Script for macOS
# This script will:
# 1. Check and install Node v20 LTS if needed
# 2. Clean all dependencies
# 3. Kill processes on ports 5001 and 3000
# 4. Install all dependencies
# 5. Setup environment files

set -e  # Exit on error

echo "🚀 AEVON Console - Complete Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory (aevon-console/)"
    exit 1
fi

print_info "Step 1: Checking Node.js version..."

# Check current Node version
if command -v node &> /dev/null; then
    CURRENT_NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    print_info "Current Node.js version: $(node -v)"
    
    if [ "$CURRENT_NODE_VERSION" -ne 20 ]; then
        print_error "Node.js v20 LTS is required for better-sqlite3 compatibility"
        print_info "Current version: v$CURRENT_NODE_VERSION"
        echo ""
        echo "Please install Node.js v20 LTS using one of these methods:"
        echo ""
        echo "Option 1 - Using nvm (recommended):"
        echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
        echo "  source ~/.zshrc  # or ~/.bash_profile"
        echo "  nvm install 20"
        echo "  nvm use 20"
        echo ""
        echo "Option 2 - Using Homebrew:"
        echo "  brew install node@20"
        echo "  brew link node@20"
        echo ""
        echo "After installing Node v20, run this script again."
        exit 1
    else
        print_success "Node.js v20 is installed"
    fi
else
    print_error "Node.js is not installed"
    echo ""
    echo "Please install Node.js v20 LTS using one of these methods:"
    echo ""
    echo "Option 1 - Using nvm (recommended):"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  source ~/.zshrc  # or ~/.bash_profile"
    echo "  nvm install 20"
    echo "  nvm use 20"
    echo ""
    echo "Option 2 - Using Homebrew:"
    echo "  brew install node@20"
    echo ""
    echo "After installing Node v20, run this script again."
    exit 1
fi

print_info "Step 2: Killing processes on ports 5001 and 3000..."

# Kill process on port 5001 (backend)
if lsof -ti:5001 &> /dev/null; then
    print_info "Killing process on port 5001..."
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    print_success "Port 5001 is now free"
else
    print_success "Port 5001 is already free"
fi

# Kill process on port 3000 (frontend)
if lsof -ti:3000 &> /dev/null; then
    print_info "Killing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    print_success "Port 3000 is now free"
else
    print_success "Port 3000 is already free"
fi

print_info "Step 3: Cleaning backend dependencies..."

cd backend

# Remove old dependencies
if [ -d "node_modules" ]; then
    print_info "Removing backend node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    print_info "Removing backend package-lock.json..."
    rm -f package-lock.json
fi

# Remove old database
if [ -f "database.sqlite" ]; then
    print_info "Removing old database..."
    rm -f database.sqlite
fi

print_success "Backend cleaned"

print_info "Step 4: Setting up backend environment..."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created backend .env file"
else
    print_info "Backend .env file already exists"
fi

print_info "Step 5: Installing backend dependencies..."

npm install

print_success "Backend dependencies installed"

cd ..

print_info "Step 6: Cleaning frontend dependencies..."

cd frontend

# Remove old dependencies
if [ -d "node_modules" ]; then
    print_info "Removing frontend node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    print_info "Removing frontend package-lock.json..."
    rm -f package-lock.json
fi

print_success "Frontend cleaned"

print_info "Step 7: Setting up frontend environment..."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created frontend .env file"
else
    print_info "Frontend .env file already exists"
fi

print_info "Step 8: Installing frontend dependencies..."

npm install

print_success "Frontend dependencies installed"

cd ..

echo ""
echo "=========================================="
print_success "Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && npm start"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "OR use the convenience script:"
echo "   ./start.sh"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Login with default credentials:"
echo "   Email: admin@aevon.com"
echo "   Password: admin123"
echo ""
echo "🎉 Happy coding!"
echo ""