##  Demo Video  ##
[![Watch the video](https://img.shields.io/badge/Watch-Demo%20Video-red?style=for-the-badge)](https://vimeo.com/1144152879?fl=tl&fe=ec)

Alternative 
##  Demo Video  ##
[Watch on google drive](https://drive.google.com/drive/folders/1-44KAhqAiNjQ8tLfLBQYP7VhL-zE0-Ly?usp=drive_link)

#  Smart Task Planner

##  Overview
Smart Task Planner is a full-stack application that uses AI (OpenAI or Google Gemini) to intelligently break down user goals into structured, actionable tasks. It provides:

 **Intelligent Task Generation** - AI creates realistic, time-bound tasks  
 **Task Dependencies** - Understand which tasks must be completed first  
 **Timeline Estimation** - Get accurate deadline projections  
 **Priority Management** - Know which tasks to focus on first  
 **Beautiful UI** - Modern, responsive React frontend  
 **RESTful API** - Clean backend for easy integration  

---

##  Project Structure

```
smart-task-planner/
│
├── backend/                          # Node.js + Express API
│   ├── src/
│   │   ├── index.js                 # Main server entry
│   │   ├── routes/
│   │   │   └── planRoutes.js        # API routes
│   │   ├── controllers/
│   │   │   └── planController.js    # Request handlers
│   │   ├── services/
│   │   │   ├── planService.js       # Business logic
│   │   │   └── llmService.js        # LLM integration
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Error handling
│   │   │   └── validation.js        # Input validation
│   │   ├── utils/
│   │   │   └── taskParser.js        # Response parsing
│   │   └── models/                  # Database models
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── App.js                   # Main component
│   │   ├── components/
│   │   │   ├── GoalInput.js         # Goal input form
│   │   │   ├── GoalInput.css
│   │   │   ├── TaskPlan.js          # Task display
│   │   │   └── TaskPlan.css
│   │   ├── services/
│   │   │   └── apiService.js        # API calls
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md                         # This file
```

---

##  Quick Start

### Prerequisites
- **Node.js** v14+ and npm
- **API Key**: OpenAI or Google Gemini API key
- **Port Access**: 5000 (backend), 3000 (frontend)

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your API key to .env
# Edit .env and add:
# OPENAI_API_KEY=your_key_here
# OR
# GEMINI_API_KEY=your_key_here
```

**Start Backend:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

 Backend running at: `http://localhost:5000`

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env if needed (default already points to localhost:5000)
```

**Start Frontend:**
```bash
npm start
```

 Frontend running at: `http://localhost:3000`

##  API Endpoints

### Generate Task Plan

POST /api/generate-plan

### Health Check

GET /api/health


##  Configuration

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# LLM Provider
LLM_PROVIDER=openai              # 'openai' or 'gemini'
OPENAI_API_KEY=your_api_key
GEMINI_API_KEY=your_api_key

# Frontend CORS
CORS_ORIGIN=http://localhost:3000

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/smart-task-planner


### Frontend (.env)
env
REACT_APP_API_URL=http://localhost:5000/api

##  Testing

### Using cURL
```bash
curl -X POST http://localhost:5000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{"goal": "Build a mobile app in one month"}'

### Using Thunder Client / Postman
1. Create POST request to `http://localhost:5000/api/generate-plan`
2. Set Header: `Content-Type: application/json`
3. Body:
   ```json
   {
     "goal": "Learn React in 30 days"
   }
   ```
4. Send

### Via Browser
1. Open `http://localhost:3000`
2. Enter your goal in the text area
3. Click "Generate Task Plan"
4. View the generated tasks


## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Axios** - HTTP client
- **dotenv** - Environment variables
- **CORS** - Cross-origin support
- **Mongoose** - MongoDB ODM (optional)

### Frontend
- **React** - UI library
- **Axios** - API calls
- **CSS3** - Styling with gradients and animations

### LLM Integration
- **OpenAI API** - GPT-3.5-turbo
- **Google Gemini API** - Gemini Pro


##  Project Features
##  Smart Task Generation
- AI-powered breakdown of complex goals
- Realistic timeline estimation
- Dependency detection
- Priority assignment
- Deadline calculation

##  Modern UI

##  Robust Backend

## RESTful API

## How It Works

## Flow Diagram

User Goal
    ↓
Frontend (React)
    ↓
Submit to Backend API
    ↓
Validate Input
    ↓
Call LLM (OpenAI/Gemini)
    ↓
Parse Response
    ↓
Generate Task Plan
    ↓
Return to Frontend
    ↓
Display Task Cards

### Step-by-Step Process
1. **Input Validation** - Goal must be 10-1000 characters
2. **LLM Call** - Send structured prompt with goal
3. **Response Parsing** - Extract and validate JSON
4. **Task Normalization** - Ensure all fields are present
5. **Timeline Calculation** - Generate realistic deadlines
6. **Response Formatting** - Return structured data
7. **Frontend Display** - Show cards with animations

## 📝 Environment Setup

### Get API Keys

#### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account or login
3. Navigate to API Keys
4. Create new secret key
5. Copy and paste into `.env` as `OPENAI_API_KEY`

#### Google Gemini
1. Go to [ai.google.dev](https://ai.google.dev)
2. Create API key
3. Copy and paste into `.env` as `GEMINI_API_KEY`

##  Troubleshooting

### Backend won't start
```
Error: Cannot find module 'express'
Solution: Run 'npm install' in backend directory
```

### Frontend can't reach API
```
Error: Failed to generate plan
Solution: 
1. Ensure backend is running on port 5000
2. Check .env REACT_APP_API_URL
3. Verify CORS_ORIGIN in backend .env

### LLM API Error

Error: Invalid API key
Solution:
1. Get fresh API key from OpenAI/Gemini
2. Update .env file
3. Restart backend server

### Port already in use

Error: listen EADDRINUSE: address already in use :::5000
Solution: Change PORT in .env or kill process using port
```

---
#  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

##  Future Enhancements

- [ ] Database integration for plan history
- [ ] User authentication & profiles
- [ ] Plan export (PDF, CSV)
- [ ] Collaboration features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Recurring tasks
- [ ] Email reminders

---

Developer,
kunal Chavhan
