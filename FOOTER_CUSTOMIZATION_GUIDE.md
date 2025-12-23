# 📝 How to Customize Footer Links and Social Media

This guide explains how to update the footer links and social media URLs in your MPS PetCare application.

---

## 📋 Table of Contents

1. [Policy Pages](#policy-pages)
2. [Social Media Links](#social-media-links)
3. [Contact Information](#contact-information)
4. [File Locations](#file-locations)

---

## 📄 Policy Pages

### Where Files Are Located

```
frontend/src/pages/
├── PrivacyPolicy.js    → Privacy Policy page
├── TermsOfService.js   → Terms of Service page
└── CookiePolicy.js     → Cookie Policy page
```

### How to Edit Policy Content

1. **Open the file** you want to edit (e.g., `PrivacyPolicy.js`)
2. **Find the content sections** wrapped in `<section>` tags
3. **Edit the text** to match your company's policies

**Example:**
```javascript
<section>
    <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
    <p>We collect information you provide directly to us, including:</p>
    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
        <li>Your custom text here</li>
        <li>Add more items as needed</li>
    </ul>
</section>
```

4. **Update dates**: Change "Last updated: December 22, 2025" to current date
5. **Update contact info**: Change email and phone numbers to yours

---

## 📱 Social Media Links

### Current Setup

The footer includes links for:
- Facebook
- Twitter (X)
- Instagram
- YouTube

### How to Change Social Media URLs

**File to Edit:** `frontend/src/components/Footer.js`

**Find this section** (around line 96):

```javascript
{/* Social Media Links */}
<div className="flex space-x-4">
    <a 
        href="https://www.facebook.com/yourpage"  // ← CHANGE THIS
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-500 transition-colors"
    >
        <FaFacebook className="text-xl" />
    </a>
    
    <a 
        href="https://twitter.com/yourhandle"  // ← CHANGE THIS
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-400 transition-colors"
    >
        <FaTwitter className="text-xl" />
    </a>
    
    <a 
        href="https://www.instagram.com/yourhandle"  // ← CHANGE THIS
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-pink-500 transition-colors"
    >
        <FaInstagram className="text-xl" />
    </a>
    
    <a 
        href="https://www.youtube.com/yourchannel"  // ← CHANGE THIS
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-red-500 transition-colors"
    >
        <FaYoutube className="text-xl" />
    </a>
</div>
```

### Steps to Update:

1. **Replace URLs** with your actual social media links:
   ```javascript
   href="https://www.facebook.com/MPSPetCare"
   href="https://twitter.com/MPSPetCare"
   href="https://www.instagram.com/mpspetcare"
   href="https://www.youtube.com/@MPSPetCare"
   ```

2. **Remove unwanted platforms**: Delete the entire `<a>` tag if you don't use that platform

3. **Add new platforms**: Copy an existing `<a>` block and change the URL and icon

### Adding More Social Media Icons

**Available Icons** (from `react-icons/fa`):
- `FaLinkedin` - LinkedIn
- `FaTiktok` - TikTok
- `FaWhatsapp` - WhatsApp
- `FaTelegram` - Telegram
- `FaDiscord` - Discord

**Example - Adding LinkedIn:**

1. **Import the icon** at the top of `Footer.js`:
   ```javascript
   import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
   ```

2. **Add the link** in the social media section:
   ```javascript
   <a 
       href="https://www.linkedin.com/company/mpspetcare" 
       target="_blank" 
       rel="noopener noreferrer"
       className="text-gray-400 hover:text-blue-600 transition-colors"
   >
       <FaLinkedin className="text-xl" />
   </a>
   ```

---

## 📞 Contact Information

### Where to Update

**File:** `frontend/src/components/Footer.js`

**Find this section** (around line 68):

```javascript
<li className="flex items-center text-gray-400">
    <FiMapPin className="mr-2 text-primary-400" />
    <span>123 Pet Street, Colombo, Sri Lanka</span>  ← CHANGE
</li>
<li className="flex items-center text-gray-400">
    <FiPhone className="mr-2 text-primary-400" />
    <span>+94 11 234 5678</span>  ← CHANGE
</li>
<li className="flex items-center text-gray-400">
    <FiMail className="mr-2 text-primary-400" />
    <span>hello@mpspetcare.lk</span>  ← CHANGE
</li>
```

### Steps:

1. **Update address** to your shop/office location
2. **Update phone** to your business phone
3. **Update email** to your support email

---

## 📁 File Locations Summary

```
MPS PetCare Project
│
├── frontend/src/
│   ├── components/
│   │   └── Footer.js                    ← Social media & contact links
│   │
│   └── pages/
│       ├── PrivacyPolicy.js             ← Privacy policy content
│       ├── TermsOfService.js            ← Terms & conditions
│       └── CookiePolicy.js              ← Cookie usage policy
```

---

## ✅ Testing Your Changes

1. **Save all files** after making changes
2. **Browser will auto-refresh** (if dev server is running)
3. **Scroll to footer** on any page
4. **Click links** to verify they work:
   - Policy pages should open in same tab
   - Social media should open in new tab
5. **Hover over icons** to see color changes

---

## 🚀 Quick Checklist

- [ ] Updated Privacy Policy content
- [ ] Updated Terms of Service content
- [ ] Updated Cookie Policy content
- [ ] Changed Facebook URL
- [ ] Changed Twitter URL
- [ ] Changed Instagram URL
- [ ] Changed YouTube URL
- [ ] Updated contact phone number
- [ ] Updated contact email
- [ ] Updated business address
- [ ] Tested all links work correctly

---

## 💡 Tips

1. **Keep it Legal**: Consult with a lawyer for accurate policy content
2. **Update Dates**: Always update "Last updated" dates when changing policies
3. **Test Links**: Click every social media link to ensure they go to correct pages
4. **Mobile View**: Check footer looks good on mobile (responsive design)
5. **SEO**: Policy pages help with SEO and build user trust

---

## 📧 Need Help?

If you need assistance customizing these pages, check:
- File: `frontend/src/components/Footer.js` for footer layout
- Files: `frontend/src/pages/Privacy*.js` for policy content
- React Icons: https://react-icons.github.io/react-icons/ for more icons

---

**Last Updated:** December 22, 2025
**Version:** 1.0
