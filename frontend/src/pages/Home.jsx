import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleUnauthorized("Please login to continue");
          return;
        }

        const response = await axios.get("https://complete-authentication-system-backend-2r3d.onrender.com/auth/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          handleUnauthorized("Session expired. Please login again");
        }
      } catch (err) {
        handleUnauthorized("Authentication failed. Please login again");
      } finally {
        setIsLoading(false);
      }
    };

    const handleUnauthorized = (msg) => {
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        onClose: () => {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("You've been successfully logged out", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      onClose: () => {
        setUser(null);
        navigate("/login");
      }
    });
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
          <span className="ml-2 text-xl font-semibold text-gray-800">AuthApp</span>
        </div>
        
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={handleLoginRedirect}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleSignupRedirect}
              className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your profile...</p>
              </div>
            ) : user ? (
              <>
                <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  Welcome back, {user.username || user.email}!
                </h1>
                <p className="text-gray-600 mb-6 text-center">
                  You're now logged in to your account.
                </p>

                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-indigo-700 mb-2">Account Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    {user.username && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Username:</span> {user.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Sign Out
                  </button>
                  {/* <button
                    onClick={() => navigate("/profile")}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    View Profile
                  </button> */}
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome to AuthApp</h2>
                <p className="text-gray-600 mb-6">Please login or sign up to continue</p>
                <div className="space-y-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignupRedirect}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Create New Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AuthApp. All rights reserved.
      </footer>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Home;
