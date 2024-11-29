import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-order-history", { headers });
        setOrderHistory(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order history:", error);
        setLoading(false);
      }
    };
    fetchOrderHistory();
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

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:1000/api/v1/update-status/${orderId}`, { status: "Canceled" }, { headers });
      setOrderHistory((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Canceled" } : order
        )
      );
      showSuccessMessage(response.data.message);
    } catch (error) {
      console.error("Error canceling order:", error);
      showErrorMessage("Error canceling order");
    }
  };

  const handleReview = (bookId) => {
    navigate(`/profile/add-review/${bookId}`);
  };

  const handleViewBookDetails = (bookId) => {
    navigate(`/view-book-details/${bookId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100%]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white flex flex-col">
      {OrderHistory.length === 0 ? (
        <div className="text-5xl font-semibold h-full text-zinc-900 dark:text-white flex items-center justify-center flex-col">
          <h1 className="text-5xl font-semibold mt-40 mb-0">No Order History</h1>
          <img src="/CartEmpty.png" alt="empty order history" className="h-[20vh] my-8" style={{ marginTop: "5rem" }} />
        </div>
      ) : (
        <div className="overflow-auto max-h-[100vh]"> 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OrderHistory.map((item) => (
              <div key={item._id} className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 flex flex-col gap-4">
                
                <img
                  src={item.book.url || "/placeholder-book.png"} 
                  alt={item.book.title}
                  className="w-full h-48 object-cover rounded-md cursor-pointer" 
                  onClick={() => handleViewBookDetails(item.book._id)} 
                />

               
                <div>
                  <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">{item.book.title}</h1>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.book.desc.slice(0, 100)}...</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">Author: {item.book.author || "Unknown"}</p>
                  <p className="text-lg font-bold text-yellow-500">₹{item.book.price}</p>
                </div>

               
                <div className="flex justify-between items-center">
                  {item.status === "Order Placed" ? (
                    <button
                      onClick={() => handleCancelOrder(item._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-red-500 font-semibold">Canceled</span>
                  )}
                  <button
                    onClick={() => handleReview(item.book._id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
