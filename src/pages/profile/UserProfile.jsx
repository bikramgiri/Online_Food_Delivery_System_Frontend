import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    timezone: 'Pacific Standard Time',
    // avatar: 'https://via.placeholder.com/150', // Default avatar
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1024 * 1024) { // 1MB max
      const reader = new FileReader();
      reader.onloadend = () => {
        // setAvatarPreview(reader.result);
        setUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('File size exceeds 1MB or no file selected.');
    }
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    // API call to save personal info
    console.log('Saving personal info:', user);
    alert('Personal information saved!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert('New passwords do not match.');
      return;
    }
    // API call to change password
    console.log('Changing password:', password);
    alert('Password changed successfully!');
  };

  const handleDeleteAccount = () => {
    // API call to delete account
    console.log('Deleting account');
    alert('Account deleted!');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-300 p-8">
      <div className="w-1/2 mt-25">
        {/* Personal Information Section */}
        <form onSubmit={handleSavePersonal} className="space-y-5">
          <h2 className=" text-xl font-semibold text-gray-200">Personal Information</h2>
          <p className="text-sm text-gray-400">Use a permanent address where you can receive mail.</p>
          <div className="flex flex-col items-center space-y-4">
            {/* <div className="relative">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-30 h-30 rounded-full object-cover border-2 border-gray-700"
              />
            </div> */}
            <label
              htmlFor="avatar"
              className="cursor-pointer bg-gray-800 text-gray-300 w-32 h-12 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 text-center"
            >
              Change avatar
              <input
                type="file"
                id="avatar"
                accept="image/jpeg, image/gif, image/png"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500">JPG, GIF or PNG, 1MB max.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">First name</label>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Last name</label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Email address</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Timezone</label>
            <select
              name="timezone"
              value={user.timezone}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Pacific Standard Time</option>
              <option>Eastern Standard Time</option>
              <option>Central Standard Time</option>
              {/* Add more timezones as needed */}
            </select>
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Save Change
          </button>
        </form>
      </div>

      <div className="w-[5%]"></div>

      {/* Change Password Section */}
      <div className="w-[45%]">
        <div className='mt-29'>
          {/* Make: MyOrders and My Carts two Box in row, in box My Order and My Cart name display at center */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/myorders">
            <div className="flex items-center justify-center h-25 bg-gray-800 border border-gray-700 rounded-md">
              <h2 className="text-lg font-semibold text-gray-300">My Orders</h2>
            </div>
            </Link>
            <Link to="/cart">
            <div className="flex items-center justify-center h-25 bg-gray-800 border border-gray-700 rounded-md">
              <h2 className="text-lg font-semibold text-gray-300">My Carts</h2>
            </div>
            </Link>
          </div>
        </div>
      <div>
      <form onSubmit={handleChangePassword} className="mt-10 space-x-10 space-y-5">
        <h2 className="text-xl font-semibold text-gray-200">Change Password</h2>
        <div>
          <label className="block text-sm font-medium text-gray-400">Current password</label>
          <input
            type="password"
            name="current"
            value={password.current}
            onChange={handlePasswordChange}
            className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">New password</label>
          <input
            type="password"
            name="new"
            value={password.new}
            onChange={handlePasswordChange}
            className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">Confirm new password</label>
          <input
            type="password"
            name="confirm"
            value={password.confirm}
            onChange={handlePasswordChange}
            className="mt-1 w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Change Password
        </button>
      </form>
      </div>

      <div className="w-[5%]"></div>

      {/* Delete Account Section */}
      <div className="mt-12 space-y-5">
        <h2 className="text-xl font-semibold text-gray-200">Delete Account</h2>
        <p className="text-sm text-gray-400">Permanently delete your account. This action cannot be undone.</p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className=" py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Delete Account
        </button>
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Are you sure?</h3>
              <p className="text-sm text-gray-400 mb-4">This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default UserProfile;