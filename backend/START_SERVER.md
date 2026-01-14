# 🚀 Quick Start - Backend Server

## Start the Backend Server

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Start the Server
```bash
node server.js
```

### Expected Output:
```
MongoDB Connected
✅ Server running on port 5000
📊 Health check: http://localhost:5000/api/health
💬 Assistant chat: POST http://localhost:5000/api/assistant/chat
```

### Step 3: Verify Server is Running

Open a new terminal and test:
```bash
curl http://localhost:5000/api/health
```

Or open in browser:
```
http://localhost:5000/api/health
```

Should return:
```json
{"status":"ok","message":"Backend server is running","timestamp":"..."}
```

---

## ⚠️ Troubleshooting

### Issue: MongoDB Connection Error

**Solution 1: Start Local MongoDB**
```bash
# Windows (if installed as service, it auto-starts)
# Or start manually:
mongod --dbpath "C:\data\db"
```

**Solution 2: Use MongoDB Atlas (Cloud)**
1. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-career-navigator
   ```

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

### Issue: .env File Missing

**Solution:**
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ai-career-navigator
JWT_SECRET=career-x-fyp-super-secret-jwt-key-2024-production-ready
PORT=5000
```

---

## ✅ Keep Server Running

**Important:** Keep the terminal window open where the server is running. Closing it will stop the server.

To run in background (Windows PowerShell):
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node server.js"
```

---

## 🧪 Test After Starting

1. **Health Check:**
   ```
   http://localhost:5000/api/health
   ```

2. **Test with Frontend:**
   - Start frontend: `cd frontend/frontend && npm start`
   - Frontend should now connect to backend

---

**Server must be running for frontend to work!**
