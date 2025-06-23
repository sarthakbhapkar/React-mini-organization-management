# Mini Org Viewer - Backend API

A simple CRUD application for organization management with authentication. Built with Express.js, TypeScript, and in-memory data storage.

## Quick Start

### Using npm
```bash
npm install
npm start
```

### Using Docker
```bash
docker build -t mini-org-viewer .
docker run -p 3000:3000 mini-org-viewer
```

## API Documentation

The server runs on `http://localhost:3000`

### Test Credentials
- **Admin**: `admin@company.com` / `admin123`

### Key Endpoints
- `POST /api/auth/login` - Login
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- `GET /api/auth/me` - Get current user
- `GET /api/users` - List users (with pagination/filters via query params: `page`, `limit`, `search`, `team_id`, `role`)
- `POST /api/users` - Create user (Admin only)
  ```json
  {
    "email": "string",
    "name": "string", 
    "password": "string",
    "role": "TEAM_LEAD|MEMBER" // optional
  }
  ```
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team (Admin only)
  ```json
  {
    "name": "string",
    "description": "string", // optional
    "team_lead_id": "string"
  }
  ```
- `GET /api/leave/policies` - Get leave policies
- `POST /api/leave/requests` - Submit leave request
  ```json
  {
    "leave_type": "string",
    "start_date": "string", // YYYY-MM-DD format
    "end_date": "string",   // YYYY-MM-DD format
    "reason": "string"      // optional
  }
  ```
- `GET /api/org/hierarchy` - Organization hierarchy