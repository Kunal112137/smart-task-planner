/**
 * Validation Middleware
 * Validates incoming requests
 */

const validateGoal = (req, res, next) => {
  const { goal } = req.body;

  // Check if goal exists
  if (!goal) {
    const error = new Error('Goal is required');
    error.statusCode = 400;
    return next(error);
  }

  // Check if goal is a string
  if (typeof goal !== 'string') {
    const error = new Error('Goal must be a string');
    error.statusCode = 400;
    return next(error);
  }

  // Check goal length
  const trimmedGoal = goal.trim();
  if (trimmedGoal.length < 10) {
    const error = new Error('Goal must be at least 10 characters long');
    error.statusCode = 400;
    return next(error);
  }

  if (trimmedGoal.length > 1000) {
    const error = new Error('Goal must be less than 1000 characters');
    error.statusCode = 400;
    return next(error);
  }

  // Update req.body with trimmed goal
  req.body.goal = trimmedGoal;
  next();
};

module.exports = {
  validateGoal
};
