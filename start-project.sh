#!/bin/bash

echo "🚀 Starting AI Career Navigator..."

# Check MongoDB
echo ""
echo "📊 Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB may not be running. Ensure it's started or using Atlas."
fi

# Check if .env exists
echo ""
echo "⚙️  Checking backend configuration..."
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file found"
else
    echo "⚠️  Backend .env file not found!"
    echo "   Creating default .env file..."
    cat > backend/.env << EOF
MONGODB_URI=mongodb://localhost:27017/ai-career-navigator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
EOF
    echo "✅ Created default .env file. Please update MONGODB_URI if using Atlas."
fi

# Start Backend
echo ""
echo "🖥️  Starting Backend Server..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "   Waiting for backend to initialize..."
sleep 4

# Test backend health
echo ""
echo "🔍 Testing backend connection..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running and healthy!"
else
    echo "⚠️  Backend may still be starting. Check for errors above."
fi

# Start Frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd frontend/frontend
npm start &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ Both servers starting!"
echo ""
echo "📊 Backend:  http://localhost:5000"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "💡 Tips:"
echo "   - Keep this terminal open"
echo "   - Backend must be running for frontend to work"
echo "   - Frontend will auto-open in browser"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
