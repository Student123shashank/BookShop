import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import Swal from 'sweetalert2';

const Sidebar = ({ data }) => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(data.avatar);

  const showLogoutMessage = () => {
    Swal.fire({
      title: 'Logged Out',
      text: 'You have logged out successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    showLogoutMessage();
    navigate("/");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await fetch("http://localhost:1000/api/v1/upload-avatar", {
          method: "POST",
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          setAvatar(result.avatarUrl); 
        } else {
          alert(result.message || "Failed to upload avatar.");
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  return (
    <div className="bg-zinc-800 p-4 rounded flex flex-col items-center justify-between h-[100%] mb-6">
      <div className="flex items-center flex-col justify-center">
        <div className="relative">
          <img
            src={avatar}
            className="h-[10vh] cursor-pointer"
            alt="User Avatar"
            onClick={() => document.getElementById("avatarInput").click()}
          />
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <p className="mt-3 text-lg text-zinc-100 font-semibold">
          {data.username}
        </p>
        <p className="mt-1 text-normal text-zinc-300">{data.email}</p>
        <div className="w-full mt-4 h-[1px] bg-zinc-500"></div>
      </div>

      <div className="w-full flex flex-col items-center justify-start mt-4 space-y-4">
        <Link
          to="/profile"
          className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
        >
          Favourites
        </Link>
        <Link
          to="/profile/orderHistory"
          className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
        >
          Order History
        </Link>
        <Link
          to="/profile/settings"
          className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
        >
          Settings
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-zinc-900 w-full mt-4 text-white font-semibold flex items-center justify-center py-2 rounded hover:bg-white hover:text-zinc-900 transition-all duration-300"
      >
        Log Out
        <FaSignOutAlt className="ms-4" />
      </button>
    </div>
  );
};

export default Sidebar;



