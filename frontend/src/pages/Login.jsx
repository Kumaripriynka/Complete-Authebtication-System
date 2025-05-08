import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'lucide-react'; // npm install lucide-react

const Login = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const getErrorMessage = (err) => {
        const status = err.response?.status;
        switch (status) {
            case 400:
                return "Please enter both email and password.";
            case 401:
                return "Incorrect email or password.";
            case 403:
                return "Access denied. Try again later.";
            case 404:
                return "Account not found. Please register first.";
            case 429:
                return "Too many attempts. Please wait.";
            case 500:
                return "Server error. Please try again later.";
            default:
                return "Login failed. Please try again.";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Configure axios to include credentials (cookies)
            const response = await axios.post(
                'http://localhost:3000/auth/login',
                values,
                { withCredentials: true }
            );

            if (response.status === 200) {
                // Save the user info for local use if needed
                localStorage.setItem('user', JSON.stringify(response.data.user));
                toast.success("Login successful!");
                setTimeout(() => navigate("/"), 1500);
            }

            setValues({ email: '', password: '' });
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back 👋</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-gray-600 font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            value={values.email}
                            onChange={handleChanges}
                            required
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-gray-600 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Enter password"
                            value={values.password}
                            onChange={handleChanges}
                            required
                            className="w-full px-4 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            minLength="6"
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute top-9 right-3 cursor-pointer text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                        <Link to="/forgot-password" className="text-blue-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white font-semibold py-2 rounded-lg shadow-sm transition disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
