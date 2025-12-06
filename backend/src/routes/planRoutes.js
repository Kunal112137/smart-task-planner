
const express = require('express');

const planController = require('../controllers/planController');
const { validateGoal } = require('../middleware/validation');
const GoalPlan = require('../models/GoalPlan');

const router = express.Router();
router.get('/plans', async (req, res, next) => {
  try {
    const plans = await GoalPlan.find().sort({ generatedAt: -1 });
    res.json({ success: true, plans });
  } catch (err) {
    next(err);
  }
});



router.post('/generate-plan', validateGoal, planController.generatePlan);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is healthy' });
});

module.exports = router;
