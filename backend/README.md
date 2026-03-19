# ⚙️ Workasana - Backend API

The Workasana backend is a robust RESTful API built with Node.js and Express. It strictly follows the MVC design pattern and focuses heavily on data integrity, security, and developer logging.

## Environment Setup
To run the backend locally, create a `.env` file in the `/backend` directory:

```env
MONGODB_URI=mongodb+srv://neoGStudent:MUqeem786%24@neog.aqqwr1m.mongodb.net/workasana?retryWrites=true&w=majority&appName=neoG
JWT_SECRET=mySuperSecretKey123
NODE_ENV=development
```

# API References

### POST /auth/signup
Registers a new user and hashes the password via Bcrypt.<br>
Request Body:
```
{
  "name": "Manager Mike",
  "email": "mike@example.com",
  "password": "securepassword123"
}
```

Sample Response:
```
{
  "_id": "65b1...",
  "name": "Manager Mike",
  "email": "mike@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### GET /projects/:id
Fetch a single project along with all populated tasks assigned to it.<br>
Sample Response:
```
{
  "success": true,
  "data": {
    "_id": "65c2...",
    "name": "Website Redesign",
    "description": "Overhaul UI/UX"
  },
  "tasks": [
    {
      "_id": "65d3...",
      "name": "Design Homepage",
      "status": "In Progress",
      "owners": [{ "_id": "65b1...", "name": "Manager Mike" }]
    }
  ]
}
```

### GET /reports/pending

Calculates total active tasks and sums the remaining estimated days of work.<br>
Sample Response:
```
{
  "totalTasks": 14,
  "totalDaysPending": 32
}
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| ![](https://img.shields.io/badge/POST-198754) | `/auth/signup` |	Register new user |
| ![](https://img.shields.io/badge/POST-198754) | `/auth/login` |	Authenticate user & get JWT |
| ![](https://img.shields.io/badge/GET-0d6efd) | `/auth/me` |Get current logged-in user profile |
| ![](https://img.shields.io/badge/GET-0d6efd) | `/projects` |	Fetch all projects (with dynamic status) |
| ![](https://img.shields.io/badge/POST-198754) | `/projects` |	Create a new project |
| ![](https://img.shields.io/badge/GET-0d6efd) | `/projects/:id` |	Get project details and related tasks |
| ![](https://img.shields.io/badge/GET-0d6efd) | `/tasks` |	Fetch tasks (supports filters) |
| ![](https://img.shields.io/badge/POST-198754) | `/tasks` |	Create a task (assign tags & owners) |
| ![](https://img.shields.io/badge/PATCH-fd7e14) | `/tasks/:id` |	Update task status |
| ![](https://img.shields.io/badge/DELETE-dc3545) | `/tasks/:id` |	Delete a task |
| ![](https://img.shields.io/badge/GET-0d6efd) | `/teams` |	Fetch all teams and their populated members |
| ![](https://img.shields.io/badge/PATCH-fd7e14) | `/teams/:id/members` |	Add a user to a team |
| ![](https://img.shields.io/badge/GET-0d6efd) | `/reports/last-week` |	Get tasks completed in the last 7 days |
| ![](https://img.shields.io/badge/GET-0d6efd) | `/reports/closed-by-owner` |	Get completion stats grouped by user |


## Backend Architecture

### Strict Request Validation (Zod)

Instead of manual conditional checks, Zod schemas parse and validate incoming payloads. Failed validations are caught by the global error handler.

### Global Error Handling & Logging
A custom error.middleware.js catches all thrown errors. A custom logger (logger.js using picocolors) provides beautiful, timestamped terminal logs (ℹ️ INFO, ✅ SUCCESS, ❌ ERROR) to vastly improve the developer debugging experience.