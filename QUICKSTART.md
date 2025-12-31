# AEVON Console - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/MishalHQ/aevon-console.git
cd aevon-console
```

### Step 2: Start Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start server
npm start
```

✅ Backend running on `http://localhost:5000`

### Step 3: Start Frontend (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start app
npm start
```

✅ Frontend running on `http://localhost:3000`

### Step 4: Login

Open browser: `http://localhost:3000/login`

**Default Credentials:**
- Email: `admin@aevon.com`
- Password: `admin123`

---

## 📋 What You Get

### Protected Pages (Login Required)
- **Dashboard** (`/`) - Project statistics overview
- **Projects** (`/projects`) - Full CRUD management

### Public Pages
- **Demo Showcase** (`/demos`) - Public portfolio display
- **Login** (`/login`) - Authentication

---

## 🎯 Quick Actions

### Create a Project
1. Go to Projects page
2. Click "+ New Project"
3. Fill in details
4. Check "Show in Demo Showcase" to make it public
5. Click "Create"

### View Demo Showcase
1. Navigate to `http://localhost:3000/demos`
2. No login required
3. See all projects marked as demos

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Reset Database
```bash
cd backend
rm database.sqlite
npm start  # Will recreate with default admin
```

### Clear Browser Cache
- Press `Ctrl+Shift+R` (Windows/Linux)
- Press `Cmd+Shift+R` (Mac)

---

## 📚 API Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aevon.com","password":"admin123"}'
```

### Get Projects (requires token)
```bash
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Demos (public)
```bash
curl http://localhost:5000/api/projects/demos
```

---

## 🎨 Project Types

- **Business** - Client projects
- **Student** - Educational projects
- **Internal Demo** - Internal showcases

## 📊 Project Statuses

- **Planned** - Not started yet
- **Active** - Currently in progress
- **Completed** - Finished projects

---

## 🔐 Security

**IMPORTANT:** Change default password after first login!

1. Login with default credentials
2. (Future feature: Add password change endpoint)
3. Update `ADMIN_PASSWORD` in `backend/.env`
4. Restart backend server

---

## 📝 Next Steps

1. ✅ Login and explore dashboard
2. ✅ Create your first project
3. ✅ Mark a project as demo
4. ✅ View demo showcase
5. ✅ Change default password
6. ✅ Customize for your needs

---

## 💡 Tips

- **Demo Showcase** is perfect for client presentations
- Use **Tech Stack** field to highlight technologies
- **Description** supports multiple lines
- Projects are sorted by creation date (newest first)

---

## 🆘 Need Help?

Check the main [README.md](README.md) for:
- Full API documentation
- Database schema
- Production deployment guide
- Security best practices

---

**Built with ❤️ for AEVON**