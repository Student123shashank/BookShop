import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaMoon, FaSun } from "react-icons/fa"; 
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    links.splice(2, 2);
  }

  const [mobileNav, setMobileNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <nav className="z-50 relative flex bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4 md:px-8 py-4 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-6 md:h-8 lg:h-10 me-2 md:me-4"
            src="https://cdn-icons-png.flaticon.com/128/3145/3145765.png"
            alt="logo"
          />
          <h1 className="text-base md:text-lg lg:text-2xl font-semibold">BookShop</h1>
        </Link>

        <div className="flex-grow flex justify-center items-center relative">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="w-48 md:w-72 lg:w-96 px-2 md:px-4 py-1 md:py-2 rounded-l-full bg-white text-black border-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
            />
            <button
              className="px-4 py-1 md:py-2 bg-zinc-800 text-white rounded-r-full hover:bg-yellow-500 transition-all"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        <div className="hidden md:flex gap-2 lg:gap-4 items-center ml-auto">
          {links.map((items, i) => (
            <Link
              key={i}
              to={items.link}
              className="text-sm lg:text-base px-2 py-1 hover:bg-yellow-400 rounded transition-all duration-300"
            >
              {items.title}
            </Link>
          ))}
          <button
            className="text-sm lg:text-base px-2 py-1 bg-gray-700 rounded hover:bg-yellow-400 transition-all duration-300"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun className="text-white" /> : <FaMoon className="text-white" />}
          </button>
          {!isLoggedIn && (
            <div className="flex gap-2 lg:gap-4 items-center">
              <Link
                to="/LogIn"
                className="px-2 lg:px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                Log In
              </Link>
              <Link
                to="/SignUp"
                className="px-2 lg:px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="block md:hidden text-white text-2xl hover:text-zinc-400"
          onClick={() => setMobileNav(!mobileNav)}
        >
          <FaBars />
        </button>
      </nav>

      {mobileNav && (
        <div className="fixed inset-0 bg-gradient-to-b from-blue-800 via-purple-700 to-pink-600 h-screen w-screen z-40 flex flex-col items-center justify-center">
          {links.map((items, i) => (
            <Link
              to={items.link}
              className="text-white text-2xl md:text-3xl lg:text-4xl mb-8 font-semibold hover:text-blue-300"
              key={i}
              onClick={() => setMobileNav(false)}
            >
              {items.title}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <Link
                to="/LogIn"
                className="px-8 mb-8 text-2xl md:text-3xl font-semibold py-2 border border-blue-500"
                onClick={() => setMobileNav(false)}
              >
                Log In
              </Link>
              <Link
                to="/SignUp"
                className="px-8 mb-8 text-2xl md:text-3xl font-semibold py-2 bg-blue-500 rounded"
                onClick={() => setMobileNav(false)}
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            className="text-white text-2xl mb-8"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
