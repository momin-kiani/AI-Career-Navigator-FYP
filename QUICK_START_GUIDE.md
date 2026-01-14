# Career X - Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend/frontend
npm install
```

### Install Additional Dependencies (3D & Animations)
```bash
cd frontend/frontend
npm install @react-three/fiber @react-three/drei three framer-motion recharts
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ai-career-navigator
JWT_SECRET=your-secret-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@careernavigator.com
```

## Running the Application

### Start Backend
```bash
cd backend
node server.js
```
Backend runs on: `http://localhost:5000`

### Start Frontend
```bash
cd frontend/frontend
npm start
```
Frontend runs on: `http://localhost:3000`

## Default Test Accounts

### Admin/Teacher Account
- Email: `admin@test.com`
- Password: `admin123`
- Role: `admin` or `teacher`

### Student Account
- Email: `student@test.com`
- Password: `student123`
- Role: `student`

### Regular User
- Email: `user@test.com`
- Password: `user123`
- Role: `user`

## API Testing

### Using Postman/Insomnia
1. Base URL: `http://localhost:5000/api`
2. For protected routes, add header:
   ```
   Authorization: Bearer <token>
   ```
3. Get token by logging in via `/api/auth/signin`

## Module Access

### All Users
- Dashboard
- Resume Optimization
- Job Applications
- Network & Communication
- Profile Optimization
- Career Resources
- AI Assistant
- Career Assessment
- Market Insights
- Industry Insights
- Regional Insights

### Students Only
- Student Test Module (take tests)

### Admin/Teacher Only
- Student Test Module (create tests, view analytics)

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`

### CORS Errors
- Backend CORS is configured for `http://localhost:3000`
- Update if using different port

### Token Expired
- Token expires after 7 days
- Re-login to get new token

### 3D Components Not Rendering
- Ensure all dependencies installed:
  ```bash
  npm install @react-three/fiber @react-three/drei three
  ```

### Charts Not Displaying
- Ensure Recharts installed:
  ```bash
  npm install recharts
  ```

## Demo Flow

1. **Login** → Use test account
2. **Dashboard** → View overview
3. **Career Assessment** → Take assessment
4. **Resume** → Upload and optimize
5. **Jobs** → Track applications
6. **Tests** → Take/create tests (role-based)
7. **Analytics** → View market insights

## Academic Presentation Tips

1. **Start with Authentication** → Show secure login
2. **Career Assessment** → Demonstrate AI matching
3. **Resume Optimization** → Show ATS scoring
4. **3D Test Environment** → Highlight immersive UI
5. **Analytics Dashboards** → Show data visualization
6. **AI Features** → Explain algorithms

## Support

For issues or questions:
- Check `COMPLETE_INTEGRATION_DOCUMENTATION.md`
- Review backend logs
- Check browser console for frontend errors
