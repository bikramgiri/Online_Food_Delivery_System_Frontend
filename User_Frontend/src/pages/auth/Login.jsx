import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProfile, loginUser } from "../../store/authSlice";
import { STATUSES } from "../../global/statuses";
// Google Icon
import { FcGoogle } from "react-icons/fc";
// Facebook Icon
import { FaFacebook } from "react-icons/fa";
// Eye Icons for password visibility
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { token, status } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
    setLoginError("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError(""); // Clear previous login errors

    if (!userData.email || !userData.password) {
      setLoginError("Email and password are required");
      return;
    }

    if (!validateEmail(userData.email)) {
      setEmailError("Invalid email format");
      return;
    }

    dispatch(loginUser(userData))
      .then(() => {
        dispatch(fetchUserProfile());
        setMessage("Login successful");
        setTimeout(() => {
          setMessage("");
          navigate("/");
        }, 2000); // Delay navigation to show success message
      })
      .catch((error) => {
        // const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
        if (error.response?.status === 404) {
          setEmailError("User not found");
        } else if (error.response?.status === 401) {
          setPasswordError("Invalid password");
        }
      });
  };

  // Handle token and navigation on status change
  useEffect(() => {
    if (status === STATUSES.SUCCESS && token) {
      setMessage("Login successful");
      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 2000);
    } else if (status === STATUSES.ERROR) {
      const error = new Error("Login failed");
      if (error.response?.status === 404) {
        setEmailError("User not found");
      } else if (error.response?.status === 400) {
        setPasswordError("Invalid password");
      } 
      // else {
      //   setLoginError("Login failed. Please try again.");
      // }
    }

        // Check logout success from query parameter
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("logout") === "true") {
      setMessage("Logout successful");
      setTimeout(() => {
        setMessage("");
        navigate("/login", { replace: true });
      }, 2000);
    }
  }, [status, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-30 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          {/* Logo can be added here */}
        </div>
        <p
          className={`mb-4 text-center ${message.includes("Logout") ? "text-red-600" : "text-green-700"}`}
        >
          {message}
        </p>
        {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}
        {emailError && <p className="text-red-500 text-center mb-4">{emailError}</p>}
        {passwordError && <p className="text-red-500 text-center mb-4">{passwordError}</p>}

        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Foods Hub</h1>
        <h2 className="text-sm font-bold text-center text-gray-900 mb-6">
          Login in with your email
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email*"
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password*"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute inset-y-0 flex items-center pr-4 mt-34 ml-88 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <AiFillEyeInvisible className="h-5 w-5" />
              ) : (
                <AiFillEye className="h-5 w-5" />
              )}
            </button>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="cursor-pointer h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <Link to="/forgotpassword" className="font-medium text-sm text-indigo-600">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="cursor-pointer w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {status === STATUSES.LOADING ? "Logging in..." : "Login"}
          </button>
          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 text-sm font-medium">
              Sign up here
            </Link>
          </p>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Or login with</p>
          <div className="mt-2 flex justify-center space-x-4">
            <button onClick={() => window.open("http://localhost:3000/auth/google", "_self")} className="cursor-pointer flex ml-3 items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50">
              <FcGoogle className="w-5 h-5 mr-2" />
              <span className="text-sm text-gray-700">Google</span>
            </button>
            <button className="cursor-pointer flex ml-1 items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50">
              <FaFacebook className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm text-gray-700">Facebook</span>
            </button>
            <button className="cursor-pointer flex items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.475 2 2 6.475 2 12c0 4.425 2.865 8.175 6.839 9.495.5.09.682-.218.682-.484 0-.237-.009-.866-.014-1.7-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.621.069-.609.069-.609 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.097-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.525-4.475-10-10-10z" />
              </svg>
              <span className="text-sm text-gray-700">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;