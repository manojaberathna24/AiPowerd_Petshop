# 🔧 QUICK FIX - Create .env File Manually

The `.env` file is protected by gitignore (which is good for security!), so you need to create it manually.

---

## ✅ **Step-by-Step:**

### **Step 1: Create the File**

1. **Open File Explorer**
2. **Navigate to:** `C:\Users\Manoj Aberathna\Desktop\pet\frontend`
3. **Right-click** in the folder → **New** → **Text Document**
4. **Name it:** `.env` (yes, just `.env` with no extension before the dot!)
   - Windows might warn you - click **Yes** to confirm

---

### **Step 2: Edit the File**

1. **Open** `.env` file with Notepad
2. **Add these 3 lines:**

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHATBOT_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
```

3. **Replace** `PASTE_YOUR_CLIENT_ID_HERE` with your **actual Google Client ID**

**Example:**
```
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
```

4. **Save** the file (Ctrl+S)

---

### **Step 3: Get Your Google Client ID**

**If you don't have it yet:**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Sign in with your Google account
3. Find your **OAuth 2.0 Client ID**
4. Click on it
5. **Copy** the Client ID (long string ending in `.apps.googleusercontent.com`)
6. **Paste** it in the `.env` file

---

### **Step 4: Restart Frontend**

Frontend is already restarting! Just wait for it to compile.

Once you see: **"Compiled successfully!"** in the terminal, you're ready!

---

### **Step 5: Test Again**

1. **Open:** http://localhost:3000/login
2. **Click:** "Sign in with Google" button
3. **Should work now!** ✅

---

## 📝 **Your .env File Should Look Like:**

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHATBOT_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

*(Replace the Client ID with your actual one!)*

---

**Need your Client ID? Check your Google Cloud Console!** 🔑
