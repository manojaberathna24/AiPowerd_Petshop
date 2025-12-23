# 🚀 Quick Setup Guide - Run on Another Laptop

Simple steps to run MPS PetCare on any Windows laptop.

---

## 📋 **Prerequisites (Install These First)**

1. **Node.js** (v16+)  
   Download: https://nodejs.org/  
   Check: `node --version` in CMD

2. **Python** (v3.8+)  
   Download: https://python.org/downloads/  
   Check: `python --version` in CMD

3. **MongoDB** (Local OR Cloud)  
   **Option A:** Install locally - https://mongodb.com/try/download/community  
   **Option B:** Use MongoDB Atlas (free cloud) - https://mongodb.com/cloud/atlas

4. **Git** (if copying from GitHub)  
   Download: https://git-scm.com/downloads

---

## 🔧 **Step 1: Get the Project**

**Option A: From USB/Folder**
```bash
# Just copy the 'pet' folder to your Desktop
```

**Option B: From GitHub**
```bash
cd Desktop
git clone YOUR_GITHUB_URL
cd pet
```

---

## ⚙️ **Step 2: Setup Environment Files**

### Backend (.env)
Create `backend\.env`:
```
MONGO_URI=mongodb://localhost:27017/mps-petcare
JWT_SECRET=my-super-secret-key-12345
PORT=5000
```

### Frontend (.env)
Create `frontend\.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHATBOT_URL=http://localhost:8000
```

### Chatbot (.env)
Create `chatbot\.env`:
```
OPENROUTER_API_KEY=your_key_here
```

---

## 📦 **Step 3: Install Dependencies**

Open **3 separate CMD windows**:

**Window 1 - Backend:**
```bash
cd Desktop\pet\backend
npm install
```

**Window 2 - Frontend:**
```bash
cd Desktop\pet\frontend
npm install
```

**Window 3 - Chatbot:**
```bash
cd Desktop\pet\chatbot
pip install fastapi uvicorn httpx python-dotenv
```

---

## ▶️ **Step 4: Start Everything**

Keep all 3 CMD windows open:

**Window 1 - Backend:**
```bash
cd Desktop\pet\backend
node server.js
```
✅ Wait for: "🚀 Server running on port 5000"

**Window 2 - Frontend:**
```bash
cd Desktop\pet\frontend
npm start
```
✅ Browser opens automatically at http://localhost:3000

**Window 3 - Chatbot:**
```bash
cd Desktop\pet\chatbot
uvicorn main:app --host 127.0.0.1 --port 8000
```
✅ Wait for: "Application startup complete"

---

## ✅ **Step 5: Test It Works**

1. **Browser opens** → http://localhost:3000
2. **See home page** ✅
3. **Click "Register"** → Create account
4. **Login** → Works!
5. **Browse products** → All showing
6. **Open chatbot** (bottom right) → Ask question
7. **Admin login:** `admin@mps.com` / `admin123`

---

## 🛑 **To Stop Everything**

Press `Ctrl + C` in each CMD window

---

## 🔧 **Common Issues & Fixes**

### "Port already in use"
**Fix:** Close app and restart, OR use different port

### "MongoDB connection failed"
**Fix:** 
- Check MongoDB is running
- OR use MongoDB Atlas (cloud - free)

### "Module not found"
**Fix:** 
```bash
cd backend
npm install
```

### Frontend won't start
**Fix:**
```bash
cd frontend
npm install --force
npm start
```

---

## 📁 **Project Structure**

```
pet/
├── backend/          ← API (Port 5000)
├── frontend/         ← Website (Port 3000)
└── chatbot/          ← AI Bot (Port 8000)
```

---

## 🎯 **Quick Commands Reference**

**Start All (in 3 separate CMD):**
```bash
# CMD 1
cd Desktop\pet\backend && node server.js

# CMD 2  
cd Desktop\pet\frontend && npm start

# CMD 3
cd Desktop\pet\chatbot && uvicorn main:app --port 8000
```

---

## 👤 **Default Login**

**Admin:**
- Email: `admin@mps.com`
- Password: `all stop and re ru  all dservers ad gave me corectly, i want to a sigin with google and, a alredy have a admin acount, its credentials and sigin  work
`

**Regular User:**
- Register on the website

---

## 💡 **Tips**

✅ Always start backend FIRST, then frontend  
✅ Keep all 3 CMD windows open while using  
✅ Check `.env` files if something doesn't work  
✅ MongoDB must be running (if using local)

---

## 📧 **Need Help?**

Check:
1. All 3 servers running?
2. `.env` files created?
3. MongoDB connected?
4. Node modules installed?

**Still stuck? Check the console errors!**

---

**That's it! Enjoy your MPS PetCare app! 🐾**
