# Start Project Script for Windows PowerShell
Write-Host "🚀 Starting AI Career Navigator..." -ForegroundColor Green

# Check if MongoDB is running
Write-Host "`n📊 Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB may not be running. Starting backend anyway..." -ForegroundColor Yellow
        Write-Host "   (If using MongoDB Atlas, this is normal)" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  MongoDB check failed. Ensure MongoDB is running or using Atlas." -ForegroundColor Yellow
}

# Check if .env exists
Write-Host "`n⚙️  Checking backend configuration..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "✅ Backend .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend .env file not found!" -ForegroundColor Red
    Write-Host "   Creating default .env file..." -ForegroundColor Yellow
    @"
MONGODB_URI=mongodb://localhost:27017/ai-career-navigator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
"@ | Out-File -FilePath "backend\.env" -Encoding utf8
    Write-Host "✅ Created default .env file. Please update MONGODB_URI if using Atlas." -ForegroundColor Green
}

# Start Backend
Write-Host "`n🖥️  Starting Backend Server..." -ForegroundColor Yellow
$backendPath = (Resolve-Path "backend").Path
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '=== BACKEND SERVER ===' -ForegroundColor Cyan; Write-Host 'Running on: http://localhost:5000' -ForegroundColor Green; Write-Host ''; node server.js"

# Wait a bit for backend to start
Write-Host "   Waiting for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 4

# Test backend health
Write-Host "`n🔍 Testing backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running and healthy!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend may still be starting. Check the backend window for errors." -ForegroundColor Yellow
}

# Start Frontend
Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor Yellow
$frontendPath = (Resolve-Path "frontend\frontend").Path
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '=== FRONTEND SERVER ===' -ForegroundColor Cyan; Write-Host 'Running on: http://localhost:3000' -ForegroundColor Green; Write-Host ''; npm start"

Write-Host "`n✅ Both servers starting in separate windows!" -ForegroundColor Green
Write-Host "`n📊 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`n💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Keep both terminal windows open" -ForegroundColor Gray
Write-Host "   - Backend must be running for frontend to work" -ForegroundColor Gray
Write-Host "   - Check backend window for MongoDB connection status" -ForegroundColor Gray
Write-Host "   - Frontend will auto-open in browser" -ForegroundColor Gray
Write-Host "`nPress any key to exit this window (servers will keep running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
