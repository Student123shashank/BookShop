import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Swal from 'sweetalert2';

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-favourite-books",
          { headers }
        );
        setFavouriteBooks(response.data.data);
      } catch (error) {
        console.error("Error fetching favourite books:", error);
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

  const handleRemoveBook = async (bookId) => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/remove-book-from-favourites",
        {},
        { headers: { ...headers, bookid: bookId } }
      );
      setFavouriteBooks((prevBooks) => 
        prevBooks.filter((book) => book._id !== bookId)
      );
      showSuccessMessage(response.data.message);
    } catch (error) {
      console.error("Error removing book from favourites:", error);
      showErrorMessage("Error removing book from favourites");
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {FavouriteBooks.length === 0 && (
        <div className="text-5xl font-semibold h-full text-zinc-900 dark:text-white flex items-center justify-center flex-col">
          No Favourite Books
          <img
            src="/CartEmpty.png"
            alt="Cart is Empty"
            className="h-[20vh] my-8"
          />
        </div>
      )}
      {FavouriteBooks.length > 0 && (
        <div className="max-h-[100vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FavouriteBooks.map((items, i) => (
              <div key={i}>
                <BookCard data={items} favourite={true} onRemove={handleRemoveBook} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;


