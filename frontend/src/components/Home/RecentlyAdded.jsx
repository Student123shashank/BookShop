import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard"; 
import Loader from "../Loader/Loader";

const RecentlyAdded = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true); 
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-recent-books");
        if (response.data.status === "Success") {
          setData(response.data.data);
        } else {
          console.error("Failed to fetch recent books");
        }
      } catch (error) {
        console.error("Error fetching recent books:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-400">Recently Added Books</h4>
      {loading ? ( 
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
          {data.map((item, i) => (
            <div key={i} className="flex flex-col h-full"> 
              <BookCard data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;
