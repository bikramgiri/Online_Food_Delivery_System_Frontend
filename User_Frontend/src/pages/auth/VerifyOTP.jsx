import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyotp } from "../../store/authSlice";
import { STATUSES } from "../../global/statuses";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth); // Access error and message from state
  const [userData, setUserData] = useState({
    email: "",
    otp: "",
  });

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    if (name === "email") {
      setEmailError("");
    }
    if (name === "otp") {
      setOtpError("");
    }
  };

  // Validate email format like name@gmail.com where name can have letters, numbers, dots, hyphens, underscores but @gmail.com part is mandatory
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  }
    

  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|in)$/i; // Matches backend regex, valid email format like user@example.com
  //   return emailRegex.test(email);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError(""); // Clear email-specific errors
    setOtpError(""); // Clear OTP-specific errors

    if (!userData.email) {
      setEmailError("Email is required");
      setTimeout(() => {
        setEmailError("");
      }, 2000);
      return;
    }

    if (!validateEmail(userData.email)) {
      setEmailError("Invalid email format");
      setTimeout(() => {
        setEmailError("");
      }, 2000);
      return;
    }

    if (!userData.otp) {
      setOtpError("OTP is required");
      setTimeout(() => {
        setOtpError("");
      }, 2000);
      return;
    }

        // check opt must be 6 digit number
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(userData.otp)) {
      setOtpError("OTP must be a 6-digit number");
      setTimeout(() => {
        setOtpError("");
      }, 2000);
      return;
    }

    dispatch(verifyotp(userData))
      .then((response) => {
        if (response.status === 200) {
          setMessage("OTP verified successfully"); // Override with a consistent message
          setTimeout(() => {
            setMessage("");
            navigate("/changepassword");
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
        //   setEmailError(error.response?.data?.message || "Invalid email format");
        //   setOtpError(error.response?.data?.message || "Invalid OTP");
        // } else {
        //   setEmailError("An unexpected error occurred. Please try again.");
        //   setOtpError("An unexpected error occurred. Please try again.");
        // }
        // *OR
        const errorMsg = error.response?.data?.message;
          if (errorMsg === "Invalid OTP" || errorMsg === "OTP has expired") {
            setOtpError(errorMsg);
          } else {
            setEmailError(errorMsg || "Invalid email format");
          }
          setTimeout(() => {
            if (emailError) setEmailError("");
            if (otpError) setOtpError("");
            else {
              setEmailError("");
              setOtpError("");
            }
          }, 2000);
        } else {
          setEmailError("An unexpected error occurred. Please try again.");
          setOtpError("An unexpected error occurred. Please try again.");
          setTimeout(() => {
            if (emailError) setEmailError("");
            if (otpError) setOtpError("");
            else {
              setEmailError("");
              setOtpError("");
            }
          }, 2000);
        }
      });
  };

  return (
    <div className="mt-35 mb-10 flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-12 p-8 rounded-xl shadow-lg w-full max-w-md">
        {message && <p className="mb-4 text-center text-green-700">{message}</p>}
        {(emailError) && <p className="text-red-500 text-center mb-4">{emailError}</p>}
        {(otpError) && <p className="text-red-500 text-center mb-4">{otpError}</p>}

        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Foods Hub</h1>
        <h2 className="text-sm font-bold text-center text-gray-900 mb-6">
          Verify OTP
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
          <button
            type="submit"
            disabled={status === STATUSES.LOADING}
            className="cursor-pointer w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {status === STATUSES.LOADING ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;