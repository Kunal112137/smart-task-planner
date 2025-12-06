
import React from 'react';
import './TaskPlan.css';

const TaskPlan = ({ plan, onReset }) => {
  if (!plan) return null;

  const getPriorityClass = (priority) => {
    return `priority-${priority || 'medium'}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="task-plan-container">
      <img src={require('../assets/plan.png')} alt="Plan" style={{width: 100, display: 'block', margin: '0 auto 16px auto'}} />
      <div className="task-plan-header">
        <div>
          <h2 className="plan-title">📋 Your Task Plan</h2>
          <p className="plan-goal">Goal: {plan.goal}</p>
        </div>
        <button onClick={onReset} className="reset-button">← New Goal</button>
      </div>

      <div className="plan-stats">
        <div className="stat">
          <div className="stat-value">{plan.taskCount}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat">
          <div className="stat-value">{plan.totalEstimatedDays}</div>
          <div className="stat-label">Days</div>
        </div>
        <div className="stat">
          <div className="stat-value">{new Date(plan.generatedAt).toLocaleDateString()}</div>
          <div className="stat-label">Generated</div>
        </div>
      </div>

      <div className="tasks-container">
        {plan.taskPlan.map((task, index) => (
          <div key={task.id || index} className="task-card">
            <div className="task-header">
              <div className="task-info">
                <h3 className="task-name">
                  <span className="task-number">{task.id}</span>
                  {task.taskName}
                </h3>
                <p className="task-description">{task.description}</p>
              </div>
              <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                {task.priority?.toUpperCase() || 'MEDIUM'}
              </span>
            </div>

            <div className="task-details">
              <div className="detail">
                <span className="detail-label">📅 Deadline:</span>
                <span className="detail-value">{formatDate(task.deadline)}</span>
              </div>
              <div className="detail">
                <span className="detail-label">⏱️ Est. Days:</span>
                <span className="detail-value">{task.estimatedDays} days</span>
              </div>
              {task.dependsOn && task.dependsOn.length > 0 && (
                <div className="detail">
                  <span className="detail-label">🔗 Depends On:</span>
                  <span className="detail-value">Task(s) {task.dependsOn.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="plan-footer">
        <p className="footer-text">💡 Tip: Prioritize high-priority tasks first and respect dependencies for optimal execution.</p>
        <button onClick={onReset} className="plan-reset-button">✨ Create New Plan</button>
      </div>
    </div>
  );
};

export default TaskPlan;
