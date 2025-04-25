import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const canSubmit = () => {
    // Prevent multiple requests within 60 seconds
    if (lastRequestTime && Date.now() - lastRequestTime < 60000) {
      toast.warn('Please wait a moment before requesting another reset link');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canSubmit()) return;

    setLoading(true);
    setLastRequestTime(Date.now());

    try {
      const response = await authService.forgotPassword(email);
      
      // Always show success even if email doesn't exist (security)
      toast.success('If this email exists in our system, you will receive a reset link shortly.');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      // Generic error message
      toast.error('There was an issue processing your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Enter your Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:bg-gray-400"
            disabled={loading || (lastRequestTime && Date.now() - lastRequestTime < 60000)}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            For security reasons, the reset link will expire in 1 hour and can only be used once.
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-green-600 hover:underline focus:outline-none"
            >
              Back to Login
            </button>
          </p>
        </div>

        <ToastContainer position="top-center" autoClose={5000} />
      </div>
    </div>
  );
};

export default ForgotPassword;