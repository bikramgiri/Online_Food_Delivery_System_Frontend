import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changepassword } from "../../store/authSlice";
import { STATUSES } from "../../global/statuses";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // State to toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [userData, setUserData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    if (name === "email") setEmailError("");
    if (name === "otp") setOtpError("");
    if (name === "newPassword") setPasswordError("");
    if (name === "confirmPassword") setConfirmPasswordError("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setOtpError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Check required fields
    if (!userData.email) {
      setEmailError("Email is required");
      return;
    }
    if (!userData.otp) {
      setOtpError("OTP is required");
      return;
    }
    if (!userData.newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (!userData.confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      return;
    }

    // Validate email format
    if (!validateEmail(userData.email)) {
      setEmailError("Invalid email format");
      return;
    }

    // Validate password length
    if (userData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    // Check if new password and confirm password match
    if (userData.newPassword !== userData.confirmPassword) {
      setConfirmPasswordError("New password and confirm password do not match");
      return;
    }

    dispatch(changepassword(userData))
      .then(() => {
        setMessage("Password changed successfully");
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 2000); // Delay navigation to show success message
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setEmailError("User not found");
        } else if (error.response?.status === 400) {
          const errorMsg = error.response?.data?.message;
          if (errorMsg === "Invalid OTP") setOtpError(errorMsg);
          else if (errorMsg === "OTP has expired") setOtpError(errorMsg);
          else if (errorMsg === "New password must be at least 6 characters long") setPasswordError(errorMsg);
          else if (errorMsg === "New password and confirm password do not match") setConfirmPasswordError(errorMsg);
          else setEmailError("An unexpected error occurred");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-35 mb-5 p-8 rounded-xl shadow-lg w-full max-w-md">
        <p
          className={`mb-4 text-center ${message.includes("Logout") ? "text-red-600" : "text-green-700"}`}
        >
          {message}
        </p>
        {emailError && <p className="text-red-500 text-center mb-4">{emailError}</p>}
        {otpError && <p className="text-red-500 text-center mb-4">{otpError}</p>}
        {passwordError && <p className="text-red-500 text-center mb-4">{passwordError}</p>}
        {confirmPasswordError && <p className="text-red-500 text-center mb-4">{confirmPasswordError}</p>}

        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Foods Hub</h1>
        <h2 className="text-sm font-bold text-center text-gray-900 mb-6">
          Change Password
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
          </div>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={userData.otp}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the OTP*"
            />
          </div>
          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              placeholder="Enter your new password*"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 mt-6 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showNewPassword ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              placeholder="Confirm your password*"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 mt-6 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showConfirmPassword ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {status === STATUSES.LOADING ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;