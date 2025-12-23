A complete e-commerce and pet adoption platform with AI chatbot assistance.

## 🌟 Features

- 🛍️ **E-Commerce** - Buy pet products with special offers
- 🐕 **Pet Adoption** - Find your perfect companion
- 🤖 **AI Chatbot** - 24/7 pet care assistance
- 📦 **Order Management** - Track orders with status timeline
- 🏷️ **Special Offers** - Dynamic discounts and deals
- 👤 **User Profiles** - Manage your account
- 🔐 **Admin Panel** - Complete management system
- 🌙 **Dark/Light Theme** - Toggle between themes
- 💳 **PayHere Integration** - Sri Lankan payment gateway

## 🚀 Live Demo

**🌐 Website:** https://serene-crumble-7a5b1f.netlify.app  
**🔧 Backend API:** https://aipowerdpetshop-production.up.railway.app  
**🤖 AI Chatbot:** https://honest-adaptation-production.up.railway.app

**Admin Login:** 

## 💻 Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- React Toastify
- React Icons

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (file uploads)

**Chatbot:**
- Python 3.8+
- FastAPI
- OpenRouter AI (Llama 3.2)

## 📦 Local Development Setup

### Prerequisites
- Node.js 16+
- MongoDB
- Python 3.8+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/mps-petcare.git
cd mps-petcare
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/mps-petcare
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHATBOT_URL=http://localhost:8000
```

Start frontend:
```bash
npm start
```

### 4. Chatbot Setup
```bash
cd chatbot
pip install -r requirements.txt
```

Create `.env` file:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

Start chatbot:
```bash
uvicorn main:app --reload --port 8000
```

### 5. Access Application
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Chatbot:** http://localhost:8000

## 🌐 Deployment Stack (100% FREE)

This project is deployed using:
- **Frontend:** Netlify (Free tier)
- **Backend:** Railway (Free tier - $5/month credit)
- **Chatbot:** Railway (Free tier - $5/month credit)
- **Database:** MongoDB Atlas (Free M0 - 512MB)

**Total Cost:** $0/month forever!

See **[SIMPLE_DEPLOYMENT_GUIDE.md](SIMPLE_DEPLOYMENT_GUIDE.md)** for complete step-by-step deployment instructions.

## 👥 Default Users

**Admin Account:**
- Email: admin@mps.com
- Password: admin123

**Test Customer:**
- Register on the site

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[FOOTER_CUSTOMIZATION_GUIDE.md](FOOTER_CUSTOMIZATION_GUIDE.md)** - Customize footer links & social media

## 🛠️ Key Features Explained

### Admin Panel
- Manage Products
- Manage Orders (with status updates)
- Manage Pets for Adoption
- Manage Special Offers
- View Analytics

### Order Timeline
Orders show complete status history:
- 🕐 Order Placed
- 🕐 Preparing Order
- 🚚 Order Shipped
- ✅ Order Delivered
- ❌ Order Cancelled (if applicable)

### Special Offers System
- Create time-limited offers
- Upload custom banners
- Set discount percentages
- Filter by category/pet type
- Automatic expiration

### AI Chatbot
- Pet care advice
- Product recommendations
- Order assistance
- 24/7 availability

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Protected admin routes
- Environment variables for secrets
- CORS configuration
- Input validation

## 📱 Responsive Design

Fully responsive on:
- Desktop (1920px+)
- Laptop (1024px)
- Tablet (768px)
- Mobile (375px)

## 🎨 Theme System

Toggle between:
- 🌙 Dark Mode (default)
- ☀️ Light Mode

## 📄 License

MIT License - Free to use for personal and commercial projects!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📧 Contact & Support

**Email:** hello@mpspetcare.lk  
**Phone:** +94 11 234 5678

### Social Media
- Facebook: https://www.facebook.com/yourpage
- Twitter: https://twitter.com/yourhandle
- Instagram: https://www.instagram.com/yourhandle
- YouTube: https://www.youtube.com/yourchannel

*(Update links in `frontend/src/components/Footer.js`)*

## 🙏 Acknowledgments

- OpenRouter AI for chatbot
- MongoDB Atlas for database
- Vercel & Render for hosting
- React community

---

**Built with ❤️ by MPS AI Solutions Pvt Ltd**

*Empowering pet care through technology*
