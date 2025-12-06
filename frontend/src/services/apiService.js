
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


export const generateTaskPlan = async (goal) => {
  try {
    const response = await apiClient.post('/generate-plan', { goal });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to generate plan';
    throw new Error(errorMessage);
  }
};

export default apiClient;
