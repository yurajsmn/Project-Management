# Student Project Management System - MERN Stack

A complete full-stack application for managing student projects. Team leaders can manage projects, assign tasks, and track progress, while students can view their tasks and submit work.

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
Ethara Ai/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── MemberDashboard.js
│   │   │   ├── ProjectPage.js
│   │   │   └── TaskPage.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
└── README.md
```

## Features

### Authentication

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access (Admin/Member)

### Admin Features

- Create projects
- Add members to projects
- Create and assign tasks
- Update task status
- Delete tasks
- View project statistics

### Member Features

- View assigned tasks
- Update task status
- Submit work via links
- View project details

### Dashboard

- Admin: Total tasks, completed, pending, overdue stats
- Member: Only their assigned tasks with status

## Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-project-management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the backend server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:

```bash
npm start
```

The frontend will open at `http://localhost:3000`

## Database Setup

### MongoDB Installation

**Option 1: Local MongoDB**

- Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service

**Option 2: MongoDB Atlas (Cloud)**

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string and update `MONGODB_URI` in `.env`

## API Documentation

### Authentication Endpoints

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

Response:

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Project Endpoints

#### Create Project (Admin only)

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Web Development Project",
  "description": "Build a responsive website"
}
```

#### Get All Projects

```http
GET /api/projects
Authorization: Bearer <token>
```

#### Get My Projects

```http
GET /api/projects/my-projects
Authorization: Bearer <token>
```

#### Get Project by ID

```http
GET /api/projects/{projectId}
Authorization: Bearer <token>
```

#### Add Member to Project

```http
POST /api/projects/add-member
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "507f1f77bcf86cd799439011",
  "email": "member@example.com"
}
```

#### Get Project Statistics

```http
GET /api/projects/{projectId}/stats
Authorization: Bearer <token>
```

### Task Endpoints

#### Create Task (Admin only)

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Create Homepage",
  "description": "Design and implement homepage",
  "projectId": "507f1f77bcf86cd799439011",
  "assignedTo": "507f1f77bcf86cd799439012",
  "deadline": "2024-05-31T17:00:00Z"
}
```

#### Get Tasks by Project

```http
GET /api/tasks/project/{projectId}
Authorization: Bearer <token>
```

#### Get My Tasks

```http
GET /api/tasks/my-tasks
Authorization: Bearer <token>
```

#### Get Task by ID

```http
GET /api/tasks/{taskId}
Authorization: Bearer <token>
```

#### Update Task Status (Member)

```http
PATCH /api/tasks/{taskId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "submissionLink": "https://drive.google.com/..."
}
```

#### Update Task (Admin only)

```http
PUT /api/tasks/{taskId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "done"
}
```

#### Delete Task (Admin only)

```http
DELETE /api/tasks/{taskId}
Authorization: Bearer <token>
```

## Postman Testing Collection

### Setup in Postman

1. Create a new collection: "Student Project Management"
2. Add environment variables:
   - `base_url` = `http://localhost:5000/api`
   - `token` = (will be set after login)

### Test Flow

#### 1. Register Admin

```
POST {{base_url}}/auth/register
Body (JSON):
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

Save token to environment variable after response.

#### 2. Register Member 1

```
POST {{base_url}}/auth/register
Body (JSON):
{
  "name": "John Member",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

#### 3. Register Member 2

```
POST {{base_url}}/auth/register
Body (JSON):
{
  "name": "Jane Member",
  "email": "jane@example.com",
  "password": "password123",
  "role": "member"
}
```

#### 4. Login as Admin

```
POST {{base_url}}/auth/login
Body (JSON):
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Set response token to `token` environment variable using script:

```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

#### 5. Get Current User

```
GET {{base_url}}/auth/me
Header: Authorization: Bearer {{token}}
```

#### 6. Create Project

```
POST {{base_url}}/projects
Header: Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "E-Commerce Platform",
  "description": "Build a full-stack e-commerce platform"
}
```

Save projectId to environment variable.

#### 7. Get All Projects

```
GET {{base_url}}/projects
Header: Authorization: Bearer {{token}}
```

#### 8. Add Member to Project

```
POST {{base_url}}/projects/add-member
Header: Authorization: Bearer {{token}}
Body (JSON):
{
  "projectId": "{{projectId}}",
  "email": "john@example.com"
}
```

#### 9. Create Task

```
POST {{base_url}}/tasks
Header: Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "Design Database Schema",
  "description": "Create MongoDB schema for products and orders",
  "projectId": "{{projectId}}",
  "assignedTo": "{{memberId}}",
  "deadline": "2024-05-31T17:00:00Z"
}
```

#### 10. Get Tasks by Project

```
GET {{base_url}}/tasks/project/{{projectId}}
Header: Authorization: Bearer {{token}}
```

#### 11. Login as Member

```
POST {{base_url}}/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

Set token to environment variable.

#### 12. Get My Tasks

```
GET {{base_url}}/tasks/my-tasks
Header: Authorization: Bearer {{token}}
```

#### 13. Update Task Status

```
PATCH {{base_url}}/tasks/{{taskId}}/status
Header: Authorization: Bearer {{token}}
Body (JSON):
{
  "status": "in-progress",
  "submissionLink": "https://github.com/user/repo"
}
```

#### 14. Get Project Statistics

```
GET {{base_url}}/projects/{{projectId}}/stats
Header: Authorization: Bearer {{token}}
```

## User Roles & Permissions

### Admin

- ✅ Create projects
- ✅ Add members to projects
- ✅ Create tasks
- ✅ Assign tasks to members
- ✅ Update task details
- ✅ Delete tasks
- ✅ View all projects
- ✅ View all tasks
- ✅ View statistics

### Member

- ❌ Cannot create projects
- ❌ Cannot add members
- ❌ Cannot create tasks
- ✅ View assigned projects
- ✅ View assigned tasks
- ✅ Update own task status
- ✅ Submit work via submission link

## Error Handling

The application handles various errors:

- **400 Bad Request**: Invalid input or validation errors
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions for the action
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

Example error response:

```json
{
  "message": "Invalid credentials"
}
```

## Input Validation

The backend includes validation for:

- Email format
- Password minimum length (6 characters)
- Required fields
- MongoDB ObjectId format
- Deadline date validation
- Status enum validation

## Deployment

### Backend Deployment (Railway)

1. Install Railway CLI
2. Login: `railway login`
3. Create project: `railway init`
4. Add MongoDB plugin
5. Set environment variables:
   - `MONGODB_URI` (auto-set by Railway)
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. Deploy: `railway up`

### Frontend Deployment (Vercel/Netlify)

1. Update `.env.production`:

   ```
   REACT_APP_API_URL=https://your-backend-url/api
   ```

2. **Vercel**:

   ```bash
   npm install -g vercel
   vercel
   ```

3. **Netlify**:
   ```bash
   npm run build
   ```
   Upload `build` folder to Netlify

## Security Considerations

- Passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- Authentication required for protected routes
- Role-based access control enforced
- Environment variables for sensitive data
- Input validation on all endpoints
- CORS enabled for frontend origin

## Development Tips

### Adding a New Feature

1. Create model in `backend/models/`
2. Create controller in `backend/controllers/`
3. Create routes in `backend/routes/`
4. Add API methods in `frontend/src/utils/api.js`
5. Create page/component in `frontend/src/pages/` or `frontend/src/components/`

### Testing with Postman

- Import the collection
- Set environment variables
- Run requests in order
- Check response status codes
- Validate response data

## Troubleshooting

### MongoDB Connection Error

- Check if MongoDB service is running
- Verify connection string in `.env`
- Check firewall settings

### JWT Token Errors

- Ensure token is passed in Authorization header
- Check if token has expired
- Verify JWT_SECRET is the same

### CORS Errors

- Check if backend is running on correct port
- Verify CORS is enabled in Express
- Check frontend API URL

### Port Already in Use

- Backend: `lsof -i :5000` and kill the process
- Frontend: `lsof -i :3000` and kill the process

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
