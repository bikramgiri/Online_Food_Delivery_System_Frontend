import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../store/authSlice';
import { STATUSES } from '../../global/statuses';

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {status} = useSelector((state) => state.auth)
  console.log(status)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '', 
  })

  const [phoneError, setPhoneError] = useState(''); // For phone validation error
  const [registerError, setRegisterError] = useState(''); // For general registration error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    })
    if (name === 'phoneNumber') {
      setPhoneError(''); // Clear error on change
    }
  }

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone); // Exactly 10 digits
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setRegisterError(''); // Clear previous errors
    if (!validatePhone(userData.phoneNumber)) {
      setPhoneError('Invalid phone number format. It should be exactly 10 digits.');
      return;
    }
    dispatch(registerUser(userData));
    if (status === STATUSES.SUCCESS) {
      return navigate('/login');
    }
    if (status === STATUSES.ERROR) {
      setRegisterError('Registration failed. Please try again.');
      return;
    }
  };

  // useEffect(() => {
  //   if (status === STATUSES.SUCCESS) {
  //     navigate('/login');
  //   } else if (status === STATUSES.ERROR) {
  //     setRegisterError('Registration failed. Please try again.');
  //   }
  // }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          {/* <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg> */}
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Sign up your account</h2>
        {registerError && <p className="text-red-500 text-center mb-4">{registerError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name='username'
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              id="email"
              name='email'
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone number</label>
            <input
              type="tel"
              id="phoneNumber"
              name='phoneNumber'
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="9800000000"
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name='password'
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-8 w-8 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">By creating and/or using your account, you agree to our  <a href="#" className="text-sm text-indigo-600 hover:underline">Terms & Conditions</a>  and <a href="#" className="text-sm text-indigo-600 hover:underline">Privacy Policy</a>.</label>
            </div>
          </div>
          <button
            type="submit"
            disabled={status === STATUSES.LOADING} // Disable during loading
            className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {status === STATUSES.LOADING ? 'Signing up...' : 'Sign up'}
          </button>
         <p className="text-sm ml-25 text-gray-600">Already have an account?  <Link to="/login" className="text-sm text-indigo-600 hover:underline">Login here</Link></p>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Or sign up with</p>
          <div className="mt-2 flex justify-center space-x-4">
            <button className="flex items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.34-1.36-.34-2.09s.12-1.43.34-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm text-gray-700">Google</span>
            </button>
            <button className="flex items-center bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.475 2 2 6.475 2 12c0 4.425 2.865 8.175 6.839 9.495.5.09.682-.218.682-.484 0-.237-.009-.866-.014-1.7-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.621.069-.609.069-.609 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.097-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.525-4.475-10-10-10z"/>
              </svg>
              <span className="text-sm text-gray-700">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;