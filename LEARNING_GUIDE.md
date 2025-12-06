# Smart Task Planner - Learning Guide for Beginners

## Overview
This guide walks you through understanding the Smart Task Planner project step-by-step. It's designed for someone with **Mongoose, HTML/CSS knowledge** but new to **LLMs, APIs, and full-stack web development**.

---

## Table of Contents
1. [Core Concepts](#core-concepts)
2. [Architecture Overview](#architecture-overview)
3. [Component Breakdown](#component-breakdown)
4. [Code Walkthrough](#code-walkthrough)
5. [Interview Preparation](#interview-preparation)
6. [Quick Exercises](#quick-exercises)

---

## Core Concepts

### What is an LLM (Large Language Model)?
An LLM is an AI trained on massive amounts of text data to understand and generate human-like text.

**Key LLMs in this project:**
- **OpenAI GPT-3.5-turbo:** Fast, reliable, costs money per API call
- **Google Gemini:** Free tier available, similar capabilities

**How they work in your project:**
1. User enters a goal (e.g., "Launch a product in 2 weeks")
2. Your backend sends this to the LLM API
3. LLM generates a structured plan with tasks
4. Your code parses this response and saves it to MongoDB

### API Calls & Authentication
APIs are like restaurants—you send a request, they send back a response.

```
Your App → API Endpoint (with your API Key) → LLM → Response
```

**Example:**
```javascript
// You send this to OpenAI:
{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Break down launching a product into tasks"}],
  "api_key": "sk-xxxxx"
}

// LLM sends back:
{
  "choices": [{
    "message": {
      "content": "[{\"id\": 1, \"taskName\": \"Market Research\", ...}]"
    }
  }]
}
```

### Async/Await (Critical for API calls)
When your app calls an API, it doesn't wait. It says "call this API, tell me when done."

```javascript
// BAD - blocks everything
const response = fetch(url); // Waits forever
console.log(response);

// GOOD - non-blocking
const response = await fetch(url); // Waits, but app keeps running
console.log(response);
```

---

## Architecture Overview

### How Data Flows Through Your App

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER ENTERS GOAL                            │
│                  (React Frontend - GoalInput.js)                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│            SEND TO BACKEND API (/api/generate-plan)              │
│                    (HTTP POST Request)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│               BACKEND VALIDATES INPUT                             │
│                (validation.js middleware)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│          CALL LLM API (OpenAI or Gemini)                         │
│              (llmService.js → API call)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         PARSE LLM RESPONSE INTO TASKS                            │
│              (taskParser.js - convert to structure)              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│           SAVE PLAN TO MONGODB                                   │
│         (planController.js + GoalPlan.js model)                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│          SEND RESPONSE TO FRONTEND                               │
│              (JSON with all tasks)                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│       DISPLAY TASKS IN UI (TaskPlan.js)                          │
│          + Show stats (days, task count, etc)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Folder Structure & Responsibilities

```
backend/
├── src/
│   ├── index.js                 ← Starts Express server, connects to MongoDB
│   ├── controllers/
│   │   └── planController.js     ← Handles API requests/responses
│   ├── services/
│   │   ├── llmService.js         ← Calls OpenAI/Gemini APIs ⭐
│   │   └── planService.js        ← Business logic for plans
│   ├── models/
│   │   └── GoalPlan.js           ← MongoDB schema (like Mongoose)
│   ├── routes/
│   │   └── planRoutes.js         ← Maps URLs to controllers
│   ├── middleware/
│   │   ├── validation.js         ← Checks input is valid
│   │   └── errorHandler.js       ← Handles errors gracefully
│   └── utils/
│       └── taskParser.js         ← Converts LLM text to structured data ⭐
│
frontend/
├── src/
│   ├── components/
│   │   ├── GoalInput.js          ← User enters goal here
│   │   ├── TaskPlan.js           ← Shows generated plan
│   │   ├── GoalInput.css         ← Styling
│   │   └── TaskPlan.css          ← Styling
│   ├── services/
│   │   └── apiService.js         ← Calls backend APIs
│   ├── App.js                    ← Main component, routes between views
│   └── index.js                  ← React entry point
```

---

## Component Breakdown

### 1. Frontend: `GoalInput.js` (React Component)

**What it does:** Displays input form where user enters their goal.

```javascript
const GoalInput = ({ onSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');      // State: stores user input
  const [error, setError] = useState('');    // State: stores error message

  const handleSubmit = (e) => {
    e.preventDefault();                      // Prevent page reload
    
    // Validation
    if (!goal.trim()) {
      setError('Please enter a goal');
      return;
    }
    
    // Send goal to parent component (App.js)
    onSubmit(goal.trim());
  };

  return (
    <div>
      <textarea value={goal} onChange={...} />
      <button onClick={handleSubmit}>Generate Plan</button>
    </div>
  );
};
```

**Key Concepts:**
- `useState` = React hook to store data (like variables, but React re-renders when changed)
- `onSubmit` = callback function passed from parent (App.js) to send data up

### 2. Backend: `apiService.js` (Frontend Service)

**What it does:** Calls your backend API from React.

```javascript
const generatePlan = async (goal) => {
  try {
    const response = await fetch('http://localhost:5000/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

**Key Concepts:**
- `fetch()` = makes HTTP request (like calling a URL from code)
- `await` = waits for response before continuing
- `response.json()` = converts response to JavaScript object

### 3. Backend: `planRoutes.js` (Express Routes)

**What it does:** Maps URLs to controller functions.

```javascript
router.post('/generate-plan', planController.generatePlan);
router.get('/plans', planController.getAllPlans);
```

**What happens:**
- POST `/api/generate-plan` → Calls `planController.generatePlan()`
- GET `/api/plans` → Returns all saved plans from MongoDB

### 4. Backend: `planController.js` (Express Controller)

**What it does:** Handles the actual request/response logic.

```javascript
const generatePlan = async (req, res) => {
  try {
    const { goal } = req.body;                           // Get goal from request
    
    const plan = await planService.generatePlan(goal);   // Call service to generate
    
    const savedPlan = new GoalPlan(plan);                // Create MongoDB document
    await savedPlan.save();                              // Save to database
    
    res.json(savedPlan);                                 // Send back to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Flow:**
1. Frontend sends goal
2. Controller validates & calls service
3. Service calls LLM API
4. Controller saves to MongoDB
5. Controller sends response back

### 5. Backend: `llmService.js` (LLM Integration) ⭐ KEY FILE

**What it does:** Calls OpenAI or Gemini APIs.

```javascript
const generatePlanWithLLM = async (goal) => {
  const provider = process.env.LLM_PROVIDER; // 'openai' or 'gemini'
  
  const prompt = `Break down this goal into tasks: ${goal}
  Return JSON format: [{"id": 1, "taskName": "...", "description": "...", 
  "estimatedDays": 3, "priority": "high", "dependsOn": []}]`;
  
  if (provider === 'openai') {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      api_key: process.env.OPENAI_API_KEY
    });
    return response.data.choices[0].message.content;
  }
  
  if (provider === 'gemini') {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return response.data.candidates[0].content.parts[0].text;
  }
};
```

**Key Points:**
- Makes HTTP request to LLM API with your API key
- Sends prompt with specific instructions
- Receives generated text back
- Error handling for API failures

### 6. Backend: `taskParser.js` (Parse Response) ⭐ KEY FILE

**What it does:** Converts LLM's text response into structured data.

```javascript
const parseTaskPlan = (rawText) => {
  try {
    // LLM returns text like: "[{\"id\": 1, \"taskName\": \"...\"}, ...]"
    const jsonStr = rawText.substring(
      rawText.indexOf('['),
      rawText.lastIndexOf(']') + 1
    );
    
    const tasks = JSON.parse(jsonStr);
    
    // Convert string dependencies to numbers
    const processedTasks = tasks.map(task => ({
      ...task,
      dependsOn: (task.dependsOn || []).map(dep => {
        return typeof dep === 'string' ? parseInt(dep) : dep;
      })
    }));
    
    return processedTasks;
  } catch (error) {
    throw new Error('Failed to parse LLM response: ' + error.message);
  }
};
```

**Why this matters:**
- LLM returns messy text: `"[{\"id\": 1, ...}]"`
- We need clean objects: `[{id: 1, ...}]`
- Parser handles malformed responses gracefully

### 7. Backend: `GoalPlan.js` (MongoDB Model)

**What it does:** Defines how data is stored in MongoDB (like your Mongoose experience).

```javascript
const goalPlanSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  taskCount: Number,
  totalEstimatedDays: Number,
  taskPlan: [{
    id: Number,
    taskName: String,
    description: String,
    estimatedDays: Number,
    priority: String,
    dependsOn: [Number]
  }],
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoalPlan', goalPlanSchema);
```

**This is familiar to you** since you know Mongoose! It's just defining the data structure.

### 8. Backend: `index.js` (Entry Point)

**What it does:** Starts the Express server and connects to MongoDB.

```javascript
require('dotenv').config();                          // Load .env file
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

// Routes
app.use('/api', planRoutes);

// Start server
app.listen(5000, () => console.log('Server running on :5000'));
```

---

## Code Walkthrough: Complete Flow

### Step 1: User Enters Goal
```
User types: "Build a React app in 3 weeks"
Clicks: "Generate Plan"
```

### Step 2: Frontend Sends to Backend
```javascript
// apiService.js
const data = await fetch('http://localhost:5000/api/generate-plan', {
  method: 'POST',
  body: JSON.stringify({ goal: "Build a React app in 3 weeks" })
});
```

### Step 3: Backend Receives & Validates
```javascript
// planController.js
const { goal } = req.body;  // "Build a React app in 3 weeks"

// Validation middleware checks:
// - goal is not empty ✓
// - goal is at least 10 characters ✓
```

### Step 4: Backend Calls LLM
```javascript
// llmService.js
const llmResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
  model: 'gpt-3.5-turbo',
  messages: [{
    role: 'user',
    content: 'Break down "Build a React app in 3 weeks" into tasks...'
  }],
  api_key: 'sk-xxxxx'
});

// Returns text like:
// "[{\"id\": 1, \"taskName\": \"Setup Project\", ...}, ...]"
```

### Step 5: Backend Parses Response
```javascript
// taskParser.js
const tasks = parseTaskPlan(llmResponse);

// Output:
// [{
//   id: 1,
//   taskName: "Setup Project",
//   description: "Initialize React with Create React App",
//   estimatedDays: 1,
//   priority: "high",
//   dependsOn: []
// }, ...]
```

### Step 6: Backend Saves to MongoDB
```javascript
// planController.js
const plan = {
  goal: "Build a React app in 3 weeks",
  taskCount: 8,
  totalEstimatedDays: 18,
  taskPlan: [...], // from parser
  generatedAt: new Date()
};

const savedPlan = new GoalPlan(plan);
await savedPlan.save();  // Saves to MongoDB
```

### Step 7: Backend Sends to Frontend
```javascript
res.json(savedPlan);  // Sends JSON response
```

### Step 8: Frontend Displays Tasks
```javascript
// TaskPlan.js (React Component)
plan.taskPlan.map((task, index) => (
  <div key={task.id} className="task-card">
    <h3>{task.taskName}</h3>
    <p>{task.description}</p>
    <span className="priority">{task.priority}</span>
    <p>Days: {task.estimatedDays}</p>
  </div>
))
```

---

## Interview Preparation

### Common Interview Questions & Answers

**Q1: Explain your project architecture**

*Answer Structure:*
- Frontend (React) → User enters goal
- API call to backend
- Backend validates, calls LLM API
- Parses response, saves to MongoDB
- Returns data to frontend for display

**Q2: How do you handle LLM API errors?**

```javascript
try {
  const response = await axios.post(llmURL, data);
  return response.data;
} catch (error) {
  if (error.response?.status === 401) {
    throw new Error('Invalid API key');
  }
  if (error.code === 'ENOTFOUND') {
    throw new Error('Network error - API unreachable');
  }
  throw new Error('LLM API failed: ' + error.message);
}
```

*Say:* "I use try-catch blocks. Different error types (auth, network, rate limit) need different handling."

**Q3: Why use async/await?**

*Answer:* "API calls are slow. With async/await, the server doesn't block—it can handle other requests while waiting for the LLM response. Without it, a slow API would freeze the entire server."

**Q4: How do you validate user input?**

```javascript
if (!goal || goal.trim().length < 10) {
  throw new Error('Goal must be at least 10 characters');
}
```

*Say:* "Validation prevents bad data from reaching the LLM. Frontend validates UX, backend validates security."

**Q5: How would you scale this?**

*Answers to mention:*
- Add caching (save popular goals so we don't call LLM every time)
- Queue system for heavy load (Redis)
- Rate limiting per user
- Batch API calls to reduce cost
- Add request logging for debugging

**Q6: What if the LLM returns malformed JSON?**

*Answer:* "That's why we have `taskParser.js`. It uses regex/substring to find valid JSON, validates structure, and throws clear errors if parsing fails."

---

## Quick Exercises

### Exercise 1: Add a new API endpoint
**Task:** Add `GET /api/plans/count` to return total number of saved plans.

**Steps:**
1. Open `backend/src/routes/planRoutes.js`
2. Add: `router.get('/plans/count', planController.getPlanCount);`
3. Open `backend/src/controllers/planController.js`
4. Add:
```javascript
const getPlanCount = async (req, res) => {
  try {
    const count = await GoalPlan.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
5. Export the function: `module.exports = { generatePlan, getAllPlans, getPlanCount };`

### Exercise 2: Modify the prompt to generate different tasks
**Task:** Change LLM prompt to include "estimated budget" for each task.

**Steps:**
1. Open `backend/src/services/llmService.js`
2. Modify prompt to ask for budget:
```javascript
const prompt = `Break down this goal into tasks: ${goal}
For each task, include:
- id, taskName, description, estimatedDays, priority, dependsOn, estimatedBudget
Return as JSON array.`;
```
3. Update `GoalPlan.js` schema to include `estimatedBudget: Number`
4. Update frontend to display budget

### Exercise 3: Add error boundary in React
**Task:** Display friendly error message when API fails.

```javascript
const [error, setError] = useState('');

const handleGeneratePlan = async (goal) => {
  try {
    setError('');
    const plan = await generatePlan(goal);
    setTaskPlan(plan);
  } catch (error) {
    setError('Failed to generate plan: ' + error.message);
  }
};

return (
  <>
    {error && <div className="error">{error}</div>}
    {/* rest of component */}
  </>
);
```

---

## Key Concepts Checklist

- [ ] Understand what LLMs are and how APIs work
- [ ] Trace the complete data flow from frontend to backend to LLM
- [ ] Know the purpose of each file (controller, service, model, parser)
- [ ] Understand async/await and why it matters
- [ ] Know how to call APIs and parse responses
- [ ] Understand MongoDB schema (you already know Mongoose)
- [ ] Know how React components use state and props
- [ ] Be able to explain error handling strategies

---

## Resources for Deeper Learning

**LLMs & APIs:**
- OpenAI Docs: https://platform.openai.com/docs
- Google Gemini Docs: https://ai.google.dev/
- REST API Basics: https://www.youtube.com/watch?v=SLwpqD8n3d0

**Backend (Node.js/Express):**
- Express Guide: https://expressjs.com/
- Mongoose Docs: https://mongoosejs.com/

**Frontend (React):**
- React Hooks: https://react.dev/reference/react/hooks
- Async/Await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

**Interview Prep:**
- Practice explaining the project line-by-line
- Build small variations (add more LLM features, different data structures)
- Debug issues (break the code intentionally, fix it)

---

## Next Steps

1. **Week 1:** Run the project locally, follow the data flow manually
2. **Week 2:** Modify one component (e.g., change LLM prompt)
3. **Week 3:** Add a new feature (e.g., export plan as PDF)
4. **Interview Ready:** Be able to explain every file and every decision

Good luck! 🚀
