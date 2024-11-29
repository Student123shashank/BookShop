import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const BuyBooks = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:1000/api/v1/get-user-cart', {
          headers,
        });
        setCart(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      let total = 0;
      cart.forEach((item) => {
        total += item.price;
      });
      setTotal(total);
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

  const handlePayment = async (e) => {
    e.preventDefault();

    const orderData = {
      order: cart,
      paymentMethod: paymentMethod,
      address: address,
      name: name,
      email: email,
    };

    if (paymentMethod === 'cod') {
      try {
        await axios.post('http://localhost:1000/api/v1/place-order', orderData, { headers });
        showSuccessMessage('Your order is successful!');
        navigate('/profile/orderhistory');
      } catch (error) {
        console.error('Error placing order:', error);
        showErrorMessage('Error placing order: ' + error.response.data.message);
      }
    } else if (paymentMethod === 'upi') {
      const options = {
        key: 'rzp_test_yUub2bdFAKhXLh',
        amount: total * 100,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo.png',
        handler: async function (response) {
          showSuccessMessage('Payment ID: ' + response.razorpay_payment_id);
          try {
            await axios.post('http://localhost:1000/api/v1/place-order', orderData, { headers });
            navigate('/profile/orderhistory');
          } catch (error) {
            console.error('Error placing order:', error);
            showErrorMessage('Error placing order: ' + error.response.data.message);
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: '',
        },
        notes: {
          address: address,
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-900 px-4">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md sm:max-w-sm">
        <h1 className="text-2xl text-white font-semibold mb-4">Buy Books</h1>
        <form onSubmit={handlePayment}>
          <div className="mb-3">
            <label className="text-sm text-white mb-1 block">Name:</label>
            <input
              className="w-full p-2 text-sm text-white bg-zinc-800 dark:bg-zinc-700 border border-zinc-700 dark:border-zinc-600 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-3">
            <label className="text-sm text-white mb-1 block">Email:</label>
            <input
              className="w-full p-2 text-sm text-white bg-zinc-800 dark:bg-zinc-700 border border-zinc-700 dark:border-zinc-600 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label className="text-sm text-white mb-1 block">Address:</label>
            <textarea
              className="w-full p-2 text-sm text-white bg-zinc-800 dark:bg-zinc-700 border border-zinc-700 dark:border-zinc-600 rounded-lg"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Enter your address"
            />
          </div>
          <div className="mb-3">
            <label className="text-sm text-white mb-1 block">Payment Method:</label>
            <select
              className="w-full p-2 text-sm text-white bg-zinc-800 dark:bg-zinc-700 border border-zinc-700 dark:border-zinc-600 rounded-lg"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="cod">Cash on Delivery</option>
              <option value="upi">Online Payment</option>
            </select>
          </div>
          <div className="mb-3">
            <h2 className="text-sm text-white">Total Amount: ₹{total}</h2>
          </div>
          <button
            className="bg-yellow-400 text-zinc-900 dark:bg-yellow-400 dark:text-zinc-900 font-medium rounded-lg p-2 text-sm w-full transition-colors duration-300 hover:bg-green-500 dark:hover:bg-green-500 focus:ring focus:ring-green-300 active:bg-green-600 dark:active:bg-green-600"
            type="submit"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyBooks;



