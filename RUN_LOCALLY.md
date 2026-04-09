# 🚀 How to Run Backend Locally

## ⚠️ Current Issue
The deployed backend at `https://house-rental-backend-1-5gyd.onrender.com` is returning 404 errors because:
- It's not deployed
- Or it has outdated code
- Or the free tier is sleeping

## ✅ Solution: Run Locally

### **Step 1: Start Backend Server**

Open terminal in backend folder:
```bash
cd House-Rental-Backend-main
npm install
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.fjb09bl.mongodb.net
Server running on port 5000
```

### **Step 2: Update Frontend URLs**

You need to change ALL backend URLs in frontend from:
```
https://house-rental-backend-1-5gyd.onrender.com
```

To:
```
http://localhost:5000
```

### **Files to Update:**

1. **NotificationBell.jsx** (3 places)
2. **HomePage.jsx** (1 place)
3. **DashboardPage.jsx** (multiple places)
4. **RentalContext.jsx** (multiple places)
5. Any other component making API calls

---

## 🔄 Quick Fix: Create API Config File

Instead of changing URLs everywhere, create a config file:

### **Create: `src/config/api.js`**
```javascript
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### **Create: `.env` in frontend root**
```
REACT_APP_API_URL=http://localhost:5000
```

Then import and use:
```javascript
import { API_URL } from '../config/api';

fetch(`${API_URL}/api/notifications`, ...)
```

---

## 🧪 Test Backend is Running

Open browser and go to:
```
http://localhost:5000/api/houses
```

You should see JSON response (not 404).

---

## ⚡ Quick Start Commands

### Terminal 1 (Backend):
```bash
cd House-Rental-Backend-main
npm start
```

### Terminal 2 (Frontend):
```bash
cd House-Rental-Frontend-main
npm start
```

Both should be running simultaneously!

---

## 🔍 Verify Everything Works

1. Backend running on: `http://localhost:5000`
2. Frontend running on: `http://localhost:3000`
3. MongoDB connected (check backend terminal)
4. No 404 errors in browser console

---

**After this, all features will work! 🎉**
