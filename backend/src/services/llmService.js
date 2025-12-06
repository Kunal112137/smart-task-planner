

const axios = require('axios');

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';


const callOpenAI = async (goal) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in .env');
  }

  const prompt = `You are an expert project manager. Break down the following goal into actionable tasks with clear deadlines, dependencies, and descriptions.

Goal: "${goal}"

Provide a JSON array response ONLY (no markdown, no explanations) with exactly this structure:
[
  {
    "taskName": "Task 1 name",
    "description": "Brief description of the task",
    "estimatedDays": 2,
    "priority": "high",
    "dependsOn": [],
    "deadline": "2025-12-10"
  }
]

Rules:
- Create 5-10 realistic tasks based on the goal
- Estimate realistic timelines
- Include proper dependencies where applicable
- Set priorities (high, medium, low)
- Make deadlines achievable based on estimated days
- Use only valid JSON in response, no markdown formatting`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful project planning assistant. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error.response?.data?.error?.message || error.message}`);
  }
};

const callGemini = async (goal) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in .env');
  }

  const prompt = `You are an expert project manager. Break down the following goal into actionable tasks with clear deadlines, dependencies, and descriptions.

Goal: "${goal}"

Provide a JSON array response ONLY (no markdown, no explanations) with exactly this structure:
[
  {
    "taskName": "Task 1 name",
    "description": "Brief description of the task",
    "estimatedDays": 2,
    "priority": "high",
    "dependsOn": [],
    "deadline": "2025-12-10"
  }
]

Rules:
- Create 5-10 realistic tasks based on the goal
- Estimate realistic timelines
- Include proper dependencies where applicable
- Set priorities (high, medium, low)
- Make deadlines achievable based on estimated days
- Use only valid JSON in response, no markdown formatting`;

  try {
    // Step 1: List available models to pick a supported one
    const listResp = await axios.get(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const models = listResp.data.models || [];

    if (!models.length) {
      throw new Error('No Gemini models found for this API key. Verify your key and project permissions.');
    }

    let chosenModel = models.find(m => /gemini/i.test(m.name)) || models[0];

    const modelPath = chosenModel.name.startsWith('models/') ? chosenModel.name : `models/${chosenModel.name}`;
    const endpoint = `https://generativelanguage.googleapis.com/v1/${modelPath}:generateContent?key=${apiKey}`;

    console.log(`Calling Gemini model: ${chosenModel.name}`);

    const response = await axios.post(
      endpoint,
      {
        // body shape matches the generateContent style used previously
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Support responses that may differ slightly in shape
    const candidate = response.data?.candidates?.[0] || response.data?.candidates || null;
    if (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]) {
      return candidate.content.parts[0].text;
    }

    // Fallback: try alternative response paths
    if (response.data?.candidates && response.data.candidates[0]) {
      return response.data.candidates[0];
    }

    throw new Error('Unexpected Gemini response format');
  } catch (error) {
    // If the error indicates model not supported, provide guidance
    const msg = error.response?.data?.error?.message || error.message;
    const helpful = `Gemini API Error: ${msg} \nRun the ListModels call to see available models:\n  curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY"`;
    throw new Error(helpful);
  }
};


const callLLM = async (goal) => {
  console.log(`🤖 Calling ${LLM_PROVIDER} API...`);

  if (LLM_PROVIDER === 'openai') {
    return await callOpenAI(goal);
  } else if (LLM_PROVIDER === 'gemini') {
    return await callGemini(goal);
  } else {
    throw new Error(`Unknown LLM provider: ${LLM_PROVIDER}`);
  }
};

module.exports = {
  callLLM,
  callOpenAI,
  callGemini
};
