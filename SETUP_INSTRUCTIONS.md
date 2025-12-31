# 🎯 AEVON Console - Complete Setup Instructions

## ✅ What This Will Do

This setup will:
1. ✅ Check/install Node.js v20 LTS
2. ✅ Kill any processes on ports 5001 and 3000
3. ✅ Clean all old dependencies
4. ✅ Install fresh dependencies for backend and frontend
5. ✅ Create environment files
6. ✅ Initialize SQLite database with default admin
7. ✅ Start both servers

---

## 🚀 One-Command Setup (macOS)

```bash
git clone https://github.com/MishalHQ/aevon-console.git
cd aevon-console
chmod +x setup.sh start.sh stop.sh fix.sh
./setup.sh
./start.sh
```

**That's it!** Open http://localhost:3000 and login with:
- Email: `admin@aevon.com`
- Password: `admin123`

---

## 📋 Step-by-Step Instructions

### Step 1: Install Node.js v20 LTS

**Why v20?** Required for better-sqlite3 compatibility on M1/M2 Macs.

**Option A - Using nvm (Recommended):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.zshrc  # or ~/.bash_profile

# Install and use Node v20
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

### Step 2: Clone Repository

```bash
git clone https://github.com/MishalHQ/aevon-console.git
cd aevon-console
```

### Step 3: Make Scripts Executable

```bash
chmod +x setup.sh start.sh stop.sh fix.sh
```

### Step 4: Run Complete Setup

```bash
./setup.sh
```

This script will:
- ✅ Verify Node v20 is installed
- ✅ Kill processes on ports 5001 and 3000
- ✅ Clean backend: remove node_modules, package-lock.json, database.sqlite
- ✅ Clean frontend: remove node_modules, package-lock.json
- ✅ Create .env files from examples
- ✅ Install all backend dependencies
- ✅ Install all frontend dependencies

**Expected output:**
```
🚀 AEVON Console - Complete Setup Script
==========================================

✅ Node.js v20 is installed
✅ Port 5001 is now free
✅ Port 3000 is now free
✅ Backend cleaned
✅ Created backend .env file
✅ Backend dependencies installed
✅ Frontend cleaned
✅ Created frontend .env file
✅ Frontend dependencies installed

==========================================
✅ Setup Complete!
==========================================
```

### Step 5: Start Application

**Option A - Automatic (Recommended):**
```bash
./start.sh
```

This opens both backend and frontend in separate terminal tabs.

**Option B - Manual (Two Terminals):**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### Step 6: Access Application

1. Wait for both servers to start (10-15 seconds)
2. Open browser: **http://localhost:3000**
3. Login with:
   - Email: `admin@aevon.com`
   - Password: `admin123`

---

## 🎯 Verification Checklist

After setup, verify everything works:

### Backend Verification
```bash
# Check backend is running
curl http://localhost:5001/health

# Expected response:
# {"status":"ok","message":"AEVON Console API is running"}

# Test login endpoint
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aevon.com","password":"admin123"}'

# Expected: JSON with token and user info
```

### Frontend Verification
- [ ] Frontend loads at http://localhost:3000
- [ ] Login page displays
- [ ] Can login with default credentials
- [ ] Dashboard shows 4 stat cards
- [ ] Projects page loads
- [ ] Can create a new project
- [ ] Can edit a project
- [ ] Can delete a project
- [ ] Demo showcase works at http://localhost:3000/demos

---

## 🛠️ Utility Commands

### Start Servers
```bash
./start.sh
```

### Stop Servers
```bash
./stop.sh
```

### Quick Fix (ports, env, database)
```bash
./fix.sh
```

### Complete Reset
```bash
./stop.sh
rm -rf backend/node_modules backend/package-lock.json backend/database.sqlite
rm -rf frontend/node_modules frontend/package-lock.json
./setup.sh
./start.sh
```

---

## 🐛 Common Issues

### Issue: "Node.js v20 is required"

**Solution:**
```bash
nvm install 20
nvm use 20
./setup.sh
```

### Issue: "Port already in use"

**Solution:**
```bash
./fix.sh
```

Or manually:
```bash
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Issue: "react-scripts: command not found"

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "API connection failed"

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:5001/health

# 2. Check frontend .env
cat frontend/.env
# Should show: REACT_APP_API_URL=http://localhost:5001/api

# 3. Restart both
./stop.sh
./start.sh
```

### Issue: "better-sqlite3 build error"

**Solution (M1/M2 Mac):**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Use Node v20
nvm use 20

# Clean and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 What Gets Created

After setup, your directory will look like:

```
aevon-console/
├── backend/
│   ├── node_modules/          # ✅ Installed
│   ├── database.sqlite        # ✅ Created on first run
│   ├── .env                   # ✅ Created from .env.example
│   └── ...
├── frontend/
│   ├── node_modules/          # ✅ Installed
│   ├── .env                   # ✅ Created from .env.example
│   └── ...
└── ...
```

---

## 🔐 Default Configuration

### Backend (.env)
```
PORT=5001
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
ADMIN_EMAIL=admin@aevon.com
ADMIN_PASSWORD=admin123
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5001/api
```

---

## 🎓 What Happens on First Run

1. **Backend starts:**
   - Connects to SQLite
   - Creates `users` table
   - Creates `projects` table
   - Creates default admin user
   - Starts Express server on port 5001

2. **Frontend starts:**
   - Compiles React app
   - Starts dev server on port 3000
   - Opens browser automatically

---

## 📊 System Requirements

- **OS:** macOS 10.15+, Linux, Windows 10+
- **Node.js:** v20 LTS (required)
- **RAM:** 2GB minimum
- **Disk:** 500MB free space
- **Ports:** 5001 and 3000 must be available

---

## 🎉 Success Indicators

You'll know setup worked when you see:

**Backend Terminal:**
```
🚀 AEVON Console Backend
📡 Server running on http://localhost:5001
🏥 Health check: http://localhost:5001/health
```

**Frontend Terminal:**
```
Compiled successfully!

You can now view aevon-console-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Browser:**
- Login page loads
- Can login successfully
- Dashboard shows stats
- Projects page works

---

## 📚 Next Steps

After successful setup:

1. ✅ Login and explore the dashboard
2. ✅ Create your first project
3. ✅ Mark a project as demo
4. ✅ View the demo showcase
5. ✅ Change the default admin password (update backend/.env)
6. ✅ Customize for your needs

---

## 🆘 Still Need Help?

1. **Check Node version:** `node -v` (must be v20.x.x)
2. **Check ports:** `lsof -i :5001` and `lsof -i :3000`
3. **Check backend health:** `curl http://localhost:5001/health`
4. **Check browser console:** Open DevTools (Cmd+Option+I)
5. **Review logs:** Check terminal output for errors
6. **Read troubleshooting:** [MACOS_SETUP.md](MACOS_SETUP.md)

---

## 📞 Support Resources

- [MACOS_QUICKSTART.md](MACOS_QUICKSTART.md) - Quick start for macOS
- [MACOS_SETUP.md](MACOS_SETUP.md) - Detailed troubleshooting
- [README.md](README.md) - Full documentation
- [API.md](API.md) - API documentation

---

**Happy coding! 🚀**