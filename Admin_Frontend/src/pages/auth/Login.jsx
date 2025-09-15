import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { STATUSES } from "../../global/statuses";
import { useForm } from "react-hook-form";
import { loginUser } from "../../store/authSlice";
// Google Icon
import { FcGoogle} from "react-icons/fc";
// Facebook Icon
import { FaFacebook} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");

  const handleLogin = (data) => {
    dispatch(loginUser(data));
  };

  const { register, handleSubmit, formState } = useForm();

  // // display Login success message if login status is 201 for 3 seconds then navigate to dashboard
  // React.useEffect(() => {
  //   if (loginUser() && status === STATUSES.SUCCESS) {
  //     setMessage("Login successful");
  //     setTimeout(() => {
  //       setMessage("");
  //       navigate("/");
  //     }, 2000);
  //   }
  // }, [status, navigate]);

  useEffect(() => {
    // Check login success
    if (status === STATUSES.SUCCESS) {
      setMessage("Login successful");
      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 2000);
    }

    // Check logout success from query parameter
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("logout") === "true") {
      setMessage("Logout successful");
      setTimeout(() => {
        setMessage("");
        navigate("/", { replace: true }); // Replace history to avoid back navigation
      }, 2000);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mt-5 mb-5 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          {/* Logo can be added here */}
        </div>
        {/* display both logout and login success message by checking wether message from logout or login triggered */}
        {/* {message &&  (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )} */}
            <div
            className={`mb-4 text-center ${message.includes("Logout") ? " text-red-600" : " text-green-700"}`}
          >
            {message}
          </div>
          
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Foods Hub</h1>
        <h2 className="text-sm font-bold text-center text-gray-900 mb-6">
          Login in with your email
        </h2>
        <form
          onSubmit={handleSubmit((data) => {
            handleLogin(data);
          })}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email*"
              {...register("email", { required: "Email is required" })}
            />
            <p className="text-red-500">{formState.errors.email?.message}</p>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password*"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <p className="text-red-500">{formState.errors.password?.message}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember Me
              </label>
            </div>
            <Link
              to="/forgotPassword"
              className="font-medium text-sm text-indigo-600"
            >
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
        </form>
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600">Or</p>
          <div className="mt-2 justify-center justify-items-center space-x-4 space-y-3">
            {/* <button className="flex items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50">
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.34-1.36-.34-2.09s.12-1.43.34-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm text-gray-700">Google</span>
            </button> */}
            <button className="cursor-pointer flex ml-4 items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50">
              <FcGoogle className="w-5 h-5 mr-2" />
              <span className="text-sm text-gray-700"> Sign In with Google</span>
            </button>
            <button className="cursor-pointer flex ml-4 items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50">
              <FaFacebook className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm text-gray-700"> Sign In with Facebook</span>
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
              <span className="text-sm text-gray-700">Sign In with GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
