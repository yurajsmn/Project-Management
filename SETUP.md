# Quick Start Guide

## 📋 Prerequisites

- Node.js v14+ installed
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn package manager
- Git (optional)
- Postman (for API testing)

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Setup Database

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string

### Step 3: Configure Environment

**Backend (.env):**
```bash
cd backend
cp .env.example .env

# Edit .env:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-project-management
JWT_SECRET=change_me_to_random_string_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env

# Edit .env:
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend running on http://localhost:3000
```

### Step 5: Test in Browser

1. Open http://localhost:3000
2. Register as Admin or Member
3. Start using the app!

## 📚 Complete Setup Guide

### Prerequisites Detailed

**Node.js Installation**
- Download from https://nodejs.org
- Choose LTS version
- Verify: `node --version` and `npm --version`

**MongoDB Installation**

Windows:
- Download from https://www.mongodb.com/try/download/community
- Run installer
- MongoDB starts automatically

macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Linux (Ubuntu):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Backend Setup Detailed

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Installs:
   - express: Web framework
   - mongoose: MongoDB ODM
   - jsonwebtoken: JWT authentication
   - bcryptjs: Password hashing
   - express-validator: Input validation
   - cors: Cross-origin requests
   - dotenv: Environment variables

3. **Setup environment:**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student-project-management
   JWT_SECRET=your_secure_random_secret_key_here_12345
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

5. **Verify MongoDB is running:**
   ```bash
   # Test connection
   mongo mongodb://localhost:27017/student-project-management
   # Type 'exit' to quit
   ```

6. **Start backend:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # OR Production mode
   npm start
   ```

7. **Verify backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"message":"Server is running"}
   ```

### Frontend Setup Detailed

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file:**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start frontend:**
   ```bash
   npm start
   ```

6. **Browser opens automatically:**
   - If not, go to http://localhost:3000

## 🧪 Testing the Application

### Manual Testing

1. **Register as Admin:**
   - Email: admin@example.com
   - Password: password123
   - Role: Admin
   - Click Register

2. **Register as Member:**
   - Email: member@example.com
   - Password: password123
   - Role: Member

3. **Login and Test:**
   - Create a project (Admin)
   - Add member to project (Admin)
   - Create tasks (Admin)
   - Update task status (Member)

### Postman Testing

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `Student_Project_Management.postman_collection.json`

2. **Setup Environment Variables:**
   - Create new environment
   - Add variables:
     - `base_url`: `http://localhost:5000/api`
     - `token`: (leave empty, will fill after login)

3. **Run Test Flow:**
   - Register admin
   - Login admin
   - Save token to environment
   - Create project
   - Add members
   - Create tasks
   - Test as member

## 📱 Application Features

### Admin Dashboard
- View all projects
- Create new projects
- Add members to projects
- See statistics (total, completed, pending tasks)
- Manage all tasks

### Member Dashboard
- View assigned projects
- View assigned tasks
- Update task status
- Submit work

### Admin Can:
✅ Create projects
✅ Add members
✅ Create tasks
✅ Assign tasks
✅ View all data
✅ Delete tasks
✅ Update task info

### Members Can:
✅ View assigned tasks
✅ Update task status
✅ Submit work links
❌ Cannot create projects
❌ Cannot create tasks

## 🐛 Troubleshooting

### Backend won't start

**Error: Port 5000 already in use**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

**Error: Cannot connect to MongoDB**
- Check if MongoDB service is running
- Verify connection string in .env
- Try: `mongosh --version`

**Error: Module not found**
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start

**Error: Port 3000 already in use**
```bash
# Kill process
lsof -i :3000
kill -9 <PID>
```

**Error: Cannot reach backend**
- Check backend is running on port 5000
- Verify `REACT_APP_API_URL` in .env
- Check CORS is enabled in backend

### CORS Error in Browser

Add to browser console to debug:
```javascript
console.log(localStorage.getItem('token'));
```

### JWT Token Issues

- Clear localStorage: `localStorage.clear()`
- Re-login
- Check JWT_SECRET is same in .env

## 🔐 Security Notes

- Change `JWT_SECRET` to a random string (min 32 chars)
- Never commit `.env` file
- Passwords are hashed with bcryptjs
- Tokens expire after 7 days
- Use HTTPS in production

## 📦 Folder Structure Explained

```
backend/
├── models/          # Database schemas
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth & validation
└── server.js        # Entry point

frontend/
├── pages/           # Full pages
├── components/      # Reusable components
├── context/         # State management
├── utils/           # Helper functions
└── App.js           # Main component
```

## 🚢 Deployment

### Quick Deploy to Production

**Backend:**
- Railway: `railway up`
- Render: Connect GitHub
- Heroku: `git push heroku main`

**Frontend:**
- Vercel: Connect GitHub
- Netlify: Drag & drop build folder

See DEPLOYMENT.md for detailed instructions.

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Documentation](https://jwt.io)

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB installed/connected
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env files configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register and login
- [ ] Can create projects
- [ ] Can create tasks
- [ ] Task status updates work

## 🆘 Need Help?

1. Check the README.md for detailed docs
2. Check BACKEND.md for API docs
3. Check FRONTEND.md for component docs
4. Check DEPLOYMENT.md for deployment info
5. Review error messages in console
6. Check MongoDB logs

## 🎯 Next Steps

1. Complete the Quick Setup
2. Test the application manually
3. Run Postman tests
4. Explore the codebase
5. Deploy to production
6. Add more features as needed

Happy Coding! 🚀
