import axios from 'axios';

// 1. Get the backend URL from an environment variable, or default
//    to your local server. We'll set this up for Vercel later.
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// 2. Create the main 'api' instance
const api = axios.create({
  baseURL: API_URL,
});

// 3. This is the magic part: an "interceptor"
//    It runs *before* every single request.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('access_token');
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// 4. We also add a response interceptor for handling 401 errors (e.g., token expired)
//    This is more advanced, but good to have.
api.interceptors.response.use(
  (response) => response, // Just return the response if it's good
  (error) => {
    // Check if the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Reload the page to force the user to the login screen
      // Or you could redirect them programmatically
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;