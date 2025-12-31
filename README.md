# AEVON Console

A clean, minimal, production-ready internal operations console for managing projects and showcasing demos.

> **🍎 macOS Users:** See [MACOS_QUICKSTART.md](MACOS_QUICKSTART.md) for one-command setup!

## Features

- **Authentication**: Simple email/password login
- **Dashboard**: Overview statistics (Total, Active, Completed, Demo projects)
- **Projects Management**: Full CRUD operations for projects
- **Demo Showcase**: Public page displaying demo projects
- **Clean UI**: Minimal, responsive design

## Tech Stack

### Backend
- Node.js + Express
- SQLite (better-sqlite3)
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Plain CSS (no frameworks)

## Quick Start

### 🍎 macOS (Recommended)

```bash
# Clone repository
git clone https://github.com/MishalHQ/aevon-console.git
cd aevon-console

# Make scripts executable
chmod +x setup.sh start.sh stop.sh fix.sh

# Complete setup (handles everything)
./setup.sh

# Start application
./start.sh
```

**Requirements:** Node.js v20 LTS (see [MACOS_SETUP.md](MACOS_SETUP.md) for installation)

### 🐧 Linux / 🪟 Windows

See [Manual Installation](#manual-installation) below.

## Manual Installation

### Prerequisites
- Node.js v20 LTS or higher
- npm or yarn

### Step 1: Clone Repository

```bash
git clone https://github.com/MishalHQ/aevon-console.git
cd aevon-console
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (optional)
# Default admin credentials:
# Email: admin@aevon.com
# Password: admin123

# Start backend server
npm start
```

Backend will run on `http://localhost:5001`

### Step 3: Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start frontend
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

### 1. Login
- Navigate to `http://localhost:3000/login`
- Use default credentials:
  - **Email**: admin@aevon.com
  - **Password**: admin123

### 2. Dashboard
- View project statistics
- See total, active, completed, and demo project counts

### 3. Projects Management
- Create new projects
- Edit existing projects
- Delete projects
- Mark projects as demos

### 4. Demo Showcase (Public)
- Navigate to `http://localhost:3000/demos`
- No login required
- Displays all projects marked as demos

## Utility Scripts (macOS/Linux)

```bash
./setup.sh   # Complete setup: clean, install, configure
./start.sh   # Start both backend and frontend
./stop.sh    # Stop all servers
./fix.sh     # Quick fix for common issues (ports, env, db)
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/demos` - Get demo projects (public)
- `GET /api/projects/:id` - Get single project (protected)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

**Full API documentation:** [API.md](API.md)

## Database Schema

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### projects
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('Business', 'Student', 'Internal Demo')),
  status TEXT NOT NULL CHECK(status IN ('Planned', 'Active', 'Completed')),
  description TEXT,
  tech_stack TEXT,
  is_demo BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
aevon-console/
├── backend/
│   ├── src/
│   │   ├── config/database.js       # SQLite setup
│   │   ├── middleware/auth.js       # JWT verification
│   │   ├── routes/
│   │   │   ├── auth.js             # Login/logout
│   │   │   ├── projects.js         # CRUD operations
│   │   │   └── dashboard.js        # Statistics
│   │   ├── models/init.js          # DB initialization
│   │   └── server.js               # Express app
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ProjectForm.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── DemoShowcase.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── setup.sh                         # Complete setup script
├── start.sh                         # Start both servers
├── stop.sh                          # Stop all servers
├── fix.sh                           # Quick fix script
├── README.md
├── MACOS_QUICKSTART.md             # macOS quick start
├── MACOS_SETUP.md                  # macOS troubleshooting
├── QUICKSTART.md
├── API.md
└── .gitignore
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # React dev server with hot reload
```

## Troubleshooting

### Port Already in Use

**macOS/Linux:**
```bash
./fix.sh
```

**Manual:**
```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```cmd
netstat -ano | findstr :5001
taskkill /PID <PID> /F

netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Node Version Issues (M1/M2 Mac)

**Error:** `node-gyp rebuild failed` or `C++20 required`

**Solution:**
```bash
# Install Node v20 LTS
nvm install 20
nvm use 20

# Re-run setup
./setup.sh
```

See [MACOS_SETUP.md](MACOS_SETUP.md) for detailed troubleshooting.

### API Connection Failed

1. Verify backend is running: `curl http://localhost:5001/health`
2. Check frontend `.env` has: `REACT_APP_API_URL=http://localhost:5001/api`
3. Check backend `.env` has: `PORT=5001`
4. Restart both servers

### Reset Database

```bash
rm backend/database.sqlite
cd backend && npm start
```

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## Security Notes

1. **Change default admin password** after first login
2. **Update JWT_SECRET** in backend/.env for production
3. **Use HTTPS** in production
4. **Enable CORS** only for trusted domains in production
5. **Add rate limiting** for API endpoints in production

## Documentation

- [README.md](README.md) - This file
- [MACOS_QUICKSTART.md](MACOS_QUICKSTART.md) - macOS one-command setup
- [MACOS_SETUP.md](MACOS_SETUP.md) - macOS detailed troubleshooting
- [QUICKSTART.md](QUICKSTART.md) - 5-minute quick start
- [API.md](API.md) - Complete API documentation
- [SUMMARY.md](SUMMARY.md) - Project overview

## License

Private - AEVON Internal Use Only

## Support

For issues or questions:
1. Check [MACOS_SETUP.md](MACOS_SETUP.md) for macOS-specific issues
2. Check [QUICKSTART.md](QUICKSTART.md) for general setup
3. Review [API.md](API.md) for API documentation
4. Contact the development team