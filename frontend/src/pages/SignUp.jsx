import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const SignUp = () => {
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const navigate = useNavigate();

  const showSuccessMessage = () => {
    Swal.fire({
      title: 'Signup Successful!',
      text: 'You have successfully signed up.',
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

  const submit = async () => {
    try {
      if (
        Values.username === "" ||
        Values.email === "" ||
        Values.password === "" ||
        Values.address === ""
      ) {
        showErrorMessage("All fields are required");
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/sign-up",
          Values
        );
        console.log(response.data.message);

        // Show success message
        showSuccessMessage();

        navigate("/login"); 
      }
    } catch (error) {
      showErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-white-900 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-12 py-8">
        <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full sm:w-3/6 lg:w-2/6">
          <p className="text-zinc-200 text-xl">Sign Up</p>
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
              <label htmlFor="email" className="text-zinc-400">
                Email
              </label>
              <input
                type="text"
                className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
                placeholder="xyz@gmail.com"
                name="email"
                required
                value={Values.email}
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
              <label htmlFor="address" className="text-zinc-400">
                Address
              </label>
              <textarea
                rows="5"
                className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
                placeholder="address"
                name="address"
                required
                value={Values.address}
                onChange={change}
              />
            </div>
            <div className="mt-4">
              <button 
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300" 
                onClick={submit}
              >
                Sign Up
              </button>
            </div>
            <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
              or
            </p>
            <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
              Already have an account &nbsp;
              <Link to="/login" className="hover:text-blue-500">
                <u>Log In</u>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;




