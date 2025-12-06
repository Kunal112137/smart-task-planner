# 🏗️ Smart Task Planner - System Architecture

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     🖥️  FRONTEND (React)                         │
│                   http://localhost:3000                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    App.js (State)                        │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ State: taskPlan, isLoading, error                   │ │   │
│  │  │ Methods: handleGoalSubmit, handleReset             │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│           ↓                                        ↓              │
│  ┌──────────────────────────┐     ┌──────────────────────────┐  │
│  │   GoalInput Component    │     │  TaskPlan Component      │  │
│  │  (shows when no plan)    │     │ (shows when plan ready)  │  │
│  │                          │     │                          │  │
│  │ • Goal textarea          │     │ • Task cards (grid)      │  │
│  │ • Character counter      │     │ • Priority badges        │  │
│  │ • Submit button          │     │ • Stats section          │  │
│  │ • Validation             │     │ • Reset button           │  │
│  └──────────────────────────┘     └──────────────────────────┘  │
│           ↓                                        ↑              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        apiService.js (Axios API Client)                 │   │
│  │  • generateTaskPlan(goal)                               │   │
│  │  • Baseurl: http://localhost:5000/api                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│                      HTTP POST                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             ║
                             ║ CORS Enabled
                             ║ Content-Type: application/json
                             ║
┌─────────────────────────────────────────────────────────────────┐
│                    ⚙️  BACKEND (Node.js)                         │
│                   http://localhost:5000                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              index.js (Express Server)                     │ │
│  │  • Port: 5000                                             │ │
│  │  • CORS middleware                                        │ │
│  │  • JSON body parser                                       │ │
│  │  • Global error handler                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Routes (planRoutes.js)                        │ │
│  │                                                             │ │
│  │  POST /api/generate-plan                                  │ │
│  │   ↓ (with validation middleware)                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Middleware (validation.js, errorHandler.js)        │ │
│  │  • validateGoal()  - Validate input                        │ │
│  │  • errorHandler()  - Catch all errors                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓ (if valid)                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          Controller (planController.js)                    │ │
│  │  • generatePlan(req, res, next)                           │ │
│  │  • Calls: planService.generateTaskPlan()                  │ │
│  │  • Returns: JSON response                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Service Layer (planService.js)                     │ │
│  │  • generateTaskPlan(goal)                                 │ │
│  │  • Calls: llmService.callLLM()                            │ │
│  │  • Calls: parseAndValidateTasks()                         │ │
│  │  • Returns: Validated task array                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │       LLM Service (llmService.js)                          │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ callLLM(goal)                                       │  │ │
│  │  │  ↓                                                  │  │ │
│  │  │  Provider: LLM_PROVIDER (from .env)               │  │ │
│  │  │  /      \                                          │  │ │
│  │  │ OpenAI  Gemini                                     │  │ │
│  │  │  ↓        ↓                                        │  │ │
│  │  │  call    call                                      │  │ │
│  │  │ callOpenAI() callGemini()                         │  │ │
│  │  │  ↓        ↓                                        │  │ │
│  │  │ API.openai.com  generativelanguage.googleapis.com │  │ │
│  │  │                                                    │  │ │
│  │  │ Sends: Structured prompt with goal               │  │ │
│  │  │ Gets: JSON response with tasks                   │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │       Utils (taskParser.js)                               │ │
│  │  • parseAndValidateTasks(response)                        │ │
│  │  • validateTask(task, index)                             │ │
│  │  • normalizePriority(priority)                           │ │
│  │  • calculateDeadline(estimatedDays)                      │ │
│  │                                                            │ │
│  │  Ensures all tasks have:                                 │ │
│  │  ✓ taskName, description                                │ │
│  │  ✓ estimatedDays, priority                              │ │
│  │  ✓ dependsOn, deadline                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │      Return to Controller                                  │ │
│  │  • taskPlan (validated array)                            │ │
│  │  • totalEstimatedDays (calculated)                       │ │
│  │  • taskCount (array length)                              │ │
│  │  • generatedAt (timestamp)                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │      Return JSON Response (200 OK)                         │ │
│  │  {                                                         │ │
│  │    success: true,                                         │ │
│  │    taskPlan: [...],                                       │ │
│  │    taskCount: 8,                                          │ │
│  │    totalEstimatedDays: 14,                                │ │
│  │    generatedAt: "2025-12-03T10:30:00.000Z"               │ │
│  │  }                                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             ║
                             ║ HTTP Response
                             ║ Status: 200 OK
                             ║ Content-Type: application/json
                             ║
┌─────────────────────────────────────────────────────────────────┐
│                    🖥️  FRONTEND (React)                          │
│                                                                   │
│  • Receive response                                              │
│  • Update App state                                              │
│  • Re-render TaskPlan component                                  │
│  • Display tasks in cards                                        │
│  • Show stats and priorities                                     │
│  • Enable "New Goal" button                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request-Response Flow

### Step 1: User Input
```
User enters: "Launch a product in 2 weeks"
```

### Step 2: Frontend Validation
```
Validation Rules:
✓ String type check
✓ Length check (10-1000 chars)
✓ Trim whitespace
→ If valid, send to backend
```

### Step 3: API Call
```
POST /api/generate-plan
Headers: Content-Type: application/json
Body: { goal: "Launch a product in 2 weeks" }
```

### Step 4: Backend Processing
```
1. Receive request
2. Validate input
3. Call LLM service
4. Send to AI API (OpenAI/Gemini)
5. Receive JSON response
6. Parse and validate
7. Normalize data
8. Return response
```

### Step 5: Frontend Display
```
1. Receive JSON
2. Store in state
3. Render TaskPlan component
4. Display task cards
5. Show stats
6. Enable interactions
```

---

## 📊 Data Flow

### Input Schema
```javascript
{
  goal: string (10-1000 chars)
}
```

### Output Schema
```javascript
{
  success: boolean,
  message: string,
  goal: string,
  taskCount: number,
  totalEstimatedDays: number,
  taskPlan: [
    {
      id: number,
      taskName: string,
      description: string,
      estimatedDays: number,
      priority: "high" | "medium" | "low",
      dependsOn: number[],
      deadline: string (YYYY-MM-DD)
    }
  ],
  generatedAt: ISO 8601 timestamp
}
```

---

## 🛠️ Dependency Graph

### Frontend Dependencies
```
App.js
├── GoalInput.js
│   └── GoalInput.css
├── TaskPlan.js
│   └── TaskPlan.css
├── apiService.js
│   └── axios
├── App.css
└── index.js
    ├── index.css
    └── index.html (public)
```

### Backend Dependencies
```
index.js
├── routes/planRoutes.js
│   └── controllers/planController.js
│       ├── services/planService.js
│       │   ├── services/llmService.js
│       │   │   └── axios
│       │   └── utils/taskParser.js
│       └── middleware/validation.js
├── middleware/errorHandler.js
├── cors
├── dotenv
└── express
```

---

## ⚙️ Configuration Layers

### Environment Configuration
```
.env (not in repo)
├── PORT
├── NODE_ENV
├── LLM_PROVIDER
├── OPENAI_API_KEY
├── GEMINI_API_KEY
├── CORS_ORIGIN
└── MONGODB_URI
```

### Runtime Configuration
```
Express App
├── CORS settings
├── Body parser limits
├── Port binding
└── Error handling
```

### API Configuration
```
LLM Provider
├── Endpoint URL
├── API Key auth
├── Request headers
└── Model parameters
```

---

## 🔌 External APIs

### OpenAI Integration
```
Endpoint: https://api.openai.com/v1/chat/completions
Method: POST
Headers: Authorization: Bearer <OPENAI_API_KEY>
Model: gpt-3.5-turbo
Max Tokens: 2000
Temperature: 0.7
```

### Google Gemini Integration
```
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
Method: POST
Auth: Query param - ?key=<GEMINI_API_KEY>
Model: gemini-pro
```

---

## 🎨 Frontend Component Tree

```
<App>
  State:
  - taskPlan
  - isLoading
  - error

  Conditional Rendering:

  Option A: !taskPlan
  └── <GoalInput>
      - Form with textarea
      - Character counter
      - Submit button
      - Examples

  Option B: taskPlan exists
  └── <TaskPlan>
      - Header with goal
      - Stats (task count, days, date)
      - Grid of task cards
        └── <TaskCard> (repeated)
            - Task number
            - Task name
            - Description
            - Priority badge
            - Deadline
            - Estimated days
            - Dependencies
      - Footer with tip
      - Reset button
```

---

## 🔐 Security Layers

### Input Validation
```
Frontend:
├── Length check
├── Type check
└── Character validation

Backend:
├── Schema validation
├── Length enforcement
├── Type verification
└── Sanitization
```

### Error Handling
```
Frontend:
├── Try-catch blocks
├── Error state
└── User-friendly messages

Backend:
├── Try-catch wrappers
├── Global error handler
├── Specific error codes
└── Stack trace hiding (prod)
```

### API Security
```
├── CORS whitelisting
├── Environment variables
├── No hardcoded secrets
├── HTTPS ready
└── Rate limiting ready
```

---

## 📈 Scalability Path

### Current State (Phase 1)
```
✓ Single API endpoint
✓ Stateless backend
✓ No database
✓ In-memory processing
```

### Phase 2 - Data Persistence
```
+ MongoDB integration
+ User authentication
+ Plan history storage
+ API GET /api/plans
```

### Phase 3 - Advanced Features
```
+ Collaboration
+ Plan sharing
+ Advanced analytics
+ Export functionality
+ Real-time updates
```

### Phase 4 - Scale
```
+ Load balancing
+ Caching layer
+ CDN for frontend
+ Message queue
+ Microservices
```

---

## 🚀 Deployment Architecture

### Current (Development)
```
Developer Machine
├── Backend: localhost:5000
└── Frontend: localhost:3000
```

### Target (Production)
```
Production Cloud (AWS/Heroku/etc)
├── Backend API
│   ├── Node.js server
│   ├── HTTPS enabled
│   └── Auto-scaling
├── Frontend CDN
│   ├── Static React build
│   └── Global distribution
└── Database (optional)
    └── MongoDB Atlas
```

---

## 📊 Performance Considerations

### Frontend Performance
```
✓ React component memoization ready
✓ CSS animations optimized
✓ Axios request pooling
✓ Error boundary ready
```

### Backend Performance
```
✓ Async/await for concurrency
✓ Error handling non-blocking
✓ Response caching ready
✓ Rate limiting ready
```

### LLM Integration Performance
```
✓ Timeout handling ready
✓ Retry logic ready
✓ Provider fallback ready
✓ Parallel provider calls possible
```

---

## 🔄 State Management Flow

### App Component State
```
const [taskPlan, setTaskPlan] = useState(null)
├── null → No plan yet
└── object → Plan received

const [isLoading, setIsLoading] = useState(false)
├── false → Idle
└── true → Processing

const [error, setError] = useState('')
├── '' → No error
└── string → Error message
```

### State Transitions
```
Initial: taskPlan=null, isLoading=false, error=''

On Submit:
  ↓
isLoading=true

On Success:
  ↓
taskPlan=response, isLoading=false, error=''

On Error:
  ↓
error=message, isLoading=false, taskPlan=null

On Reset:
  ↓
taskPlan=null, isLoading=false, error=''
```

---

## ✅ Quality Assurance Points

### Code Quality Checks
```
✓ Consistent formatting
✓ JSDoc comments
✓ Error handling
✓ No hardcoded values
✓ DRY principles
✓ SOLID patterns
```

### Testing Points
```
✓ Happy path testing
✓ Error case testing
✓ Input validation testing
✓ API response testing
✓ Frontend rendering testing
```

### Production Readiness
```
✓ Environment config
✓ Error logging
✓ Performance metrics ready
✓ Security checks
✓ CORS configured
✓ HTTPS ready
```

---

**System Architecture Document**  
*Smart Task Planner v1.0.0*  
*December 3, 2025*

This architecture is designed for scalability, maintainability, and professional code quality.
