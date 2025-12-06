

import React, { useState } from 'react';
import GoalInput from './components/GoalInput';
import TaskPlan from './components/TaskPlan';
import { generateTaskPlan } from './services/apiService';
import './App.css';

function App() {
  const [taskPlan, setTaskPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handleGoalSubmit = async (goal) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Sending goal to backend:', goal);
      const result = await generateTaskPlan(goal);

      console.log('Received task plan:', result);
      setTaskPlan(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate task plan. Please check your API configuration.');
      setTaskPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleReset = () => {
    setTaskPlan(null);
    setError('');
  };

  if (error && !taskPlan) {
    return (
      <div className="error-screen">
        <div className="error-card">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={handleReset} className="error-button">
            Try Again
          </button>
          <p className="error-hint">
            Make sure your backend is running on http://localhost:5000 and has a valid API key configured.
          </p>
        </div>
      </div>
    );
  }

  // Show task plan or input form
  return (
    <div className="App">
      {!taskPlan ? (
        <GoalInput onSubmit={handleGoalSubmit} isLoading={isLoading} />
      ) : (
        <TaskPlan plan={taskPlan} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
