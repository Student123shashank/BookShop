import React, { useEffect, useState } from "react";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import axios from "axios";

const Profile = () => {
  const [Profile, setProfile] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-user-information",
        { headers }
      );
      setProfile(response.data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 min-h-screen flex flex-col">
      {!Profile && (
        <div className="w-full h-[100%] flex items-center justify-center flex-grow">
          <Loader />
        </div>
      )}
      {Profile && (
        <div className="flex flex-col md:flex-row flex-grow">
          <div className="w-full md:w-1/6 bg-white dark:bg-zinc-800">
            <Sidebar data={Profile} />
          </div>
          <div className="w-full md:w-5/6 p-4 overflow-auto text-zinc-800 dark:text-white">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

