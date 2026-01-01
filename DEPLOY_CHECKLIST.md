# 🚀 Quick Deploy Checklist

Follow this checklist to deploy in 10 minutes:

## ✅ Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] You have a Railway account (free)
- [ ] You have your GitHub connected to Railway

---

## 🔧 Backend Deployment

- [ ] Create new Railway project from GitHub repo
- [ ] Select `MishalHQ/aevon-console`
- [ ] Click on backend service
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=<random-string>`
  - [ ] `ADMIN_EMAIL=admin@secureadmin.local`
  - [ ] `ADMIN_PASSWORD=admin123`
  - [ ] `DATABASE_PATH=./database.sqlite`
- [ ] Set Root Directory: `backend`
- [ ] Set Start Command: `npm start`
- [ ] Click Deploy
- [ ] Generate domain
- [ ] Copy backend URL: `_______________________________`

---

## 🎨 Frontend Deployment

- [ ] Click on frontend service
- [ ] Add environment variable:
  - [ ] `REACT_APP_API_URL=<backend-url>/api`
- [ ] Set Root Directory: `frontend`
- [ ] Set Build Command: `npm run build`
- [ ] Set Start Command: `npx serve -s build -l $PORT`
- [ ] Click Deploy
- [ ] Wait for build (~3 min)
- [ ] Generate domain
- [ ] Copy frontend URL: `_______________________________`

---

## 🔄 Final Steps

- [ ] Go back to backend service
- [ ] Add variable: `FRONTEND_URL=<frontend-url>`
- [ ] Redeploy backend
- [ ] Open frontend URL in browser
- [ ] Login with admin credentials
- [ ] Test all features work

---

## 🎉 Success!

Your app is now live at:
- **Frontend**: `_______________________________`
- **Backend**: `_______________________________`

Share it with the world! 🌍

---

## 📝 Post-Deployment

- [ ] Change default admin password
- [ ] Create your own admin account
- [ ] Disable default admin
- [ ] Test from different devices
- [ ] Add to portfolio/resume

---

**Total Time: ~10 minutes**
**Cost: FREE**