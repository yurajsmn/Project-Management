# Deployment Guide

## Backend Deployment (Railway.app)

### Prerequisites

- Railway account
- Backend code ready

### Steps

1. **Install Railway CLI**

   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**

   ```bash
   railway login
   ```

3. **Initialize Railway Project**

   ```bash
   cd backend
   railway init
   ```

4. **Add MongoDB Plugin**
   - Go to Railway dashboard
   - Click "Add Service"
   - Search for MongoDB
   - Select and add

5. **Configure Environment Variables**

   ```
   JWT_SECRET=generate_a_strong_secret_key
   NODE_ENV=production
   ```

   (MONGODB_URI is auto-set by Railway)

6. **Deploy**

   ```bash
   railway up
   ```

7. **Get Backend URL**
   - Check Railway dashboard
   - Copy the provided URL (e.g., `https://your-app.railway.app`)

### Production Checklist

- ✅ JWT_SECRET is secure and random
- ✅ NODE_ENV set to production
- ✅ MongoDB connection working
- ✅ All environment variables set
- ✅ CORS updated for frontend URL

## Frontend Deployment (Vercel)

### Prerequisites

- Vercel account
- Frontend code ready
- Backend deployed

### Steps

1. **Update Frontend Environment**
   Create `.env.production`:

   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

2. **Install Vercel CLI (Optional)**

   ```bash
   npm i -g vercel
   ```

3. **Deploy to Vercel**
   - Connect GitHub repository to Vercel
   - Or push to GitHub and import in Vercel dashboard

4. **Configure Environment Variables in Vercel**
   - Project Settings → Environment Variables
   - Add `REACT_APP_API_URL`

5. **Deploy**
   - Vercel auto-deploys on push to main branch
   - Or run `vercel --prod`

### Production Checklist

- ✅ Backend URL correctly configured
- ✅ API requests hitting production backend
- ✅ All dependencies optimized
- ✅ Build completes without warnings

## Alternative: Netlify for Frontend

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Upload to Netlify**
   - Drag and drop `build/` folder
   - Or connect GitHub repo

3. **Configure Environment Variables**
   - Site Settings → Build & Deploy → Environment
   - Add `REACT_APP_API_URL`

4. **Set Redirects**
   Create `public/_redirects`:
   ```
   /* /index.html 200
   ```

## Alternative: Render for Backend

1. **Create account at render.com**

2. **Create New Service**
   - Select "Web Service"
   - Connect GitHub repo
   - Select backend folder

3. **Configure**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

4. **Deploy**
   - Click Deploy
   - Get the service URL

## Environment Variables Summary

### Backend (Production)

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_random_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend (Production)

```
REACT_APP_API_URL=https://your-backend-deployment-url/api
```

## MongoDB Atlas Setup

1. **Create Account**
   - Go to mongodb.com/cloud/atlas
   - Sign up

2. **Create Cluster**
   - Select free tier
   - Choose region
   - Create cluster

3. **Add Database User**
   - Go to Database Access
   - Create username and password
   - Note the credentials

4. **Get Connection String**
   - Go to Cluster → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>` and `<password>`

5. **Update Backend .env**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-project-management
   ```

## Health Checks

### Backend Health Check

```bash
curl https://your-backend-url.railway.app/api/health
```

Expected response:

```json
{
  "message": "Server is running"
}
```

### Frontend

- Open https://your-frontend-url.vercel.app
- Should load login page

## Monitoring

### Railway Backend

- Visit Railway dashboard
- View logs: Logs tab
- Monitor resources: Resources tab

### Vercel Frontend

- Visit Vercel dashboard
- View deployments: Deployments tab
- Check analytics: Analytics tab

## Troubleshooting

### Backend deployment fails

- Check logs in Railway
- Verify MongoDB connection string
- Ensure all env variables are set
- Check if port 5000 is available

### Frontend can't connect to backend

- Check API URL in .env.production
- Verify backend is deployed and running
- Check CORS settings in backend
- Check browser console for errors

### Database connection fails

- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions
- Test connection locally first

### Slow performance

- Check MongoDB query optimization
- Enable caching where applicable
- Optimize image sizes
- Use CDN for static assets

## Cost Estimation

- **Railway**: Free tier with $5 monthly credit
- **Vercel**: Free tier for frontend
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: Free or minimal cost for small projects

## Scaling Tips

1. **Database**
   - Use MongoDB indexes for frequently queried fields
   - Archive old data regularly

2. **Backend**
   - Enable compression
   - Use connection pooling
   - Implement caching

3. **Frontend**
   - Code splitting with React Router
   - Lazy load components
   - Optimize bundle size

## Security in Production

- ✅ Use HTTPS only
- ✅ Set strong JWT_SECRET
- ✅ Enable MongoDB network access restrictions
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting on backend
- ✅ Regular security updates
- ✅ Use CORS carefully
