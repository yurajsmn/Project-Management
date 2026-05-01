# System Architecture & Flow Diagrams

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Login/Register → Dashboard (Admin/Member) → Project Page │   │
│  │                                                          │   │
│  │ Pages: Login, Register, AdminDashboard,                 │   │
│  │        MemberDashboard, ProjectPage, TaskPage           │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              AuthContext (State Management)              │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Axios API Client (HTTP Requests)               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    (REST API calls over HTTP)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Routes (3 route files)                      │   │
│  │  /auth/register, /auth/login, /auth/me                  │   │
│  │  /projects (CRUD), /tasks (CRUD)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Middleware (Authentication & Authorization)            │   │
│  │  - verifyToken: JWT validation                          │   │
│  │  - authorizeRole: Role-based access control             │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Controllers (Business Logic)                │   │
│  │  - authController: Auth operations                       │   │
│  │  - projectController: Project operations                │   │
│  │  - taskController: Task operations                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │    Models (MongoDB Schemas with Mongoose)               │   │
│  │  - User: name, email, password, role                    │   │
│  │  - Project: title, description, members                 │   │
│  │  - Task: title, deadline, status, assignedTo            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    (MongoDB Queries)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Collections:                                            │   │
│  │  - users (authentication & roles)                        │   │
│  │  - projects (project management)                        │   │
│  │  - tasks (task assignment & tracking)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
USER REGISTRATION:
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ Fill form (name, email, password, role)
       ↓
┌──────────────────┐
│  Register Page   │ 
└──────┬───────────┘
       │ Submit
       ↓
┌──────────────────────────────────────────┐
│ POST /auth/register                      │
│ Body: {name, email, password, role}     │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Backend: authController.register()   │
│ - Validate input                     │
│ - Hash password                      │
│ - Create user in DB                  │
│ - Generate JWT token                 │
└──────┬────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Response with token & user data      │
└──────┬────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Store token in localStorage          │
│ Redirect to dashboard                │
└──────────────────────────────────────┘
```

## 📱 User Session Flow

```
ADMIN WORKFLOW:
┌──────────┐
│  Login   │─────→ ┌──────────────────┐
└──────────┘       │ Admin Dashboard  │──────→ Create Project
                   └──────────────────┘
                           ↓
                   ┌──────────────────┐
                   │ Project Details  │──────→ Add Members
                   └──────────────────┘
                           ↓
                   ┌──────────────────┐
                   │  Task Manager    │──────→ Create/Assign Tasks
                   └──────────────────┘
                           ↓
                   ┌──────────────────┐
                   │ View Statistics  │──────→ Monitor Progress
                   └──────────────────┘

MEMBER WORKFLOW:
┌──────────┐
│  Login   │─────→ ┌──────────────────┐
└──────────┘       │ Member Dashboard │
                   └──────────────────┘
                           ↓
                   ┌──────────────────┐
                   │ View My Tasks    │──────→ Update Status
                   └──────────────────┘
                           ↓
                   ┌──────────────────┐
                   │ Submit Work      │──────→ Add submission link
                   └──────────────────┘
```

## 🔄 API Request Flow

```
CREATING A TASK (Admin Only):

Frontend (React Component)
         │
         ├─ User fills form
         │
         ├─ Submit form
         │
         └─ Call: taskAPI.createTask(data)
                    │
                    ↓
Axios Request Handler
         │
         ├─ Get token from localStorage
         │
         ├─ Add Authorization header
         │
         └─ POST /api/tasks
                    │
                    ↓
Express Middleware
         │
         ├─ verifyToken: Check JWT
         │
         ├─ authorizeRole: Check if admin
         │
         └─ Next to route handler
                    │
                    ↓
Route Handler (taskRoutes.js)
         │
         └─ POST /api/tasks → taskController.createTask()
                    │
                    ↓
Task Controller
         │
         ├─ Validate input data
         │
         ├─ Check project exists
         │
         ├─ Check user is project creator
         │
         ├─ Check assignedTo is project member
         │
         └─ Create task in database
                    │
                    ↓
Mongoose Query
         │
         ├─ Connect to MongoDB
         │
         ├─ Insert new task document
         │
         └─ Return created task
                    │
                    ↓
Send Response to Frontend
         │
         ├─ Status 201 (Created)
         │
         └─ Body: { message, task }
                    │
                    ↓
Frontend (React)
         │
         ├─ Receive response
         │
         ├─ Update component state
         │
         ├─ Show success message
         │
         └─ Reload task list
```

## 🔐 Authorization Levels

```
PUBLIC (No Auth):
- POST /auth/register
- POST /auth/login

AUTHENTICATED (Any Role):
- GET /auth/me
- GET /projects
- GET /projects/my-projects
- GET /projects/:id
- GET /tasks/my-tasks
- GET /tasks/:id
- PATCH /tasks/:id/status

ADMIN ONLY:
- POST /projects (Create)
- POST /projects/add-member (Add member)
- POST /tasks (Create)
- PUT /tasks/:id (Update)
- DELETE /tasks/:id (Delete)

MEMBER (Limited):
- PATCH /tasks/:id/status (Only own tasks)
- GET /tasks/my-tasks
- GET /projects (View assigned)
```

## 📊 Data Model Relationships

```
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ↓          ↓          ↓
            ┌─────────┐ ┌──────────┐ ┌──────────┐
            │ createdBy  │  members   │ assignedTo │
            └────┬────┘ └─────┬─────┘ └────┬─────┘
                 │           │             │
                 ↓           ↓             ↓
            ┌──────────────┐  │       ┌────────────┐
            │   Project    │──┘       │   Task     │
            └──────────────┘          └────────────┘
                 │
                 │ projectId
                 │
                 └─→ [Tasks]
```

## 🔄 Token Management

```
Login Request
     ↓
Backend generates JWT:
- Payload: {id: userId, role: userRole}
- Signed with: JWT_SECRET
- Expires in: 7 days
     ↓
Send token to frontend
     ↓
Frontend stores in localStorage
     ↓
For each API request:
- Read token from localStorage
- Add to Authorization header: "Bearer <token>"
- Send with request
     ↓
Backend receives request
- Extract token from header
- Verify with JWT_SECRET
- If valid: Extract id and role, allow request
- If invalid/expired: Return 401 Unauthorized
     ↓
If token expires:
- Frontend clears localStorage
- Redirects to login page
- User must login again
```

## 🎯 Component State Management

```
┌──────────────────────────────────────┐
│        AuthContext (Global)          │
│  - user: Current user object         │
│  - token: JWT token                  │
│  - loading: Auth check loading       │
│  - login(): Authenticate user        │
│  - register(): Create new user       │
│  - logout(): Clear auth              │
└──────────────────────────────────────┘
         ↓    ↑
    useAuth hook
         │    │
         ↓    ↑
┌──────────────────────────────────────┐
│    Protected Route (Role Check)      │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│      Page Components                 │
│  - Manage local state                │
│  - Call APIs                         │
│  - Display data                      │
└──────────────────────────────────────┘
```

## 🚀 Deployment Architecture

```
DEVELOPMENT:
┌─────────────────┐        ┌──────────────────┐        ┌──────────────┐
│  Frontend       │────→   │  Backend         │────→   │  MongoDB     │
│  :3000          │        │  :5000           │        │  Local       │
└─────────────────┘        └──────────────────┘        └──────────────┘

PRODUCTION:
┌──────────────────────┐        ┌──────────────────────┐
│  Frontend (Vercel)   │───────→│  Backend (Railway)   │
│  domain.vercel.app   │        │  domain.railway.app  │
└──────────────────────┘        └──────┬───────────────┘
                                       │
                                       ↓
                                ┌──────────────────┐
                                │  MongoDB Atlas   │
                                │  Cloud Database  │
                                └──────────────────┘
```

## ✅ Request/Response Flow

```
Client Request:
┌────────────────────────┐
│ Method: POST           │
│ URL: /api/projects     │
│ Headers:               │
│  - Authorization       │
│  - Content-Type        │
│ Body: { data }         │
└────────────────────────┘
         ↓
Server Processing:
┌────────────────────────┐
│ 1. Parse request       │
│ 2. Verify token        │
│ 3. Check role          │
│ 4. Validate data       │
│ 5. Process request     │
│ 6. Update database     │
│ 7. Prepare response    │
└────────────────────────┘
         ↓
Client Response:
┌────────────────────────┐
│ Status: 201 Created    │
│ Body: { data }         │
│ Headers: { ... }       │
└────────────────────────┘
         ↓
Frontend Handling:
┌────────────────────────┐
│ 1. Check status        │
│ 2. Extract data        │
│ 3. Update state        │
│ 4. Refresh UI          │
│ 5. Show feedback       │
└────────────────────────┘
```

This document provides visual understanding of:
- Overall system architecture
- Data flow between components
- Authentication and authorization
- API request handling
- Database relationships
- Deployment setup
