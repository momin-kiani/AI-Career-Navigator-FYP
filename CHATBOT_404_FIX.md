# Chatbot 404 Error - Fix Guide

## Issue
The chatbot is returning a 404 error when trying to send messages.

## Root Cause Analysis

The endpoint `/api/assistant/chat` exists in the backend (line 4002), but a 404 suggests:
1. Backend server may not be running
2. Route not being registered properly
3. Authentication token issue

## Fixes Applied

### 1. Enhanced Error Logging ✅
- Added detailed console logging in frontend
- Shows exact URL being called
- Better error messages with troubleshooting steps

### 2. Backend Logging ✅
- Added console.log to chat endpoint to verify it's being hit
- Added validation for missing message

### 3. Health Check Endpoints ✅
- Added `/api/health` - Test if backend is running
- Added `/api/assistant/test` - Test if assistant endpoint is accessible

## Testing Steps

### Step 1: Verify Backend is Running
1. Open browser and go to: `http://localhost:5000/api/health`
2. Should return: `{"status":"ok","message":"Backend server is running"}`
3. If this fails, backend is not running

### Step 2: Start Backend Server
```bash
cd backend
node server.js
```

You should see:
```
MongoDB Connected
Server running on port 5000
Health check: http://localhost:5000/api/health
Assistant chat endpoint: POST http://localhost:5000/api/assistant/chat
```

### Step 3: Test Authentication
1. Make sure you're logged in
2. Check browser console for token in localStorage
3. Token should be present: `localStorage.getItem('token')`

### Step 4: Test Chat Endpoint
1. Open browser console (F12)
2. Try sending a message in chatbot
3. Check console for:
   - "Sending chat message to: /assistant/chat"
   - "Full URL will be: http://localhost:5000/api/assistant/chat"
   - Any error details

### Step 5: Check Backend Console
When you send a message, you should see in backend console:
```
Chat endpoint hit - User ID: [userId]
Processing chat message: [message]
```

If you don't see this, the request isn't reaching the backend.

## Common Issues & Solutions

### Issue 1: Backend Not Running
**Solution:** Start backend server
```bash
cd backend
node server.js
```

### Issue 2: CORS Error
**Solution:** Backend already has CORS enabled, but verify:
```javascript
app.use(cors());
```

### Issue 3: Token Missing/Invalid
**Solution:** 
- Log out and log back in
- Check browser console for 401 errors
- Verify token in localStorage

### Issue 4: Port Mismatch
**Solution:** Verify frontend API_URL matches backend port
- Frontend: `http://localhost:5000/api`
- Backend: Port 5000

### Issue 5: Route Not Registered
**Solution:** Check backend console for errors on startup
- Syntax errors prevent routes from registering
- Check for any red errors in backend console

## Debugging Commands

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### Test Chat Endpoint (with token)
```bash
curl -X POST http://localhost:5000/api/assistant/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"test","category":"career-guidance"}'
```

## Expected Behavior

### When Working Correctly:
1. User types message and clicks Send
2. Frontend console shows: "Sending chat message to: /assistant/chat"
3. Backend console shows: "Chat endpoint hit - User ID: [id]"
4. Response received with AI-generated message
5. Message appears in chat interface

### Current Status:
- ✅ Endpoint exists in backend
- ✅ Frontend calling correct URL
- ✅ Error handling improved
- ⚠️ Need to verify backend is running

## Next Steps

1. **Start backend server** if not running
2. **Test health endpoint** to verify server is up
3. **Check browser console** for detailed error messages
4. **Check backend console** for request logs
5. **Verify authentication token** is valid

If 404 persists after backend is running, check:
- Backend console for route registration errors
- Network tab in browser DevTools for actual request URL
- Backend logs for any middleware blocking the request
