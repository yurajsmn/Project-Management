# Backend Setup & API Documentation

## Database Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'member'], default: 'member'),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model

```javascript
{
  title: String (required),
  description: String (required),
  createdBy: ObjectId (ref: User, required),
  members: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  title: String (required),
  description: String (required),
  projectId: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User, required),
  deadline: Date (required),
  status: String (enum: ['todo', 'in-progress', 'done'], default: 'todo'),
  submissionLink: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Middleware

### Authentication Middleware (`verifyToken`)

- Checks for JWT token in Authorization header
- Decodes token and extracts user ID and role
- Adds `userId` and `userRole` to request object
- Returns 401 if token is missing or invalid

### Authorization Middleware (`authorizeRole`)

- Takes array of allowed roles
- Checks if user role is in allowed roles
- Returns 403 if role is not authorized

## API Endpoints Summary

| Method | Endpoint                   | Auth | Role  | Description            |
| ------ | -------------------------- | ---- | ----- | ---------------------- |
| POST   | /auth/register             | No   | -     | Register new user      |
| POST   | /auth/login                | No   | -     | Login user             |
| GET    | /auth/me                   | Yes  | Any   | Get current user       |
| POST   | /projects                  | Yes  | Admin | Create project         |
| GET    | /projects                  | Yes  | Any   | Get all projects       |
| GET    | /projects/my-projects      | Yes  | Any   | Get user's projects    |
| GET    | /projects/:id              | Yes  | Any   | Get project details    |
| POST   | /projects/add-member       | Yes  | Admin | Add member to project  |
| GET    | /projects/:projectId/stats | Yes  | Any   | Get project statistics |
| POST   | /tasks                     | Yes  | Admin | Create task            |
| GET    | /tasks/project/:projectId  | Yes  | Any   | Get tasks by project   |
| GET    | /tasks/my-tasks            | Yes  | Any   | Get user's tasks       |
| GET    | /tasks/:id                 | Yes  | Any   | Get task details       |
| PATCH  | /tasks/:id/status          | Yes  | Any   | Update task status     |
| PUT    | /tasks/:id                 | Yes  | Admin | Update task            |
| DELETE | /tasks/:id                 | Yes  | Admin | Delete task            |

## Starting the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-project-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## CORS Configuration

The backend allows requests from any origin by default. For production, update `cors()` in server.js:

```javascript
app.use(
  cors({
    origin: "https://your-frontend-domain.com",
  }),
);
```

## Error Responses

### Invalid Input

```json
{
  "errors": [
    {
      "msg": "Invalid email format",
      "param": "email"
    }
  ]
}
```

### Unauthorized

```json
{
  "message": "No token, authorization denied"
}
```

### Forbidden

```json
{
  "message": "Access denied"
}
```

### Not Found

```json
{
  "message": "Project not found"
}
```

### Server Error

```json
{
  "message": "Internal server error"
}
```
