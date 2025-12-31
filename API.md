# AEVON Console - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Endpoints

### 1. Authentication

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@aevon.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@aevon.com",
    "role": "admin"
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

#### Logout
```http
POST /auth/logout
```

**Headers:** `Authorization: Bearer TOKEN`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 2. Dashboard

#### Get Statistics
```http
GET /dashboard/stats
```

**Headers:** `Authorization: Bearer TOKEN`

**Response (200):**
```json
{
  "totalProjects": 10,
  "activeProjects": 3,
  "completedProjects": 5,
  "demoProjects": 2
}
```

**Errors:**
- `401` - Unauthorized (missing/invalid token)
- `500` - Server error

---

### 3. Projects

#### Get All Projects (Protected)
```http
GET /projects
```

**Headers:** `Authorization: Bearer TOKEN`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "E-commerce Platform",
    "type": "Business",
    "status": "Active",
    "description": "Full-featured online store",
    "tech_stack": "React, Node.js, MongoDB",
    "is_demo": 1,
    "created_at": "2024-01-15 10:30:00",
    "updated_at": "2024-01-15 10:30:00"
  }
]
```

---

#### Get Demo Projects (Public)
```http
GET /projects/demos
```

**No authentication required**

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "E-commerce Platform",
    "type": "Business",
    "status": "Completed",
    "description": "Full-featured online store",
    "tech_stack": "React, Node.js, MongoDB",
    "is_demo": 1,
    "created_at": "2024-01-15 10:30:00",
    "updated_at": "2024-01-15 10:30:00"
  }
]
```

---

#### Get Single Project
```http
GET /projects/:id
```

**Headers:** `Authorization: Bearer TOKEN`

**Response (200):**
```json
{
  "id": 1,
  "name": "E-commerce Platform",
  "type": "Business",
  "status": "Active",
  "description": "Full-featured online store",
  "tech_stack": "React, Node.js, MongoDB",
  "is_demo": 1,
  "created_at": "2024-01-15 10:30:00",
  "updated_at": "2024-01-15 10:30:00"
}
```

**Errors:**
- `404` - Project not found

---

#### Create Project
```http
POST /projects
```

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:**
```json
{
  "name": "New Project",
  "type": "Business",
  "status": "Planned",
  "description": "Project description",
  "tech_stack": "React, Node.js",
  "is_demo": false
}
```

**Field Validations:**
- `name` (required) - Project name
- `type` (required) - Must be: "Business", "Student", or "Internal Demo"
- `status` (required) - Must be: "Planned", "Active", or "Completed"
- `description` (optional) - Project description
- `tech_stack` (optional) - Technologies used
- `is_demo` (optional) - Boolean, default: false

**Response (201):**
```json
{
  "id": 2,
  "name": "New Project",
  "type": "Business",
  "status": "Planned",
  "description": "Project description",
  "tech_stack": "React, Node.js",
  "is_demo": 0,
  "created_at": "2024-01-15 11:00:00",
  "updated_at": "2024-01-15 11:00:00"
}
```

**Errors:**
- `400` - Validation error (missing required fields or invalid values)
- `500` - Server error

---

#### Update Project
```http
PUT /projects/:id
```

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Project Name",
  "type": "Student",
  "status": "Active",
  "description": "Updated description",
  "tech_stack": "React, Node.js, PostgreSQL",
  "is_demo": true
}
```

**Response (200):**
```json
{
  "id": 2,
  "name": "Updated Project Name",
  "type": "Student",
  "status": "Active",
  "description": "Updated description",
  "tech_stack": "React, Node.js, PostgreSQL",
  "is_demo": 1,
  "created_at": "2024-01-15 11:00:00",
  "updated_at": "2024-01-15 11:30:00"
}
```

**Errors:**
- `400` - Validation error
- `404` - Project not found
- `500` - Server error

---

#### Delete Project
```http
DELETE /projects/:id
```

**Headers:** `Authorization: Bearer TOKEN`

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

**Errors:**
- `404` - Project not found
- `500` - Server error

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (token expired)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example Usage with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aevon.com",
    "password": "admin123"
  }'
```

### Get Dashboard Stats
```bash
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Project",
    "type": "Business",
    "status": "Active",
    "description": "A great project",
    "tech_stack": "React, Node.js",
    "is_demo": true
  }'
```

### Get Demo Projects (Public)
```bash
curl http://localhost:5000/api/projects/demos
```

### Update Project
```bash
curl -X PUT http://localhost:5000/api/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "Completed"
  }'
```

### Delete Project
```bash
curl -X DELETE http://localhost:5000/api/projects/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Example Usage with JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Login
const login = async () => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: 'admin@aevon.com',
    password: 'admin123'
  });
  return response.data.token;
};

// Get projects (with token)
const getProjects = async (token) => {
  const response = await axios.get(`${API_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Create project
const createProject = async (token, projectData) => {
  const response = await axios.post(`${API_URL}/projects`, projectData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get demos (public, no token needed)
const getDemos = async () => {
  const response = await axios.get(`${API_URL}/projects/demos`);
  return response.data;
};
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Implement rate limiting middleware
- Recommended: 100 requests per 15 minutes per IP
- Use packages like `express-rate-limit`

---

## CORS

Currently allows all origins in development. For production:
- Configure CORS to allow only your frontend domain
- Update `cors()` configuration in `backend/src/server.js`

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Change JWT_SECRET in .env**
3. **Implement rate limiting**
4. **Add request validation middleware**
5. **Enable CORS only for trusted domains**
6. **Add API versioning** (e.g., `/api/v1/...`)
7. **Implement refresh tokens** for better security
8. **Add request logging** for monitoring

---

**Last Updated:** 2024-01-15