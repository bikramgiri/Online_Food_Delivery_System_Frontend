import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { fetchUserProfile, logOut } from "../../store/authSlice";
import { fetchCartItems } from "../../store/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user } = useSelector((state) => state.auth);
  console.log("User in Navbar:", user); // Debug user data
  const { items } = useSelector((state) => state.cart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  const handleLogOut = () => {
    dispatch(logOut());
    // remove token from localStorage
    localStorage.removeItem("token");
    navigate("/login?logout=true");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token && !user){
      dispatch(fetchUserProfile());
    }
    if(user){
      dispatch(fetchCartItems());
    }
  }, [dispatch, user]);

  // handle notifications
  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);

    const dropdownRef = React.createRef();

    // hide dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  };

  const handleProductsClick = (e) => {
    e.preventDefault();
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auth check: token in localStorage OR user exists
  const isAuthenticated = localStorage.getItem("token") || user;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-yellow-700 text-white py-2">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="pl-130 text-center">Get free delivery on orders over $100</div>
          <div className="flex space-x-4">
            {/* check cookies for token */}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="cursor-pointer py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="cursor-pointer py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogOut}
                type="button"
                className="cursor-pointer py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-gray-200 dark:bg-gray-800">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8 me-3"
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Foods Hub
            </span>
          </Link>

          <div className=" flex items-center space-x-6 md:order-1">
            {/* Notifications Icon */}
            <div className="relative">
              <button
                type="button"
                onChange={markAllAsRead}
                className="cursor-pointer p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                onClick={() => navigate("/notifications")}
              >
                <span className="sr-only">Notifications</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </div>

            


            {/* Cart Icon with Badge */}
            {/* make: if items.length > 0 click badge else hide unclick */}
            <div className="relative">
              <div {...(items?.length > 0 ? { onClick: () => navigate("/cart") } : {})}>
                <button
                  type="button"
                  className="cursor-pointer"
                >
                  <span className="sr-only">Cart</span>
                  {/* <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 7h14l1 10H4L5 7zM5 7l-1-2M4 17a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z"
                    />
                  </svg> */}
                  <MdOutlineShoppingCart className="h-7 w-6 dark:text-white" />
                </button>
              </div>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {items?.length}
              </span>
            </div>

            {/* Hamburger Menu */}
            {/* <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button> */}

            {/* User Button with Dropdown */}
            <button
              type="button"
              onClick={toggleDropdown}
              className="cursor-pointer mb-2 flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 text-gray-300"
              id="user-menu-button"
              aria-expanded={isDropdownOpen}
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              {/* <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4zM12 6a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg> */}
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user?.avatar || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} // Placeholder avatar
                    alt="User avatar"
                  />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="mt-155 ml-13 absolute z-50 my-4 w-64 text-base list-none bg-gray-800 divide-y divide-gray-700 rounded-lg shadow-lg dark:divide-gray-600"
                id="user-dropdown"
              >
                {/* User Info */}
                <div className="px-4 py-3 flex items-center space-x-3 bg-gray-900 rounded-t-lg">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user?.avatar || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} // Placeholder avatar
                    alt="User avatar"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-white">{user?.username  || "Jese Leos"}</span>
                    <span className="block text-xs text-gray-400 truncate">{user?.email || "jese@flowbite.com"}</span>
                  </div>

                  {/* cross icon to close */}
                  <button onClick={() => setIsDropdownOpen(false)} className="text-gray-400 hover:text-white">
                    <svg className="ml-10 w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Icons Row */}
                <div className="grid grid-cols-3 gap-2 p-4 bg-gray-800">
                  {/* <Link to="/profile" className="flex flex-col items-center p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-white mt-1">Profile</span>
                  </Link> */}
                  <Link to="/gifts" className="flex flex-col items-center p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                    <span className="text-xs text-white mt-1">Gifts</span>
                  </Link>
                  <Link to="/wallet" className="flex flex-col items-center p-2 bg-teal-600 rounded-md hover:bg-teal-700 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs text-white mt-1">Wallet</span>
                  </Link>
                </div>

                {/* Menu Items */}
                <ul className="py-2 space-y-2">
                  <li>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:text-white transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                      Your Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/myorders" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:text-white transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      My orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/myreviews" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:text-white transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.978 2.89a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.89a1 1 0 00-1.176 0l-3.976 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.978-2.89c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      My Reviews
                    </Link>
                  </li>
                  <li>
                    <Link to="/deliveryaddresses" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:text-white transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Delivery addresses
                    </Link>
                  </li>
                  <li>
                    <Link to="/recentlyviewed" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:text-white transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Recently viewed
                    </Link>
                  </li>
                  <li>
                    <Link to="/favouriteitems" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:text-white transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Favourite items
                    </Link>
                  </li>
                </ul>

                {/* Settings */}
                <ul className="py-2 border-t border-gray-700">
                  <li>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:text-white transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                  </li>
                </ul>

                {/* Log Out */}
                <ul className="py-2 border-t border-gray-700">
                  <li>
                    <button
                      onClick={handleLogOut}
                      className="cursor-pointer flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-900 dark:hover:text-white transition-colors w-full text-left"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
            
          </div>


          <div
            className="ml-30"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-800 dark:border-gray-700">
              <li>
                <Link
                  to="/"
                  className="block font-bold py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Home
                </Link>
              </li>
              {/* Make: when i click Products then it move to product section of Home page through smooth scrolling using id of products */}
              <li>
                <a
                  href="#products"
                  onClick={handleProductsClick}
                  className="block font-bold py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Products
                </a>
              </li>
              <li>
                <Link
                  to="/myorders"
                  className="block font-bold py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  My Orders
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/profile"
                  className="block font-bold py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Profile
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Search Input with SVG */}
            <div className="relative">
              <input
                type="text"
                className="ml-29 p-3 pl-40 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200"
                placeholder="Search..."
              />
              <svg
                className="w-5 h-5 absolute left-63 top-1/2 transform -translate-y-1/2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;