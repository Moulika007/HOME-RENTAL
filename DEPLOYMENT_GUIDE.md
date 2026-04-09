# 🚀 Deployment Guide: Home Rental Application

This guide walk you through deploying your project to **Render** (Backend) and **Vercel** (Frontend).

---

## 🛠️ Phase 1: Backend Deployment (Render.com)

1.  **Create Account**: Log in to [Render](https://render.com).
2.  **New Web Service**: Click **New +** > **Web Service**.
3.  **Connect GitHub**: Connect your GitHub account and select the `HOME-RENTAL` repository.
4.  **Configure Service**:
    *   **Name**: `home-rental-backend`
    *   **Root Directory**: `House-Rental-Backend-main`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  **Environment Variables**: Click **Advanced** > **Add Environment Variable**:
    *   `PORT`: `5000`
    *   `MONGO_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://...`)
    *   `JWT_SECRET`: Any long random string (e.g., `supersecret123`)
6.  **Deploy**: Click **Create Web Service**.
7.  **Get Your URL**: Once deployed, copy the Render URL (e.g., `https://home-rental-backend.onrender.com`). **You will need this for the frontend.**

---

## 🌐 Phase 2: Frontend Deployment (Vercel.com)

1.  **Create Account**: Log in to [Vercel](https://vercel.com).
2.  **Add New Project**: Click **Add New** > **Project**.
3.  **Import Repository**: Select your `HOME-RENTAL` repository.
4.  **Configure Project**:
    *   **Root Directory**: `House-Rental-Frontend-main`
    *   **Framework Preset**: Select **Vite** (it should auto-detect).
5.  **Environment Variables**: Expand the **Environment Variables** section and add:
    *   **Key**: `VITE_API_BASE_URL`
    *   **Value**: Your Render Backend URL (e.g., `https://home-rental-backend.onrender.com`)
6.  **Deploy**: Click **Deploy**.

---

## ✅ Phase 3: Verification

1.  **Final Checks**:
    *   Ensure your MongoDB Atlas **Network Access** allows `0.0.0.0/0` (Add IP > Allow Access from Anywhere).
    *   Open your Vercel URL and try to Register/Login.
    *   Check the Render logs if you see any "Internal Server Error".

---

> [!TIP]
> **Important Note**: Render's free tier "sleeps" after 15 minutes of inactivity. When you first visit your website after a break, it might take 30-60 seconds for the backend to wake up and load data.
