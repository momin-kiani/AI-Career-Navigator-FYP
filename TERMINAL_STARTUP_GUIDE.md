# 🚀 Complete Terminal Startup Guide

## Step-by-Step: Run the Entire Project

### Prerequisites Check

First, verify you have the required software installed:

```bash
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# Check if MongoDB is installed (optional - can use cloud)
mongod --version
```

---

## 📦 Step 1: Install Dependencies

### 1.1 Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all backend packages
npm install

# Verify installation
npm list --depth=0
```

### 1.2 Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../frontend/frontend

# Install all frontend packages
npm install

# Verify installation
npm list --depth=0
```

**Expected packages:**
- Backend: express, mongoose, bcryptjs, jsonwebtoken, multer, pdf-parse, mammoth, cors, dotenv
- Frontend: react, react-dom, axios, framer-motion, @react-three/fiber, @react-three/drei, three, recharts

---

## ⚙️ Step 2: Environment Setup

### 2.1 Create Backend .env File

```bash
# Navigate to backend
cd backend

# Create .env file (Windows PowerShell)
New-Item -Path .env -ItemType File -Force

# Or use your text editor to create .env with:
```

**Backend `.env` file content:**
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai-career-navigator

# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000

# Email Configuration (Optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@careernavigator.com
EMAIL_SECURE=false
```

**Quick setup (Windows PowerShell):**
```powershell
cd backend
@"
MONGODB_URI=mongodb://localhost:27017/ai-career-navigator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8
```

---

## 🗄️ Step 3: Start MongoDB

### Option A: Local MongoDB

```bash
# Windows (if MongoDB is installed as service, it auto-starts)
# Or start manually:
mongod --dbpath "C:\data\db"

# Linux/Mac
sudo systemctl start mongod
# OR
mongod --dbpath /data/db
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file

**Example Atlas connection string:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-career-navigator?retryWrites=true&w=majority
```

### Verify MongoDB Connection

```bash
# Test MongoDB connection (if local)
mongosh

# Or test connection string
mongosh "mongodb://localhost:27017/ai-career-navigator"
```

---

## 🖥️ Step 4: Start Backend Server

### Open Terminal 1 (Backend)

```bash
# Navigate to backend
cd backend

# Start backend server
node server.js
```

**Expected output:**
```
MongoDB Connected
✅ Server running on port 5000
📊 Health check: http://localhost:5000/api/health
💬 Assistant chat: POST http://localhost:5000/api/assistant/chat
```

**Keep this terminal open!** The backend must stay running.

### Verify Backend is Running

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Or in browser, visit:
# http://localhost:5000/api/health
```

**Expected response:**
```json
{"status":"ok","message":"Backend server is running","timestamp":"..."}
```

---

## 🎨 Step 5: Start Frontend Server

### Open Terminal 2 (Frontend)

```bash
# Navigate to frontend
cd frontend/frontend

# Start React development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
```

**Keep this terminal open too!** The frontend must stay running.

The browser should automatically open to `http://localhost:3000`

---

## ✅ Step 6: Verify Everything Works

### 6.1 Check Backend Health

```bash
# In a new terminal
curl http://localhost:5000/api/health
```

### 6.2 Test Frontend Connection

1. Open browser: `http://localhost:3000`
2. You should see the login page
3. Check browser console (F12) for any errors

### 6.3 Test Authentication

**Sign Up:**
1. Click "Sign Up"
2. Fill in the form
3. Submit
4. Should redirect to dashboard

**Or Sign In (if account exists):**
1. Enter email and password
2. Click "Sign In"
3. Should redirect to dashboard

### 6.4 Test AI Assistant

1. After login, navigate to "AI Assistant" in sidebar
2. Type "hi" and send
3. Should receive AI response (not 404 error)

---

## 🔧 Complete Startup Script (Windows PowerShell)

Create a file `start-project.ps1`:

```powershell
# Start Project Script
Write-Host "🚀 Starting AI Career Navigator..." -ForegroundColor Green

# Check if MongoDB is running
Write-Host "`n📊 Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB may not be running. Starting backend anyway..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  MongoDB check failed. Ensure MongoDB is running." -ForegroundColor Yellow
}

# Start Backend
Write-Host "`n🖥️  Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host 'Backend Server' -ForegroundColor Cyan; node server.js"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/frontend; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm start"

Write-Host "`n✅ Both servers starting in separate windows!" -ForegroundColor Green
Write-Host "📊 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress any key to exit this window (servers will keep running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
```

**Run it:**
```powershell
.\start-project.ps1
```

---

## 🔧 Complete Startup Script (Linux/Mac)

Create a file `start-project.sh`:

```bash
#!/bin/bash

echo "🚀 Starting AI Career Navigator..."

# Check MongoDB
echo ""
echo "📊 Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB may not be running. Ensure it's started."
fi

# Start Backend
echo ""
echo "🖥️  Starting Backend Server..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd frontend/frontend
npm start &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ Both servers starting!"
echo "📊 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

**Make it executable and run:**
```bash
chmod +x start-project.sh
./start-project.sh
```

---

## 🛑 Stopping the Servers

### Manual Stop

**Backend Terminal:**
- Press `Ctrl+C` to stop backend

**Frontend Terminal:**
- Press `Ctrl+C` to stop frontend

### Kill All Node Processes (Emergency)

```bash
# Windows PowerShell
Get-Process node | Stop-Process -Force

# Linux/Mac
pkill -f node
```

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Check:**
```bash
# 1. MongoDB connection
mongosh "mongodb://localhost:27017/ai-career-navigator"

# 2. Port 5000 already in use?
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac

# 3. Check .env file exists
cd backend
cat .env  # or type .env on Windows

# 4. Check for syntax errors
node server.js
```

### Issue: Frontend won't start

**Check:**
```bash
# 1. Port 3000 already in use?
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# 2. Dependencies installed?
cd frontend/frontend
npm list --depth=0

# 3. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: 404 Errors in Frontend

**Check:**
1. Backend is running: `curl http://localhost:5000/api/health`
2. Frontend API URL is correct: Check `frontend/frontend/src/services/api.js`
3. CORS enabled: Backend should have `app.use(cors())`
4. Authentication token: Check browser localStorage for token

### Issue: MongoDB Connection Error

**Solutions:**
```bash
# 1. Start MongoDB service
# Windows: Check Services app
# Linux: sudo systemctl start mongod

# 2. Use MongoDB Atlas (cloud) instead
# Update MONGODB_URI in .env

# 3. Check connection string format
# Should be: mongodb://localhost:27017/ai-career-navigator
```

---

## 📋 Quick Reference Commands

### Start Everything (3 Terminals)

**Terminal 1 - MongoDB (if local):**
```bash
mongod --dbpath "C:\data\db"
```

**Terminal 2 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 3 - Frontend:**
```bash
cd frontend/frontend
npm start
```

### Verify Services

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend (open browser)
http://localhost:3000

# MongoDB (if local)
mongosh "mongodb://localhost:27017/ai-career-navigator"
```

---

## ✅ Success Checklist

- [ ] MongoDB running (local or Atlas)
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/frontend/)
- [ ] Backend .env file created with MONGODB_URI and JWT_SECRET
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Health check returns OK: `http://localhost:5000/api/health`
- [ ] Frontend loads: `http://localhost:3000`
- [ ] Can sign up/login
- [ ] Dashboard loads after login
- [ ] AI Assistant works (no 404 errors)

---

## 🎯 Next Steps After Startup

1. **Create Account**: Sign up with email/password
2. **Test Dashboard**: View overview stats
3. **Upload Resume**: Test resume optimization
4. **Take Assessment**: Complete career fit assessment
5. **Test AI Assistant**: Chat with AI career assistant
6. **Explore Modules**: Navigate through all features

---

## 📞 Need Help?

If something doesn't work:
1. Check backend console for errors
2. Check frontend console (F12 in browser)
3. Verify all services are running
4. Check network tab in browser DevTools
5. Review error messages carefully

**Common fixes:**
- Restart all services
- Clear browser cache
- Reinstall dependencies
- Check .env file configuration
- Verify MongoDB connection

---

**Happy Coding! 🚀**
