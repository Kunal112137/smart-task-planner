/**
 * Plan Controller
 * Handles business logic for task plan generation
 */
// controller


const planService = require('../services/planService');
const GoalPlan = require('../models/GoalPlan');


const generatePlan = async (req, res, next) => {
  try {
    const { goal } = req.body;

    console.log(`\n📝 Processing goal: ${goal}`);

    // Call the plan service to generate tasks
    const taskPlan = await planService.generateTaskPlan(goal);

    // Calculate total estimated days
    const totalEstimatedDays = taskPlan.reduce((sum, task) => {
      return sum + (task.estimatedDays || 0);
    }, 0);

    // Save to MongoDB
    const planDoc = await GoalPlan.create({
      goal,
      taskPlan,
      totalEstimatedDays,
      taskCount: taskPlan.length,
      generatedAt: new Date()
    });

    // Success response
    res.status(200).json({
      success: true,
      message: 'Task plan generated successfully',
      goal,
      taskPlan,
      totalEstimatedDays,
      taskCount: taskPlan.length,
      generatedAt: planDoc.generatedAt,
      id: planDoc._id
    });
  } catch (error) {
    console.error('Error generating plan:', error.message);
    next(error);
  }
};

module.exports = {
  generatePlan
};
