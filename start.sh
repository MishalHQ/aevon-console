#!/bin/bash

# AEVON Console - Start Script
# Starts both backend and frontend in separate terminal tabs

set -e

echo "🚀 Starting AEVON Console..."
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

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "❌ Backend dependencies not installed. Run ./setup.sh first"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not installed. Run ./setup.sh first"
    exit 1
fi

print_info "Starting backend on port 5001..."
print_info "Starting frontend on port 3000..."
echo ""

# Detect terminal and open new tabs
if [ "$TERM_PROGRAM" = "Apple_Terminal" ]; then
    # macOS Terminal
    osascript <<EOF
tell application "Terminal"
    activate
    set currentTab to do script "cd \"$PWD/backend\" && npm start"
    delay 2
    set newTab to do script "cd \"$PWD/frontend\" && npm start" in window 1
end tell
EOF
elif [ "$TERM_PROGRAM" = "iTerm.app" ]; then
    # iTerm2
    osascript <<EOF
tell application "iTerm"
    activate
    tell current window
        create tab with default profile
        tell current session
            write text "cd \"$PWD/backend\" && npm start"
        end tell
        create tab with default profile
        tell current session
            write text "cd \"$PWD/frontend\" && npm start"
        end tell
    end tell
end tell
EOF
else
    # Fallback: run in background with tmux if available
    if command -v tmux &> /dev/null; then
        print_info "Using tmux to run both servers..."
        tmux new-session -d -s aevon "cd $PWD/backend && npm start"
        tmux split-window -h -t aevon "cd $PWD/frontend && npm start"
        tmux attach -t aevon
    else
        # Last resort: run in background
        print_info "Running backend in background..."
        cd backend
        npm start > ../backend.log 2>&1 &
        BACKEND_PID=$!
        cd ..
        
        print_info "Running frontend in background..."
        cd frontend
        npm start > ../frontend.log 2>&1 &
        FRONTEND_PID=$!
        cd ..
        
        echo ""
        print_success "Backend started (PID: $BACKEND_PID) - logs in backend.log"
        print_success "Frontend started (PID: $FRONTEND_PID) - logs in frontend.log"
        echo ""
        echo "To stop the servers:"
        echo "  kill $BACKEND_PID $FRONTEND_PID"
        echo ""
        echo "Or use: ./stop.sh"
    fi
fi

echo ""
print_success "AEVON Console is starting!"
echo ""
echo "📡 Backend: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Wait a few seconds for both servers to start, then open:"
echo "http://localhost:3000"
echo ""