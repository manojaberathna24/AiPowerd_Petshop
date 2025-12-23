# 🚀 Quick Deployment Checklist

## Before You Start:
- [ ] Create GitHub account
- [ ] Install Git on your computer
- [ ] Have admin email & password ready

---

## Step 1: MongoDB Atlas (Database)
- [ ] Create account: https://mongodb.com/cloud/atlas/register
- [ ] Create FREE cluster (M0)
- [ ] Add database user
- [ ] Allow network access (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Save connection string securely

---

## Step 2: Cloudinary (Images)
- [ ] Create account: https://cloudinary.com/users/register/free
- [ ] Copy Cloud Name
- [ ] Copy API Key
- [ ] Copy API Secret
- [ ] Save credentials securely

---

## Step 3: Push to GitHub
```bash
git init
git add .
git commit -m "Initial deployment"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```
- [ ] Code pushed to GitHub

---

## Step 4: Deploy Backend (Render)
- [ ] Create Render account: https://render.com
- [ ] New Web Service
- [ ] Connect GitHub repo
- [ ] Root directory: `backend`
- [ ] Start command: `node server.js`
- [ ] Add environment variables:
  - [ ] MONGO_URI
  - [ ] JWT_SECRET
  - [ ] FRONTEND_URL
- [ ] Deploy
- [ ] Save backend URL

---

## Step 5: Deploy Chatbot (Render)
- [ ] New Web Service on Render
- [ ] Root directory: `chatbot`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Add OPENROUTER_API_KEY
- [ ] Deploy
- [ ] Save chatbot URL

---

## Step 6: Deploy Frontend (Vercel)
- [ ] Create Vercel account: https://vercel.com
- [ ] Import GitHub project
- [ ] Root directory: `frontend`
- [ ] Add environment variables:
  - [ ] REACT_APP_API_URL (your backend URL)
  - [ ] REACT_APP_CHATBOT_URL (your chatbot URL)
- [ ] Deploy
- [ ] Save frontend URL

---

## Step 7: Test Everything
- [ ] Visit frontend URL
- [ ] Register new account
- [ ] Login works
- [ ] Browse products
- [ ] Add to cart
- [ ] Complete checkout
- [ ] View orders
- [ ] Test chatbot
- [ ] Test admin login
- [ ] Test admin panel

---

## 🎉 **Deployment Complete!**

**Your URLs:**
- Frontend: https://_____________.vercel.app
- Backend: https://_____________.onrender.com
- Chatbot: https://_____________.onrender.com

**Share your site with the world!** 🌍
