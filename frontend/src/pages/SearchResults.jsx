import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard"; 

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`http://localhost:1000/api/v1/search?query=${query}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setBooks(data.books || []);
        if (data.books.length === 0) {
          setError("No books found.");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("No books found.");
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchBooks();
  }, [query]);

  const handleSort = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedBooks = [...books];
    if (option === "low-to-high") {
      sortedBooks = sortedBooks.sort((a, b) => a.price - b.price);
    } else if (option === "high-to-low") {
      sortedBooks = sortedBooks.sort((a, b) => b.price - a.price);
    }

    setBooks(sortedBooks);
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex-grow flex flex-col items-center justify-center bg-zinc-900 text-white min-h-screen">
      <p className="text-2xl font-bold" style={{ marginTop: '18rem' }}>
        {error}
      </p>
      <img
        src="/CartEmpty.png"
        alt="No books found"
        className="h-[20vh] mt-4"
        style={{ marginTop: '9rem', marginBottom: '10rem' }}
      />
    </div>
  );

  return (
    <div className="flex flex-col bg-white-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4 p-4">
        <h1 className="text-2xl font-bold">
          Search Results for "{query}"
        </h1>
        <select
          value={sortOption}
          onChange={handleSort}
          className="p-2 border border-zinc-900 rounded bg-zinc-600 text-white transition-all hover:bg-yellow-500"
        >
          <option value="default">Sort by</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>
      <div className="flex-grow p-4">
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard key={book._id} data={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-xl">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

