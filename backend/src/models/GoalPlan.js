const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  description: { type: String, required: true },
  estimatedDays: { type: Number, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  dependsOn: [{ type: String }],
  deadline: { type: String, required: true }
}, { _id: false });

const GoalPlanSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  taskPlan: { type: [TaskSchema], required: true },
  totalEstimatedDays: { type: Number, required: true },
  taskCount: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoalPlan', GoalPlanSchema);
