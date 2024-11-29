import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import { AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/v1/get-user-cart', { headers });
        setCart(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);
      setTotal(totalAmount);
    }
  }, [cart]);

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

  const deleteItem = async (bookId) => {
    try {
      const response = await axios.put(`http://localhost:1000/api/v1/remove-from-cart/${bookId}`, {}, { headers });
      showSuccessMessage(response.data.message);
      const fetchUpdatedCart = async () => {
        try {
          const response = await axios.get('http://localhost:1000/api/v1/get-user-cart', { headers });
          setCart(response.data.data);
        } catch (error) {
          console.error(error);
          showErrorMessage(error.response.data.message);
        }
      };
      fetchUpdatedCart();
    } catch (error) {
      console.error(error);
      showErrorMessage(error.response.data.message);
    }
  };

  const proceedToPayment = () => {
    navigate('/buy-books');
  };

  return (
    <div className="bg-white dark:bg-zinc-900 px-12 h-screen py-8 flex flex-col justify-between">
      {cart.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-900 dark:text-zinc-100">Empty Cart</h1>
            <img src="/CartEmpty.png" alt="Empty Cart" className="lg:h-[50vh]" />
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-semibold text-zinc-900 dark:text-yellow-400 mb-8">Your Cart</h1>
          <div className="flex-1 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item._id}
                className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 dark:bg-zinc-700 justify-between items-center hover:bg-yellow-500 dark:hover:bg-yellow-500 transition duration-200"
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="h-[20vh] md:h-[10vh] object-cover cursor-pointer" 
                  onClick={() => navigate(`/view-book-details/${item._id}`)} 
                />
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left px-4">
                  <h1 className="text-2xl text-zinc-100 dark:text-zinc-200 font-semibold">{item.title}</h1>
                  <p className="text-sm text-white mt-2 hidden lg:block">{item.desc.slice(0, 100)}...</p>
                  <p className="text-sm text-white mt-2 hidden md:block lg:hidden">{item.desc.slice(0, 65)}...</p>
                  <p className="text-sm text-white mt-2 block md:hidden">{item.desc.slice(0, 40)}...</p>
                </div>
              
                <div className="flex flex-col items-center md:items-end mt-4 md:mt-0 w-full md:w-auto">
                  <h2 className="text-zinc-100 dark:text-zinc-200 text-3xl font-semibold">₹{item.price}</h2>
                  <button
                    className="bg-red-100 dark:bg-red-500 text-red-700 dark:text-red-100 border border-red-700 dark:border-red-500 rounded p-2 ml-2"
                    onClick={() => deleteItem(item._id)}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 w-full flex items-center justify-end">
            <div className="p-4 bg-zinc-800 dark:bg-zinc-700 rounded">
              <h1 className="text-3xl text-zinc-200 dark:text-zinc-300 font-semibold">Total Amount</h1>
              <div className="mt-3 flex items-center justify-between text-xl text-zinc-200 dark:text-zinc-300">
                <h2>{cart.length} books</h2>
                <h2>₹{total}</h2>
              </div>
              <button
                className="bg-zinc-100 dark:bg-zinc-600 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-500 mt-3"
                onClick={proceedToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
