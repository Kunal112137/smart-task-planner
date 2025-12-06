
const parseAndValidateTasks = (response) => {
  try {
    let jsonString = response.trim();

    // Remove markdown code blocks if present
    if (jsonString.includes('```json')) {
      jsonString = jsonString.split('```json')[1].split('```')[0].trim();
    } else if (jsonString.includes('```')) {
      jsonString = jsonString.split('```')[1].split('```')[0].trim();
    }

    // Parse JSON
    let tasks = JSON.parse(jsonString);

    // Ensure it's an array
    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }

    // First pass: validate basic structure and create name -> ID map
    const taskNameToId = {};
    const validatedTasks = [];

    // First: validate all tasks and build name map
    for (let i = 0; i < tasks.length; i++) {
      const validated = validateTask(tasks[i], i);
      validatedTasks.push(validated);
      taskNameToId[validated.taskName.toLowerCase()] = validated.id;
    }

    // Second pass: convert task name dependencies to IDs
    for (let i = 0; i < validatedTasks.length; i++) {
      const task = validatedTasks[i];
      const convertedDeps = [];

      if (Array.isArray(task.dependsOn) && task.dependsOn.length > 0) {
        for (const dep of task.dependsOn) {
          // If already a number, keep it
          if (typeof dep === 'number') {
            if (dep > 0 && dep <= validatedTasks.length) {
              convertedDeps.push(dep);
            }
          }
          // If a string, try to match it to a task name
          else if (typeof dep === 'string') {
            const depLower = dep.toLowerCase().trim();
            const matchedId = taskNameToId[depLower];
            if (matchedId !== undefined) {
              convertedDeps.push(matchedId);
            }
          }
        }
      }

      validatedTasks[i].dependsOn = convertedDeps;
    }

    if (validatedTasks.length === 0) {
      throw new Error('No valid tasks generated');
    }

    return validatedTasks;
  } catch (error) {
    console.error('Parse error:', error.message);
    throw new Error(`Failed to parse task plan: ${error.message}`);
  }
};


const validateTask = (task, index) => {
  // Check required fields
  if (!task.taskName || typeof task.taskName !== 'string') {
    throw new Error(`Task ${index + 1}: taskName is required and must be a string`);
  }

  if (!task.description || typeof task.description !== 'string') {
    throw new Error(`Task ${index + 1}: description is required and must be a string`);
  }

  if (typeof task.estimatedDays !== 'number' || task.estimatedDays <= 0) {
    throw new Error(`Task ${index + 1}: estimatedDays must be a positive number`);
  }

  // Normalize fields
  const normalizedTask = {
    id: index + 1,
    taskName: task.taskName.trim(),
    description: task.description.trim(),
    estimatedDays: Math.ceil(task.estimatedDays),
    priority: normalizePriority(task.priority),
    dependsOn: Array.isArray(task.dependsOn) ? task.dependsOn : [],
    deadline: task.deadline || calculateDeadline(task.estimatedDays)
  };

  return normalizedTask;
};

const normalizePriority = (priority) => {
  if (!priority) return 'medium';

  const normalizedPriority = priority.toString().toLowerCase();
  const validPriorities = ['high', 'medium', 'low'];

  return validPriorities.includes(normalizedPriority) ? normalizedPriority : 'medium';
};


const calculateDeadline = (estimatedDays) => {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + estimatedDays);

  return deadline.toISOString().split('T')[0];
};

module.exports = {
  parseAndValidateTasks,
  validateTask,
  normalizePriority,
  calculateDeadline
};
