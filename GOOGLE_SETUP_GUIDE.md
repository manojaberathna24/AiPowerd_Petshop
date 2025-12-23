# 🔵 Google Cloud Console Setup Guide

**Complete this FIRST before coding!**

---

## Step 1: Go to Google Cloud Console

🔗 **Open:** https://console.cloud.google.com

**Sign in** with your Google account

---

## Step 2: Create New Project

1. Click **"Select a project"** (top left, near Google Cloud logo)
2. Click **"NEW PROJECT"** button
3. **Project name:** `MPS-PetCare`
4. Click **"CREATE"**
5. Wait for project creation (~10 seconds)
6. **Select the new project** from the dropdown

---

## Step 3: Enable Google Sign-In API

1. Go to: **APIs & Services** → **Library** (left sidebar)
2. Search: **"Google Identity"** or **"Google Sign-In"**
3. Click: **"Google+ API"** (or similar)
4. Click: **"ENABLE"** button
5. Wait for activation

---

## Step 4: Configure OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen** (left sidebar)
2. **User Type:** Select **"External"**
3. Click **"CREATE"**

**Fill in App Information:**
- **App name:** `MPS PetCare`
- **User support email:** Your email (select from dropdown)
- **App logo:** Skip for now
- **App domain:** Leave blank for now
- **Developer contact:** Your email

4. Click **"SAVE AND CONTINUE"**

**Scopes Screen:**
- Click **"SAVE AND CONTINUE"** (no changes needed)

**Test users:** (Optional)
- Click **"SAVE AND CONTINUE"**

**Summary:**
- Click **"BACK TO DASHBOARD"**

---

## Step 5: Create OAuth 2.0 Credentials

1. Go to: **APIs & Services** → **Credentials** (left sidebar)
2. Click: **"+ CREATE CREDENTIALS"** (top)
3. Select: **"OAuth client ID"**

**If prompted "Configure Consent Screen":**
- Click the button
- Follow Step 4 above

**Application type:** Select **"Web application"**

**Name:** `MPS PetCare Web Client`

**Authorized JavaScript origins:**
Click **"+ ADD URI"** and add:
```
http://localhost:3000
```

**Authorized redirect URIs:**
Click **"+ ADD URI"** and add:
```
http://localhost:3000
```

4. Click **"CREATE"**

---

## Step 6: Copy Your Client ID

A popup will show:
- ✅ **Your Client ID** (long string)
- ⚠️ Client Secret (not needed for frontend OAuth)

**IMPORTANT:** 
1. **Copy the Client ID** (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
2. Click **"OK"**

**You can find it again:**
- Go to **Credentials** page
- Find your OAuth 2.0 Client ID
- Click the name to view details

---

## Step 7: Save Client ID

**Paste it here temporarily:**
```
Client ID: ___________________________________________
```

---

## ✅ Setup Complete!

**What you have now:**
- ✅ Google Cloud Project created
- ✅ OAuth consent screen configured
- ✅ OAuth 2.0 credentials created
- ✅ Client ID obtained

**Next:** I'll help you add this to the code!

---

## 🆘 Troubleshooting

**Problem:** Can't find "APIs & Services"
- **Solution:** Click hamburger menu (☰) top-left

**Problem:** "OAuth consent screen" says "Configure"
- **Solution:** Follow Step 4 completely first

**Problem:** Lost the Client ID
- **Solution:** Go to Credentials → Click your OAuth client → See Client ID

---

**Ready? Once you have your Client ID, let me know and I'll add it to the code!** 🚀
