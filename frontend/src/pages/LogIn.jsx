import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";
import Swal from 'sweetalert2';

const LogIn = () => {
  const [Values, setValues] = useState({
    username: "",
    password: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showSuccessMessage = () => {
    Swal.fire({
      title: 'Login Successful!',
      text: 'You have successfully logged in.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const submit = async () => {
    try {
      if (Values.username === "" || Values.password === "") {
        Swal.fire({
          title: 'Error!',
          text: 'All fields are required',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/sign-in",
          Values
        );

        dispatch(authActions.login());
        dispatch(authActions.changeRole(response.data.role));
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        
        // Show success message
        showSuccessMessage();
        
        navigate("/profile");
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white-900 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-12 py-8">
        <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full sm:w-3/6 lg:w-2/6">
          <p className="text-zinc-200 text-xl">Login</p>
          <div className="mt-4">
            <div>
              <label htmlFor="username" className="text-zinc-400">
                Username
              </label>
              <input
                type="text"
                className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
                placeholder="username"
                name="username"
                required
                value={Values.username}
                onChange={change}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="text-zinc-400">
                Password
              </label>
              <input
                type="password"
                className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
                placeholder="password"
                name="password"
                required
                value={Values.password}
                onChange={change}
              />
            </div>
            <div className="mt-4">
              <button
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
                onClick={submit}
              >
                Log In
              </button>
            </div>
            <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
              or
            </p>
            <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
              Don't have an account? &nbsp;
              <Link to="/signup" className="hover:text-blue-500">
                <u>Sign Up</u>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
