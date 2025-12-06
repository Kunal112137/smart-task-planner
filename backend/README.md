# Smart Task Planner - Backend

Backend API for the Smart Task Planner application that breaks down goals into actionable tasks using AI.

## 🚀 Features

- **AI-Powered Task Breakdown**: Uses OpenAI or Google Gemini to generate structured task plans
- **RESTful API**: Easy-to-use endpoints for task generation
- **Structured Response**: Returns well-formatted tasks with deadlines and dependencies
- **Error Handling**: Comprehensive error handling and validation
- **CORS Enabled**: Ready for frontend integration
- **Environment Configuration**: Easy setup with .env files

## 📋 API Endpoints

### Generate Task Plan
```
POST /api/generate-plan
```

**Request Body:**
```json
{
  "goal": "Launch a product in 2 weeks"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task plan generated successfully",
  "goal": "Launch a product in 2 weeks",
  "taskCount": 8,
  "totalEstimatedDays": 14,
  "taskPlan": [
    {
      "id": 1,
      "taskName": "Define Product Requirements",
      "description": "Outline all product features and specifications",
      "estimatedDays": 2,
      "priority": "high",
      "dependsOn": [],
      "deadline": "2025-12-05"
    },
    // ... more tasks
  ],
  "generatedAt": "2025-12-03T10:30:00.000Z"
}
```

### Health Check
```
GET /api/health
```

## 🛠 Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```

3. **Update .env with your API keys**
   ```
   PORT=5000
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your_api_key_here
   CORS_ORIGIN=http://localhost:3000
   ```

## ▶️ Running the Backend

**Development Mode:**
```bash
npm run dev
```
Requires `nodemon` (installed with dev dependencies)

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `LLM_PROVIDER` | AI provider (openai/gemini) | openai |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `CORS_ORIGIN` | CORS allowed origin | * |
| `MONGODB_URI` | MongoDB connection string (optional) | - |

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js                 # Main application entry
│   ├── routes/
│   │   └── planRoutes.js        # Route definitions
│   ├── controllers/
│   │   └── planController.js    # Request handlers
│   ├── services/
│   │   ├── planService.js       # Business logic
│   │   └── llmService.js        # LLM integration
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Request validation
│   ├── models/
│   │   └── (MongoDB models)
│   └── utils/
│       └── taskParser.js        # Response parsing
├── package.json
├── .env.example
└── README.md
```

## 💡 How It Works

1. **Request**: User sends a goal via POST `/api/generate-plan`
2. **Validation**: Request is validated for required fields
3. **LLM Call**: Goal is sent to OpenAI/Gemini API with a structured prompt
4. **Parsing**: Response is parsed into structured task objects
5. **Response**: Formatted tasks with deadlines and dependencies are returned

## 🔌 LLM Integration

### OpenAI
- Uses GPT-3.5-turbo model
- Requires valid `OPENAI_API_KEY`
- Structured prompt ensures JSON response

### Google Gemini
- Uses Gemini Pro model
- Requires valid `GEMINI_API_KEY`
- Handles JSON extraction from responses

## ✅ Testing the API

### Using cURL
```bash
curl -X POST http://localhost:5000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Build a mobile app in one month"
  }'
```

### Using Thunder Client/Postman
1. Create a new POST request to `http://localhost:5000/api/generate-plan`
2. Set Header: `Content-Type: application/json`
3. Set Body:
   ```json
   {
     "goal": "Build a mobile app in one month"
   }
   ```
4. Click Send

## 📦 Dependencies

- **express**: Web framework
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management
- **axios**: HTTP client
- **mongoose**: MongoDB ODM (optional)
- **nodemon**: Development tool (dev only)

## 🚨 Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description"
}
```

Common errors:
- `400`: Missing or invalid goal
- `401`: Missing API key
- `500`: Server error or LLM API failure

## 🎯 Next Steps

1. Set up environment variables with actual API keys
2. Test endpoints with sample goals
3. Integrate with frontend application
4. Deploy to production server

---

**Made with ❤️ for Smart Task Planner**
