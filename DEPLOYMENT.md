# 🚀 AEVON Console - Production Deployment Guide

## Overview

This guide will help you deploy AEVON Console to production using:
- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Railway, Render, or Vercel

---

## 🎯 Quick Deploy (Recommended)

### Option 1: Vercel (Frontend + Backend)

#### Deploy Frontend to Vercel

1. **Push your code to GitHub** (already done)

2. **Go to Vercel**: https://vercel.com

3. **Import Project**:
   - Click "Add New" → "Project"
   - Import from GitHub: `MishalHQ/aevon-console`
   - Select the repository

4. **Configure Frontend**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   
5. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   REACT_APP_ENV=production
   ```

6. **Deploy**: Click "Deploy"

#### Deploy Backend to Vercel

1. **Create New Project** in Vercel

2. **Import same repository**: `MishalHQ/aevon-console`

3. **Configure Backend**:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: (leave empty)
   
4. **Environment Variables**:
   ```
   PORT=5001
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ADMIN_EMAIL=admin@aevon.com
   ADMIN_PASSWORD=your-secure-password
   ```

5. **Deploy**: Click "Deploy"

6. **Update Frontend Environment**:
   - Go back to frontend project settings
   - Update `REACT_APP_API_URL` with your backend URL
   - Redeploy frontend

---

### Option 2: Railway (Backend) + Vercel (Frontend)

#### Deploy Backend to Railway

1. **Go to Railway**: https://railway.app

2. **New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `MishalHQ/aevon-console`

3. **Configure**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

4. **Environment Variables**:
   ```
   PORT=5001
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ADMIN_EMAIL=admin@aevon.com
   ADMIN_PASSWORD=your-secure-password
   ```

5. **Generate Domain**:
   - Go to Settings → Networking
   - Generate a public domain
   - Copy the URL (e.g., `https://aevon-backend.up.railway.app`)

6. **Deploy Frontend to Vercel** (same as Option 1)
   - Use Railway backend URL in `REACT_APP_API_URL`

---

### Option 3: Render (Backend) + Vercel (Frontend)

#### Deploy Backend to Render

1. **Go to Render**: https://render.com

2. **New Web Service**:
   - Connect GitHub repository
   - Select `MishalHQ/aevon-console`

3. **Configure**:
   - **Name**: aevon-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   PORT=5001
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ADMIN_EMAIL=admin@aevon.com
   ADMIN_PASSWORD=your-secure-password
   ```

5. **Create Service**

6. **Deploy Frontend to Vercel** (same as Option 1)

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change `ADMIN_PASSWORD` to a secure password
- [ ] Update `FRONTEND_URL` to your actual frontend URL
- [ ] Enable HTTPS (automatic on Vercel/Railway/Render)
- [ ] Review CORS settings in `backend/src/server.js`
- [ ] Add rate limiting (already configured)
- [ ] Set up monitoring and logging

---

## 🗄️ Database Options

### Current: SQLite (Local)
- ✅ Simple, no setup required
- ✅ Works for single-server deployments
- ❌ Not suitable for multi-server scaling
- ❌ Data lost on server restart (on some platforms)

### Recommended: Supabase (Cloud PostgreSQL)

1. **Create Supabase Project**: https://supabase.com

2. **Get Connection Details**:
   - Project URL
   - Anon Key
   - Service Key

3. **Add to Backend Environment**:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   ```

4. **Migrate Database** (future enhancement):
   - Create tables in Supabase
   - Update backend to use Supabase client
   - Migrate existing data

### Alternative: Firebase Firestore

1. **Create Firebase Project**: https://firebase.google.com

2. **Enable Firestore**

3. **Get Service Account Key**

4. **Update Backend** to use Firebase SDK

---

## 💳 Payment Integration (Stripe)

### Setup Stripe

1. **Create Stripe Account**: https://stripe.com

2. **Get API Keys**:
   - Publishable Key (frontend)
   - Secret Key (backend)
   - Webhook Secret

3. **Add to Environment Variables**:

   **Backend**:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

   **Frontend**:
   ```
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

4. **Create Products in Stripe Dashboard**:
   - Student Templates: $49-$99
   - Business Services: $1,500-$5,000

5. **Implement Payment Flow** (future enhancement):
   - Add Stripe checkout component
   - Create payment routes in backend
   - Handle webhooks for payment confirmation

---

## 🚀 Deployment Commands

### Frontend (Vercel CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

### Backend (Railway CLI)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway up
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

All platforms support automatic deployments:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Deploy**:
   - Vercel/Railway/Render detect changes
   - Automatically build and deploy
   - Live in 1-2 minutes

### Branch Deployments

- **Main branch** → Production
- **Dev branch** → Staging
- **Feature branches** → Preview deployments

---

## 📊 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** (built-in)
   - Page views
   - Performance metrics
   - User analytics

2. **Sentry** (error tracking)
   - Frontend errors
   - Backend errors
   - Performance monitoring

3. **LogRocket** (session replay)
   - User sessions
   - Bug reproduction
   - Performance insights

---

## 🎨 Custom Domain

### Add Custom Domain (Vercel)

1. **Go to Project Settings** → Domains

2. **Add Domain**: `console.aevon.com`

3. **Configure DNS**:
   - Add CNAME record
   - Point to Vercel

4. **SSL Certificate**: Automatic

---

## 🧪 Testing Production Build Locally

### Frontend

```bash
cd frontend
npm run build
npx serve -s build -p 3000
```

### Backend

```bash
cd backend
NODE_ENV=production npm start
```

---

## 📝 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend health check works: `/health`
- [ ] Login functionality works
- [ ] Dashboard displays data
- [ ] Projects CRUD operations work
- [ ] Demo showcase is accessible
- [ ] Mobile responsive design works
- [ ] HTTPS is enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking works
- [ ] Error monitoring set up

---

## 🆘 Troubleshooting

### Frontend Issues

**Problem**: API calls failing
**Solution**: Check `REACT_APP_API_URL` in environment variables

**Problem**: Build fails
**Solution**: Clear cache and rebuild
```bash
rm -rf node_modules build
npm install
npm run build
```

### Backend Issues

**Problem**: Database not initializing
**Solution**: Check file permissions and environment variables

**Problem**: CORS errors
**Solution**: Update `FRONTEND_URL` in backend environment

**Problem**: 502 Bad Gateway
**Solution**: Check backend logs, ensure server is running

---

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review deployment logs
3. Test locally first
4. Check environment variables

---

## 🎉 Success!

Your AEVON Console is now live in production!

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-backend.railway.app

**Next Steps**:
1. Share with clients and students
2. Monitor usage and performance
3. Collect feedback
4. Iterate and improve

---

**Last Updated**: 2024-12-31