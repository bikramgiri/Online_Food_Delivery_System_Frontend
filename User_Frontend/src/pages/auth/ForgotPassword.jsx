import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotpassword } from "../../store/authSlice";
import { STATUSES } from "../../global/statuses";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth); // Access error and message from state
  const [userData, setUserData] = useState({
    email: "",
  });

  const [emailError, setEmailError] = useState("");
  // const [, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    if (name === "email") {
      setEmailError("");
      // dispatch(setError(null)); // Clear error when user types
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches backend regex
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError(""); // Clear email-specific errors

    if (!userData.email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(userData.email)) {
      setEmailError("Invalid email format");
      return;
    }

    dispatch(forgotpassword(userData))
      .then(() => {
        if (status === STATUSES.SUCCESS) {
          setMessage("OTP sent to your email"); // Override with a consistent message
          setTimeout(() => {
            // setMessage("");
            navigate("/verifyotp");
          }, 2000); // Delay navigation to show success message
        }
      })
      .catch((error) => { 
        if (error.response?.status === 404) {
          setEmailError("User not found");
          setTimeout(() => {
            setEmailError("");
          }, 2000); // Delay navigation to show success message
        } else if (error.response?.status === 400) {
          setEmailError(error.response?.data?.message || "Invalid email format");
        } else {
          setEmailError("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="mt-30 mb-10 flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-12 p-8 rounded-xl shadow-lg w-full max-w-md">
        {message && <p className="mb-4 text-center text-green-700">{message}</p>}
        {(emailError) && <p className="text-red-500 text-center mb-4">{emailError}</p>}

        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Foods Hub</h1>
        <h2 className="text-sm font-bold text-center text-gray-900 mb-6">
          Forgot Password
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
            {/* {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>} */}
          </div>
          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="cursor-pointer w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {status === STATUSES.LOADING ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;