import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import Swal from 'sweetalert2';

const Settings = () => {
  const [value, setValue] = useState({
    address: "",
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [profileData, setProfileData] = useState(null);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    setValue({ ...value, [name]: inputValue });
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );
        setProfileData(response.data);
        setValue({
          address: response.data.address,
          username: response.data.username,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetch();
  }, []);

  const showSuccessMessage = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const showErrorMessage = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };

  const submitAddress = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-address",
        { address: value.address },
        { headers }
      );
      showSuccessMessage(response.data.message);
    } catch (error) {
      console.error("Error updating address:", error);
      showErrorMessage("Error updating address");
    }
  };

  const submitUsername = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-username",
        { username: value.username },
        { headers }
      );
      showSuccessMessage(response.data.message);
    } catch (error) {
      console.error("Error updating username:", error);
      showErrorMessage("Error updating username");
    }
  };

  const submitEmail = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-email",
        { email: value.email },
        { headers }
      );
      showSuccessMessage(response.data.message);
    } catch (error) {
      console.error("Error updating email:", error);
      showErrorMessage("Error updating email");
    }
  };

  const submitPassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-password",
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        },
        { headers }
      );
      showSuccessMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        showErrorMessage(error.response.data.message);
      } else {
        console.error("Error updating password:", error);
        showErrorMessage("Error updating password");
      }
    }
  };

  if (!profileData) {
    return (
      <div className="w-full h-[100%] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-[100%] p-0 md:p-4 text-zinc-900 dark:text-white">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-700 dark:text-yellow-700 mb-8">
        Settings
      </h1>
      {/* Username Section */}
      <div className="flex flex-col mb-6">
        <label htmlFor="username" className="text-yellow-700 mb-2">Username</label>
        <input
          type="text"
          className="p-2 rounded bg-zinc-700 dark:bg-zinc-800 mb-2 font-semibold text-yellow-700 border-zinc-700 focus:outline-none"
          placeholder="Username"
          name="username"
          value={value.username}
          onChange={handleChange}
        />
        <button
          className="bg-green-500 text-zinc-900 dark:text-zinc-900 font-semibold px-4 py-2 rounded hover:bg-green-400 transition-all duration-300"
          onClick={submitUsername}
        >
          Update Username
        </button>
      </div>
      {/* Email Section */}
      <div className="flex flex-col mb-6">
        <label htmlFor="email" className="text-yellow-700 mb-2">Email</label>
        <input
          type="email"
          className="p-2 rounded bg-zinc-700 dark:bg-zinc-800 mb-2 font-semibold text-yellow-700 border-zinc-700 focus:outline-none"
          placeholder="Email"
          name="email"
          value={value.email}
          onChange={handleChange}
        />
        <button
          className="bg-green-500 text-zinc-900 dark:text-zinc-900 font-semibold px-4 py-2 rounded hover:bg-green-400 transition-all duration-300"
          onClick={submitEmail}
        >
          Update Email
        </button>
      </div>
      {/* Address Section */}
      <div className="flex flex-col mb-6">
        <label htmlFor="address" className="text-yellow-700 mb-2">Address</label>
        <textarea
          className="p-2 rounded bg-zinc-700 dark:bg-zinc-800 mb-2 font-semibold text-yellow-700 border-zinc-700 focus:outline-none"
          rows="5"
          placeholder="Address"
          name="address"
          value={value.address}
          onChange={handleChange}
        />
        <button
          className="bg-green-500 text-zinc-900 dark:text-zinc-900 font-semibold px-4 py-2 rounded hover:bg-green-400 transition-all duration-300"
          onClick={submitAddress}
        >
          Update Address
        </button>
      </div>
      {/* Password Section */}
      <div className="flex flex-col mb-6">
        <label htmlFor="currentPassword" className="text-yellow-700 mb-2">
          Current Password
        </label>
        <input
          type="password"
          className="p-2 rounded bg-zinc-700 dark:bg-zinc-800 mb-2 font-semibold text-yellow-700 border-zinc-700 focus:outline-none"
          placeholder="Current Password"
          name="currentPassword"
          value={value.currentPassword}
          onChange={handleChange}
        />
        <label htmlFor="newPassword" className="text-yellow-700 mb-2 mt-4">
          New Password
        </label>
        <input
          type="password"
          className="p-2 rounded bg-zinc-700 dark:bg-zinc-800 mb-2 font-semibold text-yellow-700 border-zinc-700 focus:outline-none"
          placeholder="New Password"
          name="newPassword"
          value={value.newPassword}
          onChange={handleChange}
        />
        <button
          className="bg-green-500 text-zinc-900 dark:text-zinc-900 font-semibold px-4 py-2 rounded hover:bg-green-400 transition-all duration-300"
          onClick={submitPassword}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Settings;


