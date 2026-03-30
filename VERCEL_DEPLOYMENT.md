/* Vercel Deployment Guide for FraudCheckr */

## Frontend Deployment (React + Vite) → Vercel

### Step 1: Connect GitHub Repository
1. Push your code to GitHub if not already done
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "Add New Project"
5. Select your `efcc-convictions-explorer` repository
6. Click "Import"

### Step 2: Configure Build Settings
- **Framework Preset**: Other
- **Build Command**: `cd Frontend && npm install && npm run build`
- **Output Directory**: `Frontend/dist`
- **Install Command**: `npm install -g pnpm && pnpm install`

### Step 3: Add Environment Variables
In Vercel dashboard, go to Settings → Environment Variables and add:

```
VITE_API_URL=https://your-backend-api.com
```

Replace `https://your-backend-api.com` with your actual backend URL (see Backend Deployment below).

### Step 4: Deploy
Click "Deploy" and Vercel will automatically build and deploy your React app.

---

## Backend Deployment (FastAPI)

### Option A: Deploy to Railway (Recommended for Quick Setup)

1. **Create Account**: Go to [railway.app](https://railway.app)
2. **Create New Project** → Select "GitHub"
3. **Select Repository**: Choose your repo
4. **Add PostgreSQL** (optional, if you need database)
5. **Create** and Railway will auto-detect Flask/Python app
6. **Configure**:
   - Environment: Add `PORT=5000`
   - Service Port: 5000
7. **Deploy** and get your public domain

### Option B: Deploy to Render.com

1. Go to [render.com](https://render.com)
2. Click **+ New** → **Web Service**
3. Select your GitHub repo
4. **Configure**:
   - Name: `fraudcheckr-api`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 5000`
5. **Deploy**

### Option C: Deploy to Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create fraudcheckr-api

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Update Frontend API Endpoint

Once your backend is deployed, update the API URL in your React components:

### In `Frontend/src/pages/SearchResultsPage.jsx` and other API calls:

Change from:
```javascript
const response = await axios.get('http://localhost:8000/search', ...)
```

To:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
const response = await axios.get(`${API_URL}/search`, ...)
```

---

## Step-by-Step Deployment Commands

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Vercel (Automatic)
- Just push to GitHub, Vercel will auto-deploy
- Or manually trigger in dashboard

### 3. Backend (Railway Example)
```bash
# Navigate to your project
cd ~/efcc-convictions-explorer

# Railway CLI commands:
railway up
# Follow the prompts and deployment will start
```

---

## Verify Deployment

After both frontend and backend are deployed:

1. **Frontend**: Visit `https://your-project.vercel.app`
2. **Backend**: Visit `https://your-api-url.com/`, should see {"message": "..."}
3. **Check API Connection**: Open browser console, try a search
4. **Monitor**: Use Vercel and Railway/Render dashboards to monitor logs

---

## Environment Variables Summary

### Frontend (.env.local in Frontend/)
```
VITE_API_URL=https://your-backend-api.com
```

### Backend (.env in root)
```
DATABASE_URL=your_database_url (if using database)
ENVIRONMENT=production
```

---

## Troubleshooting

**"Build failed in Vercel"**
- Check build logs in Vercel dashboard
- Ensure `cd Frontend && npm run build` completes locally
- Check for Node version compatibility

**"API connection errors"**
- Verify VITE_API_URL is set correctly
- Check backend is running (visit API URL directly)
- Check CORS settings in FastAPI backend

**"Build successful but page blank"**
- Check browser console for errors
- Verify API_URL environment variable is loaded
- Check that React Router paths are correct

---

## Quick Commands Reference

```bash
# Local development
cd Frontend && npm run dev        # Frontend
python main.py                    # Backend (separate terminal)

# Build for production
cd Frontend && npm run build

# Deploy to Vercel
git push origin main              # Auto-deploys if connected

# Check deployment status
vercel deploy --prod              # Via Vercel CLI
```

---

## Final Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Backend deployed (Railway/Render/Heroku)
- [ ] VITE_API_URL environment variable set in Vercel
- [ ] API endpoints updated in Frontend code
- [ ] CORS enabled in FastAPI backend
- [ ] Frontend builds successfully
- [ ] API requests work from production
- [ ] Custom domain configured (optional)

