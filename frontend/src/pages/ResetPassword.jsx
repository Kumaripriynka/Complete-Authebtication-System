import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    if (e.target.name === 'newPassword') {
      setNewPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    
    let strength = 0;
    // Length check
    if (newPassword.length >= 8) strength += 1;
    // Lowercase check
    if (/[a-z]/.test(newPassword)) strength += 1;
    // Uppercase check
    if (/[A-Z]/.test(newPassword)) strength += 1;
    // Number check
    if (/\d/.test(newPassword)) strength += 1;
    // Special character check
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const passwordSuggestions = [
    'At least 8 characters long',
    'Contains lowercase letters',
    'Contains uppercase letters',
    'Contains numbers',
    'Contains special characters',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (passwordStrength < 3) {
      toast.error('Password is too weak. Please follow the suggestions.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(token, newPassword);

      if (response.status === 200) {
        toast.success('Password reset successful!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-600 font-medium mb-1">New Password</label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password strength meter */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i}
                      className={`h-1 flex-1 rounded-sm ${
                        i <= passwordStrength 
                          ? passwordStrength < 3 
                            ? 'bg-red-500' 
                            : passwordStrength < 5 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Password strength: 
                  <span className={`ml-1 font-medium ${
                    passwordStrength < 3 
                      ? 'text-red-500' 
                      : passwordStrength < 5 
                        ? 'text-yellow-500' 
                        : 'text-green-500'
                  }`}>
                    {passwordStrength < 3 
                      ? 'Weak' 
                      : passwordStrength < 5 
                        ? 'Medium' 
                        : 'Strong'}
                  </span>
                </div>
                
                {/* Password suggestions */}
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-medium mb-1">Suggestions:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {passwordSuggestions.map((suggestion, index) => (
                      <li 
                        key={index} 
                        className={
                          (index === 0 && newPassword.length >= 8) ||
                          (index === 1 && /[a-z]/.test(newPassword)) ||
                          (index === 2 && /[A-Z]/.test(newPassword)) ||
                          (index === 3 && /\d/.test(newPassword)) ||
                          (index === 4 && /[^A-Za-z0-9]/.test(newPassword))
                            ? 'text-green-500 line-through' 
                            : ''
                        }
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-600 font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:bg-gray-400 transition-colors"
            disabled={loading || passwordStrength < 3 || newPassword !== confirmPassword}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default ResetPassword;