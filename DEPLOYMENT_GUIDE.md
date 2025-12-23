# 🚀 FREE Deployment Guide - MPS PetCare

Deploy your complete application **100% FREE** with all features working!

---

## 📋 **What You'll Get:**

✅ **Frontend** - React app (Vercel)  
✅ **Backend** - Node.js API (Render)  
✅ **Chatbot** - Python FastAPI (Render)  
✅ **Database** - MongoDB (Atlas Free)  
✅ **Image Storage** - Cloudinary (Free 25GB)  
✅ **Custom Domain** - Optional (can add later)

**Total Monthly Cost: $0.00** 🎉

---

## 🎯 **Step-by-Step Deployment**

### **STEP 1: Prepare Your Code**

#### 1.1 Install Git (if not installed)
Download from: https://git-scm.com/downloads

#### 1.2 Create GitHub Account
Sign up: https://github.com/signup

#### 1.3 Push Code to GitHub

```bash
# Open terminal in project folder
cd C:\Users\Manoj Aberathna\Desktop\pet

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "MPS PetCare - Initial deployment"

# Create repository on GitHub (via website)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/mps-petcare.git
git branch -M main
git push -u origin main
```

---

### **STEP 2: Setup MongoDB (Database)**

#### 2.1 Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (Free)
3. Create Organization: "MPS PetCare"

#### 2.2 Create Database
1. Click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select region: **Singapore** (closest to Sri Lanka)
4. Cluster name: `mps-petcare`
5. Click "Create"

#### 2.3 Setup Database Access
1. Database Access → Add New User
2. Username: `mpsadmin`
3. Password: Click "Autogenerate" → **SAVE THIS PASSWORD!**
4. Role: "Atlas admin"
5. Add User

#### 2.4 Setup Network Access
1. Network Access → Add IP Address
2. Click "Allow Access from Anywhere"
3. IP: `0.0.0.0/0`
4. Confirm

#### 2.5 Get Connection String
1. Database → Connect
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your password
5. **SAVE THIS!** You'll need it later

Example:
```
mongodb+srv://mpsadmin:YOUR_PASSWORD@mps-petcare.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

### **STEP 3: Setup Image Storage (Cloudinary)**

#### 3.1 Create Account
1. Go to: https://cloudinary.com/users/register/free
2. Sign up (Free tier: 25GB)

#### 3.2 Get API Credentials
1. Dashboard → API Keys
2. **SAVE THESE:**
   - Cloud Name
   - API Key
   - API Secret

---

### **STEP 4: Deploy Backend (Render)**

#### 4.1 Create Render Account
1. Go to: https://render.com/
2. Sign up with GitHub

#### 4.2 Create New Web Service
1. Dashboard → New → Web Service
2. Connect GitHub repository
3. Select `mps-petcare` repo
4. **Settings:**
   - Name: `mps-petcare-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: **Free**

#### 4.3 Add Environment Variables
Click "Advanced" → Add Environment Variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

#### 4.4 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. **SAVE YOUR BACKEND URL:** `https://mps-petcare-backend.onrender.com`

---

### **STEP 5: Deploy Chatbot (Render)**

#### 5.1 Create Another Web Service
1. Dashboard → New → Web Service
2. Select same GitHub repo
3. **Settings:**
   - Name: `mps-petcare-chatbot`
   - Root Directory: `chatbot`
   - Environment: `Python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Plan: **Free**

#### 5.2 Add Environment Variables
```
OPENROUTER_API_KEY=your_openrouter_api_key
```

#### 5.3 Deploy
1. Click "Create Web Service"
2. **SAVE YOUR CHATBOT URL:** `https://mps-petcare-chatbot.onrender.com`

---

### **STEP 6: Deploy Frontend (Vercel)**

#### 6.1 Create Vercel Account
1. Go to: https://vercel.com/signup
2. Sign up with GitHub

#### 6.2 Import Project
1. Dashboard → Add New → Project
2. Import your GitHub repository
3. **Settings:**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

#### 6.3 Add Environment Variables
```
REACT_APP_API_URL=https://mps-petcare-backend.onrender.com
REACT_APP_CHATBOT_URL=https://mps-petcare-chatbot.onrender.com
```

#### 6.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. **YOUR SITE IS LIVE!** 🎉
4. **SAVE YOUR URL:** `https://mps-petcare.vercel.app`

---

## ✅ **Verify Deployment**

### Test Each Component:

**1. Frontend:**
- Go to your Vercel URL
- Should see home page

**2. Backend:**
- Visit: `https://your-backend.onrender.com/api/health`
- Should see: `{"status": "ok"}`

**3. Database:**
- Try to register/login on your site
- Should work!

**4. Chatbot:**
- Visit chatbot on your site
- Ask a question
- Should respond!

---

## 🔧 **Configuration Files Needed**

I'll create these files for you next:
- `backend/package.json` (production scripts)
- `frontend/.env.production` (production URLs)
- `chatbot/requirements.txt` (all dependencies)
- `render.yaml` (optional - auto-deploy config)

---

## 💡 **Free Tier Limits:**

| Service | Free Limit | Enough For |
|---------|-----------|------------|
| **Vercel** | 100GB bandwidth/month | ~10,000 visitors |
| **Render** | 750 hours/month | 24/7 running |
| **MongoDB** | 512MB storage | ~10,000 orders |
| **Cloudinary** | 25GB storage | ~5,000 images |

**Perfect for testing & small business!** ✅

---

## 🚨 **Important Notes:**

1. **Render Free Tier:**
   - Services sleep after 15 min inactivity
   - First request takes 30-60 sec to wake up
   - Solution: Use a service like UptimeRobot to ping every 14 min

2. **Environment Variables:**
   - NEVER commit `.env` files to GitHub
   - Always add them in hosting platform

3. **Updates:**
   - Push to GitHub → Auto-deploys to Vercel/Render

---

## 🔄 **Auto-Deploy Setup:**

Every time you push to GitHub:
- ✅ Frontend auto-deploys (Vercel)
- ✅ Backend auto-deploys (Render)
- ✅ Chatbot auto-deploys (Render)

**Just code and push!** 🚀

---

## 📧 **Need Help?**

**Common Issues:**

**Issue:** Backend not connecting to MongoDB
- **Fix:** Check MongoDB connection string in Render env vars

**Issue:** Frontend can't reach backend
- **Fix:** Update `REACT_APP_API_URL` in Vercel

**Issue:** Images not uploading
- **Fix:** Add Cloudinary credentials to backend env vars

---

## 🎓 **Next Steps After Deployment:**

1. ✅ Test all features on live site
2. ✅ Setup custom domain (optional)
3. ✅ Add SSL certificate (automatic on Vercel/Render)
4. ✅ Monitor performance
5. ✅ Share your site!

---

**Ready to deploy? Let's start with STEP 1!** 🚀
