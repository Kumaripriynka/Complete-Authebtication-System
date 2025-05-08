import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests that require authorization
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Auth services
const authService = {
  register: (userData) => {
    return api.post('/register', userData);
  },
  
  login: (credentials) => {
    return api.post('/login', credentials);
  },
  
  forgotPassword: (email) => {
    return api.post('/forgot-password', { email });
  },
  
  resetPassword: (token, password) => {
    return api.post(`/reset-password/${token}`, { password });
  },
  
  getUserProfile: () => {
    return api.get('/home');
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
};

export default authService;
