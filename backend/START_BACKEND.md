# 🚀 Start Career X Backend - Complete Guide

## ✅ Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v14+)
- ✅ MongoDB running (local or Atlas)
- ✅ All dependencies installed

---

## 📦 Step 1: Install Dependencies

```bash
cd backend
npm install
```

**Expected packages:**
- express, mongoose, cors, dotenv, jsonwebtoken, bcryptjs, multer, pdf-parse, mammoth, axios

---

## ⚙️ Step 2: Configure Environment

### Create `.env` file in `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/ai-career-navigator
JWT_SECRET=career-x-fyp-super-secret-jwt-key-2024-production-ready
PORT=5000
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-career-navigator?retryWrites=true&w=majority
JWT_SECRET=career-x-fyp-super-secret-jwt-key-2024-production-ready
PORT=5000
```

---

## 🗄️ Step 3: Start MongoDB

### Option A: Local MongoDB

**Windows:**
```bash
# If MongoDB is installed as service, it auto-starts
# Or start manually:
mongod --dbpath "C:\data\db"
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
# OR
mongod --dbpath /data/db
```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

---

## 🖥️ Step 4: Start Backend Server

```bash
cd backend
node server.js
```

**Expected Output:**
```
MongoDB Connected
✅ Server running on port 5000
📊 Health check: http://localhost:5000/api/health
💬 Assistant chat: POST http://localhost:5000/api/assistant/chat
```

**Keep this terminal open!** Backend must stay running.

---

## ✅ Step 5: Verify Backend is Running

### Test Health Endpoint

**Browser:**
```
http://localhost:5000/api/health
```

**Or Terminal:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "timestamp": "2024-01-14T00:00:00.000Z"
}
```

### Run Test Script

```bash
cd backend
node test-backend.js
```

This will test:
- ✅ Health endpoint
- ✅ Authentication (signup/signin)
- ✅ Dashboard endpoints
- ✅ AI Assistant
- ✅ Test Module

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB Connection Error: ...`

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   # Check if MongoDB is running
   mongosh "mongodb://localhost:27017/ai-career-navigator"
   ```

2. Check `.env` file has correct `MONGODB_URI`

3. For Atlas, verify connection string format

### Port 5000 Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Dependencies Missing

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

---

## 📊 All Endpoints Available

### ✅ Authentication
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/social-login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### ✅ Dashboard
- `GET /api/jobs/applications`
- `GET /api/resume/list`
- `GET /api/contacts`
- `GET /api/career/progress`

### ✅ AI Assistant
- `POST /api/assistant/chat`
- `POST /api/assistant/resume-feedback`
- `GET /api/assistant/job-search`
- `GET /api/assistant/career-tips`
- `GET /api/assistant/alerts`

### ✅ Test Module
- `GET /api/test/fields`
- `POST /api/test/create`
- `GET /api/test/list`
- `GET /api/test/:id`
- `POST /api/test/:id/attempt`
- `POST /api/test/attempt/:attemptId/submit`
- `GET /api/test/result/:attemptId`
- `GET /api/test/student/attempts`
- `GET /api/test/analytics/:testId`

### ✅ All Other Modules
See `BACKEND_SETUP_COMPLETE.md` for full list of 134+ endpoints

---

## 🎯 Next Steps

1. ✅ Backend is running
2. ✅ Health check passes
3. ⏭️ Start frontend: `cd frontend/frontend && npm start`
4. ⏭️ Test integration
5. ⏭️ Verify no 404 errors

---

## 📝 Quick Reference

**Start Backend:**
```bash
cd backend
node server.js
```

**Test Backend:**
```bash
cd backend
node test-backend.js
```

**Health Check:**
```
http://localhost:5000/api/health
```

**Stop Backend:**
Press `Ctrl+C` in terminal

---

**Backend is ready! 🚀**
