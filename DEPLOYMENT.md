# 🚀 Deployment Guide - Railway (Free 24/7 Hosting)

Deploy your Secure Admin Console to Railway for free 24/7 hosting - no credit card needed!

---

## 📋 What You'll Get

- ✅ **Backend API**: Live at `https://your-app.up.railway.app`
- ✅ **Frontend**: Live at `https://your-frontend.up.railway.app`
- ✅ **24/7 Uptime**: No need to run locally
- ✅ **Auto-deploy**: Push to GitHub = automatic deployment
- ✅ **Free Tier**: $5 credit/month (enough for 24/7)

---

## 🎯 Quick Deploy (10 minutes)

### Step 1: Sign Up for Railway

1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Search and select **`MishalHQ/aevon-console`**
4. Railway will detect both `backend/` and `frontend/` folders

---

## 🔧 Step 3: Deploy Backend

Railway will create a service for the backend automatically.

1. **Click on the backend service** in your project
2. Go to **"Variables"** tab
3. **Add these environment variables**:

```env
NODE_ENV=production
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING
ADMIN_EMAIL=admin@secureadmin.local
ADMIN_PASSWORD=admin123
DATABASE_PATH=./database.sqlite
```

**🔐 Generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as `JWT_SECRET` value.

4. Go to **"Settings"** tab
5. Scroll to **"Deploy"** section
6. Set:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

7. Click **"Deploy"** button (top right)
8. Wait for deployment to complete (~2 minutes)

9. Go to **"Settings"** → **"Networking"**
10. Click **"Generate Domain"**
11. **Copy the URL** (e.g., `https://aevon-console-backend-production.up.railway.app`)

✅ **Backend is now live!**

---

## 🎨 Step 4: Deploy Frontend

1. **Click on the frontend service** (or create new service from same repo)
2. Go to **"Variables"** tab
3. **Add this environment variable**:

```env
REACT_APP_API_URL=https://YOUR_BACKEND_URL.up.railway.app/api
```

**Replace `YOUR_BACKEND_URL` with the backend URL from Step 3!**

4. Go to **"Settings"** tab
5. Scroll to **"Deploy"** section
6. Set:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s build -l $PORT`

7. Click **"Deploy"** button
8. Wait for build to complete (~3-4 minutes)

9. Go to **"Settings"** → **"Networking"**
10. Click **"Generate Domain"**
11. **Copy the URL** (e.g., `https://aevon-console-frontend-production.up.railway.app`)

✅ **Frontend is now live!**

---

## 🔄 Step 5: Update Backend CORS

Now that frontend is deployed, update backend to allow frontend URL:

1. Go back to **backend service**
2. Go to **"Variables"** tab
3. **Add new variable**:

```env
FRONTEND_URL=https://YOUR_FRONTEND_URL.up.railway.app
```

4. Click **"Redeploy"** button (top right)

✅ **CORS configured!**

---

## ✅ Step 6: Test Your Deployment

1. **Open your frontend URL** in browser
2. **Login with**:
   - **Admin**: `admin@secureadmin.local` / `admin123`
   - **Viewer**: `viewer@secureadmin.local` / `viewer123`

3. **Test features**:
   - ✅ Dashboard loads with stats
   - ✅ Users page works (ADMIN only)
   - ✅ Projects page works
   - ✅ Audit logs visible
   - ✅ Logout works

🎉 **You're live!**

---

## 🔒 Security: Change Default Passwords

**Important:** After first login, change the default passwords!

1. Login as admin
2. Go to **Users** page
3. Click **"Create User"** to add your own admin account
4. Logout and login with new account
5. Disable the default admin account

---

## 🔄 Auto-Deploy on Git Push

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
```

Railway detects the push and redeploys automatically! 🚀

---

## 📊 Railway Free Tier

- **$5 free credit per month**
- **500 hours of usage** (enough for 24/7 hosting)
- **100GB bandwidth**
- **1GB RAM per service**

Perfect for portfolio projects!

---

## 🔧 Troubleshooting

### Backend won't start
**Check logs:**
1. Go to backend service
2. Click "Deployments" tab
3. Click latest deployment
4. View logs for errors

**Common issues:**
- Missing `JWT_SECRET` variable
- Wrong `Root Directory` (should be `backend`)
- Missing dependencies (Railway auto-installs)

### Frontend shows "Network Error"
**Check:**
1. `REACT_APP_API_URL` is correct (must include `/api`)
2. Backend is running (check backend logs)
3. CORS is configured (backend has `FRONTEND_URL`)

**Test backend directly:**
```bash
curl https://your-backend-url.up.railway.app/health
```

Should return: `{"status":"ok",...}`

### Database not initializing
**Check backend logs for:**
- "Database initialized successfully" message
- Any SQLite errors

**Railway provides persistent storage** - database file persists across deployments.

---

## 📝 Your Live URLs

After deployment, save these:

- **Frontend**: `https://your-frontend.up.railway.app`
- **Backend API**: `https://your-backend.up.railway.app`
- **Health Check**: `https://your-backend.up.railway.app/health`

Share your frontend URL with anyone - it's live 24/7! 🌍

---

## 🎓 Alternative: Deploy via Railway CLI

If you prefer command line:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../frontend
railway up
```

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Check Railway logs** for detailed error messages

---

## 🎉 Success!

Your Secure Admin Console is now:
- ✅ Hosted 24/7 on Railway
- ✅ Accessible from anywhere
- ✅ No need to run VS Code
- ✅ Auto-deploys on git push
- ✅ Completely FREE

**Deployment time: ~10 minutes**
**Cost: FREE (Railway free tier)**

---

## 📸 Share Your Project

Add these to your portfolio/resume:
- Live URL: `https://your-frontend.up.railway.app`
- GitHub: `https://github.com/MishalHQ/aevon-console`
- Tech Stack: React, Node.js, Express, SQLite, JWT, Railway

🚀 **You're now a deployed full-stack developer!**