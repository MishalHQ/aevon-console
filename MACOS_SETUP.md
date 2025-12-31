# AEVON Console - macOS Setup & Troubleshooting Guide

## 🍎 macOS-Specific Setup (M1/M2/Intel)

This guide addresses all common issues on macOS, especially for Apple Silicon (M1/M2).

---

## 🚀 Quick Setup (Recommended)

### Step 1: Install Node.js v20 LTS

**Option A - Using nvm (Recommended):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.zshrc  # or ~/.bash_profile for bash

# Install Node v20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node -v  # Should show v20.x.x
```

**Option B - Using Homebrew:**
```bash
brew install node@20
brew link node@20 --force --overwrite

# Verify
node -v  # Should show v20.x.x
```

### Step 2: Clone and Setup

```bash
# Clone repository
git clone https://github.com/MishalHQ/aevon-console.git
cd aevon-console

# Make scripts executable
chmod +x setup.sh start.sh stop.sh fix.sh

# Run complete setup
./setup.sh
```

### Step 3: Start Application

```bash
# Option A - Automatic (opens in new terminal tabs)
./start.sh

# Option B - Manual (two separate terminals)
# Terminal 1:
cd backend && npm start

# Terminal 2:
cd frontend && npm start
```

### Step 4: Access Application

Open browser: **http://localhost:3000**

**Login:**
- Email: `admin@aevon.com`
- Password: `admin123`

---

## 🔧 Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:**
```
EADDRINUSE: address already in use :::5001
EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Quick fix
./fix.sh

# Or manually:
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

---

### Issue 2: Node Version Incompatibility

**Error:**
```
node-gyp rebuild failed
C++20 required
better-sqlite3 build error
```

**Solution:**
```bash
# Check current version
node -v

# If not v20, install it:
nvm install 20
nvm use 20

# Then re-run setup
./setup.sh
```

---

### Issue 3: react-scripts Not Found

**Error:**
```
sh: react-scripts: command not found
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..
```

Or use the setup script:
```bash
./setup.sh
```

---

### Issue 4: API Connection Failed

**Error:**
```
{"error":"Route not found"}
Network Error
Failed to fetch
```

**Causes:**
- Backend not running
- Wrong port configuration
- CORS issues

**Solution:**
```bash
# 1. Check backend is running on port 5001
curl http://localhost:5001/health

# 2. Check frontend .env
cat frontend/.env
# Should show: REACT_APP_API_URL=http://localhost:5001/api

# 3. Check backend .env
cat backend/.env
# Should show: PORT=5001

# 4. Restart both servers
./stop.sh
./start.sh
```

---

### Issue 5: SQLite/better-sqlite3 Build Errors (M1/M2)

**Error:**
```
gyp ERR! build error
Error: `make` failed with exit code: 2
```

**Solution for Apple Silicon (M1/M2):**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Rosetta 2 (if not already)
softwareupdate --install-rosetta

# Use Node v20 (critical for ARM64)
nvm install 20
nvm use 20

# Clean and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

# If still fails, try with arch flag:
arch -arm64 npm install
```

---

### Issue 6: Database Initialization Failed

**Error:**
```
Database locked
SQLITE_CANTOPEN
```

**Solution:**
```bash
# Remove old database
rm backend/database.sqlite

# Restart backend
cd backend
npm start
```

---

### Issue 7: Permission Denied on Scripts

**Error:**
```
Permission denied: ./setup.sh
```

**Solution:**
```bash
chmod +x setup.sh start.sh stop.sh fix.sh
```

---

### Issue 8: Frontend Won't Start

**Error:**
```
Cannot find module 'react-scripts'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

---

### Issue 9: Backend Crashes on Startup

**Check logs for specific error:**
```bash
cd backend
npm start

# Common causes:
# 1. Port in use -> ./fix.sh
# 2. Missing .env -> cp .env.example .env
# 3. SQLite error -> rm database.sqlite
```

---

### Issue 10: Login Not Working

**Symptoms:**
- Login button does nothing
- Network error on login
- 404 error

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:5001/health

# 2. Check API endpoint
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aevon.com","password":"admin123"}'

# 3. Check browser console for errors
# Open DevTools (Cmd+Option+I) -> Console tab

# 4. Verify frontend .env
cat frontend/.env
# Must have: REACT_APP_API_URL=http://localhost:5001/api
```

---

## 🛠️ Utility Scripts

### setup.sh
Complete setup: cleans, installs, configures everything
```bash
./setup.sh
```

### start.sh
Starts both backend and frontend
```bash
./start.sh
```

### stop.sh
Stops all servers
```bash
./stop.sh
```

### fix.sh
Quick fix for common issues (ports, env files, database)
```bash
./fix.sh
```

---

## 📋 Manual Setup (If Scripts Don't Work)

### Backend Setup
```bash
cd backend

# Clean
rm -rf node_modules package-lock.json database.sqlite

# Setup environment
cp .env.example .env

# Install
npm install

# Start
npm start
```

### Frontend Setup
```bash
cd frontend

# Clean
rm -rf node_modules package-lock.json

# Setup environment
cp .env.example .env

# Install
npm install

# Start
npm start
```

---

## 🔍 Verification Checklist

After setup, verify everything works:

- [ ] Node.js v20 installed: `node -v`
- [ ] Backend starts: `cd backend && npm start`
- [ ] Backend health check: `curl http://localhost:5001/health`
- [ ] Frontend starts: `cd frontend && npm start`
- [ ] Frontend loads: Open `http://localhost:3000`
- [ ] Login works: Use `admin@aevon.com` / `admin123`
- [ ] Dashboard loads with stats
- [ ] Can create/edit/delete projects
- [ ] Demo showcase works: `http://localhost:3000/demos`

---

## 🐛 Still Having Issues?

### Enable Debug Mode

**Backend:**
```bash
cd backend
DEBUG=* npm start
```

**Frontend:**
```bash
cd frontend
REACT_APP_DEBUG=true npm start
```

### Check Logs

**Backend logs:**
```bash
cd backend
npm start 2>&1 | tee backend.log
```

**Frontend logs:**
```bash
cd frontend
npm start 2>&1 | tee frontend.log
```

### System Information

```bash
# Node version
node -v

# npm version
npm -v

# Architecture
uname -m

# macOS version
sw_vers

# Check ports
lsof -i :5001
lsof -i :3000
```

---

## 💡 Pro Tips

1. **Always use Node v20** - Critical for better-sqlite3 on M1/M2
2. **Use nvm** - Easier to switch Node versions
3. **Check ports first** - Most issues are port conflicts
4. **Clear browser cache** - Cmd+Shift+R to hard refresh
5. **Use the scripts** - They handle most issues automatically

---

## 🆘 Emergency Reset

If everything is broken:

```bash
# 1. Stop all servers
./stop.sh

# 2. Complete clean
rm -rf backend/node_modules backend/package-lock.json backend/database.sqlite
rm -rf frontend/node_modules frontend/package-lock.json

# 3. Verify Node v20
node -v

# 4. Full setup
./setup.sh

# 5. Start fresh
./start.sh
```

---

## 📞 Support

If you're still stuck after trying everything:

1. Check Node version: `node -v` (must be v20.x.x)
2. Check if ports are free: `lsof -i :5001` and `lsof -i :3000`
3. Check backend health: `curl http://localhost:5001/health`
4. Check browser console for errors (Cmd+Option+I)
5. Review backend terminal output for errors

---

**Last Updated:** 2024-12-31