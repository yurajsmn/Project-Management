# 🎓 Student Project Management System - Complete MERN Stack Application

## 📦 Project Overview

A full-stack web application built with MERN (MongoDB, Express, React, Node.js) that allows team leaders to manage student projects, assign tasks, and track progress in real-time.

## ✨ What's Included

### Complete Backend
- ✅ 3 Mongoose models (User, Project, Task)
- ✅ 3 Controllers (Auth, Project, Task) with full business logic
- ✅ 3 Route files with 15+ API endpoints
- ✅ Authentication middleware with JWT
- ✅ Role-based authorization middleware
- ✅ Input validation with express-validator
- ✅ Password hashing with bcryptjs
- ✅ CORS configuration
- ✅ Error handling

### Complete Frontend
- ✅ 6 Pages (Login, Register, AdminDashboard, MemberDashboard, ProjectPage, TaskPage)
- ✅ 3 Components (Navbar, PrivateRoute, Form components)
- ✅ Auth Context for state management
- ✅ API utility with axios interceptors
- ✅ Responsive UI with Tailwind CSS
- ✅ Protected routes with role-based access
- ✅ Form validation
- ✅ Error handling and loading states

### Documentation
- ✅ README.md - Complete project documentation
- ✅ SETUP.md - Step-by-step setup guide
- ✅ BACKEND.md - Backend architecture & API details
- ✅ FRONTEND.md - Frontend structure & components
- ✅ DEPLOYMENT.md - Deployment to Railway, Vercel, etc.
- ✅ Postman collection for API testing

## 🏗️ Project Structure

```
Ethara Ai/
│
├── backend/
│   ├── models/
│   │   ├── User.js                    # User schema with password hashing
│   │   ├── Project.js                 # Project schema with members
│   │   └── Task.js                    # Task schema with status tracking
│   │
│   ├── controllers/
│   │   ├── authController.js          # Register, login, getMe
│   │   ├── projectController.js       # CRUD operations for projects
│   │   └── taskController.js          # CRUD operations for tasks
│   │
│   ├── routes/
│   │   ├── authRoutes.js              # Auth endpoints
│   │   ├── projectRoutes.js           # Project endpoints
│   │   └── taskRoutes.js              # Task endpoints
│   │
│   ├── middleware/
│   │   └── auth.js                    # JWT verification & role authorization
│   │
│   ├── server.js                      # Express app setup
│   ├── package.json                   # Dependencies
│   ├── .env.example                   # Environment template
│   └── BACKEND.md                     # Backend documentation
│
├── frontend/
│   ├── public/
│   │   └── index.html                 # HTML entry point
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js               # Login page with validation
│   │   │   ├── Register.js            # Registration with role selection
│   │   │   ├── AdminDashboard.js      # Admin stats and projects
│   │   │   ├── MemberDashboard.js     # Member tasks view
│   │   │   ├── ProjectPage.js         # Project details & member management
│   │   │   └── TaskPage.js            # Task management & creation
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.js              # Top navigation bar
│   │   │   └── PrivateRoute.js        # Protected route wrapper
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js         # Global auth state
│   │   │
│   │   ├── utils/
│   │   │   └── api.js                 # Axios instance with interceptors
│   │   │
│   │   ├── App.js                     # Main app with routing
│   │   ├── index.js                   # React entry point
│   │   ├── index.css                  # Global styles
│   │   └── App.css                    # App component styles
│   │
│   ├── package.json                   # Dependencies
│   ├── .env.example                   # Environment template
│   └── FRONTEND.md                    # Frontend documentation
│
├── README.md                          # Main documentation
├── SETUP.md                           # Quick start guide
├── DEPLOYMENT.md                      # Deployment guide
├── Student_Project_Management.postman_collection.json  # API tests
└── .gitignore                         # Git ignore file
```

## 🔌 API Endpoints (15+)

### Authentication (3 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects (6 endpoints)
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects` - Get all projects
- `GET /api/projects/my-projects` - Get user's projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/add-member` - Add member (admin only)
- `GET /api/projects/:projectId/stats` - Get project stats

### Tasks (7 endpoints)
- `POST /api/tasks` - Create task (admin only)
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/my-tasks` - Get user's tasks
- `GET /api/tasks/:id` - Get task details
- `PATCH /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id` - Update task (admin only)
- `DELETE /api/tasks/:id` - Delete task (admin only)

## 🎯 Features

### Authentication & Security
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes
- Token expiration (7 days)
- Input validation
- CORS enabled

### Admin Features
- ✅ Create and manage projects
- ✅ Add members to projects
- ✅ Create and assign tasks
- ✅ Update task details and status
- ✅ Delete tasks
- ✅ View all projects and tasks
- ✅ View project statistics

### Member Features
- ✅ View assigned projects
- ✅ View assigned tasks
- ✅ Update task status (todo → in-progress → done)
- ✅ Submit work via links
- ✅ View project details

### Dashboard Statistics
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment
```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/student-project-management
JWT_SECRET=your_secret_key
PORT=5000

# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Services
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

### 4. Open in Browser
```
http://localhost:3000
```

**See SETUP.md for detailed instructions**

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  title: String,
  description: String,
  createdBy: ObjectId (User),
  members: [ObjectId] (User[]),
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  projectId: ObjectId (Project),
  assignedTo: ObjectId (User),
  deadline: Date,
  status: 'todo' | 'in-progress' | 'done',
  submissionLink: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Role-Based Access Control

| Feature | Admin | Member |
|---------|:-----:|:------:|
| Create Projects | ✅ | ❌ |
| Add Members | ✅ | ❌ |
| Create Tasks | ✅ | ❌ |
| Assign Tasks | ✅ | ❌ |
| Update Task Info | ✅ | ❌ |
| Delete Tasks | ✅ | ❌ |
| View All Projects | ✅ | ❌ |
| View Assigned Tasks | ✅ | ✅ |
| Update Own Task Status | ✅ | ✅ |
| Submit Work | ✅ | ✅ |

## 🧪 Testing with Postman

1. **Import Collection**: `Student_Project_Management.postman_collection.json`
2. **Setup Environment Variables**: `base_url`, `token`
3. **Run Test Flow**:
   - Register users
   - Login
   - Create projects
   - Add members
   - Create tasks
   - Update task status

**See README.md for detailed Postman guide**

## 🚢 Deployment

### Backend (Railway)
```bash
railway login
railway init
railway up
```

### Frontend (Vercel)
```bash
npm run build
# Deploy build folder to Vercel
```

**See DEPLOYMENT.md for detailed instructions**

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation with full feature list |
| SETUP.md | Quick start and detailed setup guide |
| BACKEND.md | Backend architecture and API reference |
| FRONTEND.md | Frontend structure and components |
| DEPLOYMENT.md | Deployment to production guide |
| BACKEND_MODELS.md | Database schemas and models |

## 🛠️ Tech Stack Details

### Backend
- **Express.js** v4.18 - Web framework
- **Mongoose** v7 - MongoDB ODM
- **jsonwebtoken** v9 - JWT authentication
- **bcryptjs** v2.4 - Password hashing
- **express-validator** v7 - Input validation
- **cors** v2.8 - Cross-origin support
- **dotenv** v16 - Environment variables

### Frontend
- **React** 18 - UI library
- **React Router** v6 - Client-side routing
- **Axios** v1.3 - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **React Hooks** - State management

### Database
- **MongoDB** v5+ - NoSQL database
- **Mongoose** v7 - Schema validation

## ✅ Quality Assurance

- ✅ Input validation on all endpoints
- ✅ Error handling with meaningful messages
- ✅ JWT token verification
- ✅ Role-based access control
- ✅ Password encryption
- ✅ CORS protection
- ✅ Production-ready code
- ✅ Modular architecture
- ✅ Clean and readable code
- ✅ Async/await patterns

## 🔍 Key Files Explained

### Backend Entry Point
`server.js` - Initializes Express, MongoDB connection, routes, middleware

### Frontend Entry Point
`App.js` - Sets up routing, auth context, page components

### Authentication
`authController.js` - Register, login, generate JWT tokens
`auth.js` (middleware) - Verify tokens, authorize roles

### Business Logic
`projectController.js` - Project CRUD operations
`taskController.js` - Task CRUD and status updates

## 🎓 Learning Path

1. **Setup** - Follow SETUP.md
2. **Explore** - Review folder structure
3. **Understand** - Read BACKEND.md and FRONTEND.md
4. **Test** - Use Postman collection
5. **Modify** - Add your own features
6. **Deploy** - Follow DEPLOYMENT.md

## 🚀 Next Steps

1. **Complete the setup** following SETUP.md
2. **Test the application** with Postman
3. **Explore the code** and understand the flow
4. **Customize** the UI and add more features
5. **Deploy** to production

## 📞 Support

- Refer to documentation files
- Check error messages in console
- Verify environment variables
- Ensure MongoDB is running
- Check port availability

## 📝 License

MIT - Free to use for educational and commercial projects

---

**Ready to get started? Follow the SETUP.md guide!** 🚀

Built with ❤️ for developers by developers
