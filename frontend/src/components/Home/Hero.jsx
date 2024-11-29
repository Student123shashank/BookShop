import React from "react";
import {Link} from "react-router-dom";

const Hero = () => {
  return (
    <div className="h-[79vh] flex flex-col md:flex-row items-center justify-center">
       <div className="w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-center lg:items-start justify-center">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-500 text-center lg:text-left">
          Embark on a Literary Adventure
        </h1>
        <p className="mt-4 text-xl text-yellow-400 text-center lg:text-left">
          Unlock the wisdom of ages, dive into thrilling tales, and let your imagination soar with every page.
        </p>
        <div className="mt-8">
          <Link to= "/all-books"
          className="text-yellow-400 text-xl lg:text-2xl font-semibold border border-yellow-600 px-10 py-2 hover:bg-yellow-900 rounded-full">
            Discover Books
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center">
        <img src="./Hero.png" alt="hero"/>
      </div>
    </div>
  );
};

export default Hero;


