import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';

const ViewBookDetails = () => {
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const response = await axios.get(`http://localhost:1000/api/v1/get-book-by-id/${id}`);
      setData(response.data.data);
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/v1/get-reviews/${id}`);
        console.log(response.data.reviews); 
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchBookDetails();
    fetchReviews();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  const showSuccessMessage = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const handleFavourite = async () => {
    try {
      const response = await axios.put("http://localhost:1000/api/v1/add-book-to-favourites", {}, { headers });
      showSuccessMessage(response.data.message);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put("http://localhost:1000/api/v1/add-to-cart", {}, { headers });
      showSuccessMessage(response.data.message);
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
    <>
      {Data && (
        <div className="px-4 md:px-12 py-8 bg-white dark:bg-zinc-900 flex flex-col md:flex-row gap-8">
          <div className="bg-zinc-800 dark:bg-zinc-800 rounded px-4 py-12 h-[60vh] lg:h-[88vh] w-full lg:w-3/6 flex flex-col items-center justify-around">
            <img src={Data.url} alt={Data.title} className="h-[35vh] lg:h-[40vh] rounded" />
            {isLoggedIn === true && role === "user" && (
              <div className="mt-4 w-full flex justify-center gap-4">
                <button
                  className="bg-white dark:bg-zinc-700 rounded-full text-3xl p-2 text-red-500 hover:bg-yellow-400 dark:hover:bg-yellow-500 transition-all duration-300"
                  onClick={handleFavourite}
                >
                  <FaHeart />
                </button>
                <button
                  className="bg-white dark:bg-zinc-700 rounded-full text-3xl p-2 text-blue-500 hover:bg-yellow-400 dark:hover:bg-yellow-500 transition-all duration-300"
                  onClick={handleCart}
                >
                  <FaShoppingCart />
                </button>
              </div>
            )}
          </div>
          <div className="p-4 w-full lg:w-3/6">
            <h1 className="text-4xl text-zinc-800 dark:text-white font-semibold">{Data.title}</h1>
            <p className="text-zinc-800 dark:text-gray-300 mt-1">by {Data.author}</p>
            <p className="text-black dark:text-white mt-4 text-xl">{Data.desc}</p>
            <p className="flex mt-4 items-center justify-start text-zinc-800 dark:text-gray-300">
              <GrLanguage className="me-3" /> {Data.language}
            </p>
            <p className="mt-4 text-zinc-800 dark:text-gray-300 text-3xl font-semibold">
              Price: ₹{Data.price}
            </p>
          </div>
        </div>
      )}
      {!Data && (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <Loader />
        </div>
      )}
      {reviews.length > 0 && (
        <div className="mt-8 bg-white dark:bg-zinc-900 p-4 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-700 dark:text-white">Reviews</h2>
          {reviews.map((review) => (
            <div key={review._id} className="mb-4 pb-4 flex items-start gap-4"> 
              <img src={review.userImage ||  'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'} 
              alt={review.username} className="h-10 w-10 rounded-full" /> 
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.username} rated it {review.rating} stars</p>
                <p className="text-lg text-gray-800 dark:text-white">{review.review}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;



