# Frontend Documentation

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Login.js          # Login page
│   │   ├── Register.js       # Registration page
│   │   ├── AdminDashboard.js # Admin dashboard with stats and projects
│   │   ├── MemberDashboard.js # Member dashboard with assigned tasks
│   │   ├── ProjectPage.js    # Project details and member management
│   │   └── TaskPage.js       # Task management and creation
│   ├── components/
│   │   ├── Navbar.js         # Top navigation bar
│   │   └── PrivateRoute.js   # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.js    # Authentication context and provider
│   ├── utils/
│   │   └── api.js            # API service with axios
│   ├── App.js                # Main App component with routing
│   ├── App.css               # App styles
│   ├── index.js              # React entry point
│   └── index.css             # Global styles
├── package.json
└── .env.example
```

## Context: AuthContext

Manages global authentication state:

- `user`: Current logged-in user object
- `token`: JWT token stored in localStorage
- `loading`: Loading state during initialization
- `login(email, password)`: Login function
- `register(name, email, password, role)`: Registration function
- `logout()`: Logout function

Usage:

```javascript
import { useAuth } from "./context/AuthContext";

const { user, token, login, register, logout } = useAuth();
```

## Components

### PrivateRoute

Wrapper component that:

- Checks if user is authenticated
- Optionally checks user role
- Redirects to login if not authenticated
- Redirects to home if role doesn't match

Usage:

```javascript
<PrivateRoute requiredRole="admin">
  <AdminDashboard />
</PrivateRoute>
```

### Navbar

Displays:

- Application name
- Current user name and role
- Logout button
- Only shown when user is authenticated

## Pages

### Login

- Email and password input
- Error message display
- Link to registration
- Stores token and redirects to dashboard

### Register

- Name, email, password inputs
- Role selection (admin/member)
- Error message display
- Link to login
- Auto-login after registration

### AdminDashboard

- Statistics: Total tasks, completed, pending, overdue
- List of all projects
- Create new project form
- Click project to view details

### MemberDashboard

- Statistics: Total, to do, in progress, done tasks
- List of assigned tasks with:
  - Task title and description
  - Project name
  - Deadline
  - Submission link (if submitted)
  - Status dropdown to update

### ProjectPage

- Project title and description
- List of project members
- Add member form (email input)
- Button to manage tasks (admin only)
- List of all tasks in project

### TaskPage

- Create new task form with:
  - Title and description
  - Assign to (dropdown of project members)
  - Deadline date/time
- List of all tasks with delete button
- Task status displayed as badge

## API Service (utils/api.js)

Axios instance with:

- Base URL: `http://localhost:5000/api`
- Auto JWT token injection in Authorization header
- Error interceptors

### Available Methods

```javascript
// Auth
authAPI.register(data);
authAPI.login(data);
authAPI.getMe();

// Projects
projectAPI.createProject(data);
projectAPI.getProjects();
projectAPI.getMyProjects();
projectAPI.getProjectById(id);
projectAPI.addMember(data);
projectAPI.getProjectStats(projectId);

// Tasks
taskAPI.createTask(data);
taskAPI.getTasksByProject(projectId);
taskAPI.getMyTasks();
taskAPI.getTaskById(id);
taskAPI.updateTaskStatus(id, data);
taskAPI.updateTask(id, data);
taskAPI.deleteTask(id);
```

## Styling

Using Tailwind CSS utility classes. Key color scheme:

- Primary: Blue-600
- Success: Green-600
- Warning: Yellow-600
- Danger: Red-600
- Background: Gray-50

## Routing

Routes configured in App.js:

```
/login                          -> Login page
/register                       -> Register page
/dashboard                      -> Admin or Member Dashboard (private)
/project/:projectId             -> Project details (private)
/project/:projectId/tasks       -> Task management (private, admin only)
/                               -> Redirect to /dashboard
```

## State Management

### Local Component State

Each page manages its own local state:

- Form data
- Loading state
- Error messages
- Lists of data

### Global Auth State

AuthContext manages:

- Current user
- Authentication token
- Login/logout functions

### API Calls

Using axios with async/await pattern.

## Error Handling

Components display error messages using:

```javascript
{
  error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  );
}
```

## Loading States

Components show loading indicator:

```javascript
if (loading) return <div>Loading...</div>;
```

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Building for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Development Tips

### Adding a New Page

1. Create file in `src/pages/`
2. Import in `App.js`
3. Add route in Routes
4. Use `useNavigate()` for navigation
5. Use `useAuth()` for user data

### Making API Calls

```javascript
import { projectAPI } from "../utils/api";

const res = await projectAPI.getProjects();
const data = res.data;
```

### Form Handling

```javascript
const [formData, setFormData] = useState({ field: "" });

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post("/endpoint", formData);
  } catch (err) {
    setError(err.response?.data?.message);
  }
};
```

### Navigation

```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/dashboard");
navigate("/project/123");
```
