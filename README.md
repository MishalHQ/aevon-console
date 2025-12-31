# AEVON Console

A clean, minimal, production-ready internal operations console for managing projects and showcasing demos.

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

## Project Structure

```
aevon-console/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   └── dashboard.js
│   │   ├── models/
│   │   │   └── init.js
│   │   └── server.js
│   ├── database.sqlite (auto-generated)
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── DemoShowcase.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
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

Backend will run on `http://localhost:5000`

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

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify all dependencies are installed: `npm install`
- Check .env file exists and is configured

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env
- Check browser console for CORS errors

### Database errors
- Delete database.sqlite and restart backend to recreate
- Check file permissions on database.sqlite

## License

Private - AEVON Internal Use Only

## Support

For issues or questions, contact the development team.