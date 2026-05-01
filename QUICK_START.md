# Quick Start Guide

## 🚀 Running the Application

### Terminal 1 - Backend

```powershell
cd "c:\Users\yuraj\Downloads\Ethara Ai\backend"
npm run dev
```

Backend will run on: **http://localhost:5000**

### Terminal 2 - Frontend

```powershell
cd "c:\Users\yuraj\Downloads\Ethara Ai\frontend"
npm start
```

Frontend will run on: **http://localhost:3001** (or 3000 if available)

---

## 🔐 Test Accounts

### Option 1: Create New Accounts

1. Go to Register page
2. Fill in details
3. Choose role (admin or member)

### Option 2: Use Test Credentials (after registering)

```
Admin Email: admin@example.com
Admin Password: password123
Role: admin

Member Email: john@example.com
Member Password: password123
Role: member
```

---

## 📝 User Workflow

### Admin User Can:

- ✅ View Academic Overview dashboard
- ✅ See all projects and statistics
- ✅ Create new projects
- ✅ Add members to projects
- ✅ Create tasks and assign to members
- ✅ View project details and team composition
- ✅ Track task progress and completion rates

### Member User Can:

- ✅ View "My Tasks" dashboard
- ✅ See assigned tasks with details
- ✅ Update task status (To Do → In Progress → Done)
- ✅ Submit work via submission links
- ✅ View task deadlines
- ✅ Track personal task statistics

---

## 🔗 Navigation

**Admin Dashboard:**

- Admin login → Dashboard → Project Portfolio → Click project to manage tasks

**Member Dashboard:**

- Member login → Dashboard → View "My Tasks" → Update status/submit work

---

## 📊 Dashboard Sections

### Admin Dashboard

- **Total Projects:** Number of active projects
- **Active Tasks:** Total tasks across all projects
- **Tasks Due Today:** Tasks with today's deadline
- **Completion Rate:** Percentage of completed tasks
- **Active Project Portfolio:** List of all projects
- **Task Allocation:** Task distribution chart
- **Urgent Milestones:** Next 3 due tasks

### Member Dashboard

- **Total Tasks:** Count of assigned tasks
- **To Do:** Tasks not started
- **In Progress:** Tasks being worked on
- **Done:** Completed tasks
- **Your Assigned Tasks:** Detailed task list with status dropdown
- **Submission Link:** Add/update work submission links

---

## ⚙️ Available Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/add-member` - Add member to project

### Tasks

- `GET /api/tasks/my-tasks` - Get assigned tasks
- `GET /api/tasks/project/:projectId` - Get tasks for project
- `POST /api/tasks` - Create task (admin only)
- `PATCH /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id` - Update task details (admin only)
- `DELETE /api/tasks/:id` - Delete task (admin only)

---

## 🛠️ Troubleshooting

### Port Already in Use

- Backend: Kill process on 5000 and restart
- Frontend: Will automatically use 3001 if 3000 is busy

### Tasks Not Showing

1. Verify admin created a project
2. Verify member was added to project
3. Verify admin created and assigned task to member
4. Check browser console for errors (F12)

### Login Issues

1. Verify user exists (register if needed)
2. Check correct email/password
3. Check browser console for errors
4. Try clearing browser cache (Ctrl+Shift+Delete)

### Network Errors

1. Verify both backend and frontend are running
2. Check firewall isn't blocking ports 5000 or 3001
3. Verify MongoDB is connected (check backend logs)
4. Check CORS settings in backend

---

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Recommended: Chrome/Edge

---

## 📞 Support

If you encounter issues:

1. Check the browser console (F12 → Console tab)
2. Check the backend terminal for errors
3. Review the TASK_TROUBLESHOOTING.md for detailed API testing
4. Review DASHBOARD_FIXES.md for recent changes
