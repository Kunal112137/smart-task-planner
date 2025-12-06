

import React, { useState } from 'react';
import './GoalInput.css';

const GoalInput = ({ onSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setGoal(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!goal.trim()) {
      setError('Please enter a goal');
      return;
    }

    if (goal.trim().length < 10) {
      setError('Goal must be at least 10 characters long');
      return;
    }

    onSubmit(goal.trim());
  };

  return (
    <div className="goal-input-container">
        <div className="goal-input-card">
          <img src={require('../assets/goal.png')} alt="Goal" style={{width: 100, display: 'block', margin: '0 auto 16px auto'}} />
          <h1 className="title">🎯 Smart Task Planner</h1>
          <p className="subtitle">Break down your goals into actionable tasks</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="goal">Enter Your Goal</label>
            <textarea
              id="goal"
              value={goal}
              onChange={handleChange}
              placeholder="e.g., Launch a product in 2 weeks, Learn React in one month..."
              disabled={isLoading}
              rows="4"
              className="textarea"
            />
            <p className="char-count">{goal.length} / 1000 characters</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !goal.trim()}
            className="submit-button"
          >
            {isLoading ? '⏳ Generating Plan...' : '✨ Generate Task Plan'}
          </button>
        </form>

        <div className="examples">
          <p className="examples-title">Example Goals:</p>
          <ul>
            <li>Launch a product in 2 weeks</li>
            <li>Learn React and build a project in one month</li>
            <li>Reorganize and optimize my project management system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoalInput;
