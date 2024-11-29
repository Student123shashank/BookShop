import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const AddReview = () => {
  const { bookId } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const showSuccessMessage = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Review submitted successfully',
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:1000/api/v1/add-review", { bookId, rating, review }, { headers });
      console.log(response.data);
      showSuccessMessage();
      navigate(`/view-book-details/${bookId}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      showErrorMessage("Error submitting review");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-zinc-900">
      <form onSubmit={handleSubmit} className="bg-zinc-700 p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-white">Add a Review</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-white" htmlFor="rating">Rating:</label>
          <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full border border-zinc-600 dark:border-zinc-600 rounded px-3 py-2 bg-zinc-700 text-white">
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map(star => (
              <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-white" htmlFor="review">Review:</label>
          <textarea id="review" value={review} onChange={(e) => setReview(e.target.value)} className="w-full border border-zinc-600 dark:border-zinc-600 rounded px-3 py-2 bg-zinc-700 text-white" rows="4" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-yellow-500">Submit</button>
      </form>
    </div>
  );
};

export default AddReview;

