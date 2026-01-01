# 🔒 Secure Admin Console

A production-ready internal admin system demonstrating backend engineering, authentication, role-based access control, and security fundamentals.

## 🎯 Overview

Secure Admin Console is an internal system for managing users, projects, and system activity. Built to showcase clean architecture, proper authentication patterns, and real-world admin workflows.

**This is a showcase project, not a startup.**

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with token expiration
- **Role-Based Access Control (RBAC)**:
  - `ADMIN`: Full system access (create, update, delete)
  - `VIEWER`: Read-only access
- Protected routes on both frontend and backend
- Secure logout with audit logging

### 👥 User Management
- List all users with role and status
- Create new users with role assignment
- Toggle user roles (ADMIN ↔ VIEWER)
- Soft delete (disable users)
- Prevent self-account modification

### 📁 Project Management
- Create, view, update, and delete projects
- Project statuses: `active`, `completed`, `archived`
- Owner tracking
- Status change workflow
- ADMIN-only write access, all users can view

### 📋 Audit Logs (Security Critical)
- **Comprehensive activity tracking**:
  - User logins/logouts
  - Failed login attempts
  - User creation/updates/disabling
  - Project creation/updates/deletion
- Read-only interface for all authenticated users
- Filterable by action type
- Pagination support
- IP address tracking

### 📊 Dashboard
- Real-time statistics:
  - User counts (total, active, by role)
  - Project counts (by status)
  - Audit log activity
- Recent activity feed
- System overview

## 🏗️ Architecture

### Backend Stack
- **Runtime**: Node.js + Express
- **Database**: SQLite (simple, portable)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

### Frontend Stack
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS (professional dark theme)

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # SQLite configuration
│   ├── middleware/
│   │   └── auth.js               # JWT auth + RBAC middleware
│   ├── models/
│   │   └── init.js               # Database schema & seeding
│   ├── routes/
│   │   ├── auth.js               # Login/logout
│   │   ├── users.js              # User management (ADMIN only)
│   │   ├── projects.js           # Project CRUD
│   │   ├── audit-logs.js         # Audit log viewing
│   │   └── dashboard.js          # Statistics
│   └── server.js                 # Express app setup

frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation with role display
│   │   └── StatCard.jsx          # Dashboard stat cards
│   ├── pages/
│   │   ├── Login.jsx             # Authentication
│   │   ├── Dashboard.jsx         # Overview
│   │   ├── Users.jsx             # User management
│   │   ├── Projects.jsx          # Project management
│   │   └── AuditLogs.jsx         # Security logs
│   ├── styles/
│   │   └── admin.css             # Professional dark theme
│   ├── App.jsx                   # Routes & protected routes
│   └── App.css                   # Style imports
```

## 🔒 Security Decisions

### Authentication
- **JWT tokens** stored in localStorage
- 24-hour token expiration
- Token verification on every protected route
- User active status check on each request

### Authorization
- **Middleware-based RBAC**:
  - `authenticateToken`: Verifies JWT
  - `requireAdmin`: Enforces ADMIN role
  - `requireAuth`: Allows any authenticated user
- Route-level protection (no client-side bypass)

### Audit Logging
- **Automatic logging** via middleware
- Tracks all security-relevant actions
- Immutable logs (read-only interface)
- IP address capture for forensics

### Password Security
- bcrypt hashing (10 rounds)
- No plaintext password storage
- Minimum 6-character requirement

### Input Validation
- Required field checks
- Role enum validation
- Email format validation
- SQL injection prevention (prepared statements)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MishalHQ/aevon-console.git
cd aevon-console
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings:
# JWT_SECRET=your-super-secret-jwt-key-change-this
# PORT=5001
# ADMIN_EMAIL=admin@secureadmin.local
# ADMIN_PASSWORD=admin123

# Start backend
npm start
```

Backend runs on `http://localhost:5001`

3. **Frontend Setup** (new terminal)
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Edit .env:
# REACT_APP_API_URL=http://localhost:5001/api

# Start frontend
npm start
```

Frontend runs on `http://localhost:3000`

### Default Credentials

**Admin Account:**
- Email: `admin@secureadmin.local`
- Password: `admin123`

**Viewer Account:**
- Email: `viewer@secureadmin.local`
- Password: `viewer123`

**⚠️ Change these in production!**

## 📖 API Documentation

### Authentication

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "admin@secureadmin.local",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@secureadmin.local",
    "name": "System Administrator",
    "role": "ADMIN"
  }
}
```

#### POST `/api/auth/logout`
Logout current user (requires auth).

#### GET `/api/auth/me`
Get current user info (requires auth).

### Users (ADMIN only)

#### GET `/api/users`
List all users.

#### POST `/api/users`
Create new user.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "VIEWER"
}
```

#### PUT `/api/users/:id`
Update user (name, role, or status).

#### DELETE `/api/users/:id`
Disable user (soft delete).

### Projects

#### GET `/api/projects`
List all projects (all authenticated users).

#### POST `/api/projects` (ADMIN only)
Create new project.

**Request:**
```json
{
  "name": "New Project",
  "status": "active",
  "description": "Project description"
}
```

#### PUT `/api/projects/:id` (ADMIN only)
Update project.

#### DELETE `/api/projects/:id` (ADMIN only)
Delete project.

### Audit Logs

#### GET `/api/audit-logs`
List audit logs with pagination and filtering.

**Query Parameters:**
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset
- `action`: Filter by action type
- `user_id`: Filter by user

#### GET `/api/audit-logs/actions`
Get list of unique action types.

#### GET `/api/audit-logs/stats`
Get audit log statistics.

### Dashboard

#### GET `/api/dashboard/stats`
Get comprehensive dashboard statistics.

## 🎨 UI/UX

- **Professional dark theme** (black/gray palette)
- **Clean sidebar navigation**:
  - Dashboard
  - Users
  - Projects
  - Audit Logs
- **Role-based UI** (ADMIN sees create/edit buttons, VIEWER doesn't)
- **Responsive design** (mobile-friendly)
- **Graceful error handling** (401/403/500 messages)

## 🧪 Testing the System

### Test RBAC
1. Login as ADMIN → Can create users/projects
2. Login as VIEWER → Can only view, no create/edit buttons
3. Try accessing `/api/users` as VIEWER → 403 Forbidden

### Test Audit Logs
1. Login as any user
2. Create a project
3. Go to Audit Logs → See `PROJECT_CREATED` entry
4. Logout → See `USER_LOGOUT` entry

### Test Security
1. Try accessing protected routes without token → 401
2. Try modifying your own role → Should fail
3. Try disabling your own account → Should fail

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
# Server
PORT=5001
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database
DATABASE_PATH=./database.sqlite

# Default Admin
ADMIN_EMAIL=admin@secureadmin.local
ADMIN_PASSWORD=admin123

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## 📝 Database Schema

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('ADMIN', 'VIEWER')),
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### projects
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'completed', 'archived')),
  description TEXT,
  owner_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  user_email TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚀 Deployment Considerations

### Production Checklist
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Change default admin credentials
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring/alerts

### Recommended Improvements
- Add password reset flow
- Implement refresh tokens
- Add email notifications
- Set up database migrations
- Add API rate limiting
- Implement session management
- Add 2FA support
- Set up log rotation

## 📄 License

MIT License - feel free to use this for learning and portfolio purposes.

## 👨‍💻 Author

Built by [Mohammed Mishal](https://github.com/MishalHQ) as a showcase of backend engineering and security fundamentals.

---

**This is a demonstration project showcasing:**
- Clean backend architecture
- Proper authentication patterns
- Role-based access control
- Security-first thinking
- Real-world admin workflows

Not a startup, not a product—just solid engineering.