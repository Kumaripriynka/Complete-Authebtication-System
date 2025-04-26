import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const passwordRequirements = [
  { id: 1, text: "Minimum 8 characters", validator: (pwd) => pwd.length >= 8 },
  { id: 2, text: "At least 1 uppercase letter", validator: (pwd) => /[A-Z]/.test(pwd) },
  { id: 3, text: "At least 1 lowercase letter", validator: (pwd) => /[a-z]/.test(pwd) },
  { id: 4, text: "At least 1 number", validator: (pwd) => /\d/.test(pwd) },
  { id: 5, text: "At least 1 special character", validator: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
];

const Register = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState(
    passwordRequirements.map(req => ({ ...req, isValid: false }))
  );

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (name === 'password') {
      const updatedChecks = passwordRequirements.map(req => ({
        ...req,
        isValid: req.validator(value)
      }));
      setPasswordChecks(updatedChecks);
    }
  };

  const isPasswordValid = passwordChecks.every(check => check.isValid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      toast.error("Please meet all password requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://complete-authentication-system-backend-2r3d.onrender.com/auth/register',
        values
      );
      if (response.status === 201) {
        toast.success("🎉 Registration successful! You can now login");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Join Us</h2>
          <p className="text-gray-500 mt-2">Create your account in seconds</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
            <X className="mr-2" size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="e.g. alexsmith"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              name="username"
              value={values.username}
              onChange={handleChanges}
              required
              minLength="3"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              name="email"
              value={values.email}
              onChange={handleChanges}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={`w-full px-4 py-3 border ${isPasswordValid && values.password ? 'border-green-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all pr-12`}
                name="password"
                value={values.password}
                onChange={handleChanges}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {values.password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isPasswordValid ? 'bg-green-500' : 
                        passwordChecks.filter(c => c.isValid).length >= 3 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{
                        width: `${(passwordChecks.filter(c => c.isValid).length / passwordChecks.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className={`ml-2 text-xs font-medium ${
                    isPasswordValid ? 'text-green-600' : 
                    passwordChecks.filter(c => c.isValid).length >= 3 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {isPasswordValid ? 'Strong' : 
                     passwordChecks.filter(c => c.isValid).length >= 3 ? 'Medium' : 'Weak'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {passwordChecks.map((check) => (
                    <div key={check.id} className="flex items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                        check.isValid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {check.isValid ? (
                          <Check size={14} strokeWidth={3} />
                        ) : (
                          <X size={14} strokeWidth={2.5} />
                        )}
                      </div>
                      <span className={`text-sm ${
                        check.isValid ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {check.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isPasswordValid 
                ? 'bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;
