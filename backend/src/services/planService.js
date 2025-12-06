

const llmService = require('./llmService');
const { parseAndValidateTasks } = require('../utils/taskParser');


const generateTaskPlan = async (goal) => {
  try {
    // Call LLM to get task breakdown
    const llmResponse = await llmService.callLLM(goal);

    // Parse and validate the response
    const taskPlan = parseAndValidateTasks(llmResponse);

    console.log(`✅ Generated ${taskPlan.length} tasks`);

    return taskPlan;
  } catch (error) {
    console.error('Plan Service Error:', error.message);
    throw error;
  }
};

module.exports = {
  generateTaskPlan
};
