## Troubleshooting: Tasks Not Showing

### Root Causes:

1. **No tasks created yet** - Tasks must be created by an admin user
2. **Tasks not assigned to current user** - Tasks must have the member's user ID in the `assignedTo` field
3. **User ID mismatch** - The JWT token user ID doesn't match the task's assignedTo field

### Workflow to Test:

1. **Register an ADMIN user** (this user can create projects and tasks)
2. **Register a MEMBER user** (this user will receive tasks)
3. **Create a project** (as admin)
4. **Add the member to the project** (as admin)
5. **Create a task and assign it to the member** (as admin)
6. **View assigned tasks** (as member)

### Using Postman Collection:

The `Student_Project_Management.postman_collection.json` includes all API endpoints:

- **Auth** → Register Admin, Register Member, Login
- **Projects** → Create Project, Add Member
- **Tasks** → Create Task, Get My Tasks

### Manual Testing Steps:

#### 1. Register Admin User

```bash
POST http://localhost:5000/api/auth/register
Body:
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Save the token from response**

#### 2. Register Member User

```bash
POST http://localhost:5000/api/auth/register
Body:
{
  "name": "John Member",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

#### 3. Create Project (as Admin)

```bash
POST http://localhost:5000/api/projects
Header: Authorization: Bearer <ADMIN_TOKEN>
Body:
{
  "title": "Test Project",
  "description": "Test Description"
}
```

**Save the projectId from response**

#### 4. Add Member to Project (as Admin)

```bash
POST http://localhost:5000/api/projects/add-member
Header: Authorization: Bearer <ADMIN_TOKEN>
Body:
{
  "projectId": "<PROJECT_ID>",
  "email": "john@example.com"
}
```

#### 5. Create Task (as Admin)

```bash
POST http://localhost:5000/api/tasks
Header: Authorization: Bearer <ADMIN_TOKEN>
Body:
{
  "title": "Task 1",
  "description": "This is a test task",
  "projectId": "<PROJECT_ID>",
  "assignedTo": "<MEMBER_USER_ID>",
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

#### 6. View Tasks (as Member)

```bash
GET http://localhost:5000/api/tasks/my-tasks
Header: Authorization: Bearer <MEMBER_TOKEN>
```

### If Tasks Still Don't Show:

1. Check browser console for errors
2. Check backend terminal for server errors
3. Verify MongoDB connection is active
4. Ensure proper JWT tokens are being used
5. Check that task `assignedTo` matches the member's user ID from JWT token
