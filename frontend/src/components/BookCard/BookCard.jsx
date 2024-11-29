import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ data, favourite, onRemove }) => {
  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col hover:bg-yellow-500 transition duration-300">
      <Link to={`/view-book-details/${data._id}`} className="block">
        <div className="">
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img src={data.url} alt="/" className="h-[25vh]" />
          </div>
          <h2 className="mt-4 text-xl text-white font-semibold">{data.title}</h2>
          <p className="mt-2 text-white font-semibold">by {data.author}</p>
          <p className="mt-2 text-zinc-200 font-semibold text-xl">₹{data.price}</p>
        </div>
      </Link>
      {favourite && (
        <button
          className="bg-yellow-50 px-4 py-2 rounded border border-yellow-500 text-yellow-500 mt-4"
          onClick={() => onRemove(data._id)}
        >
          Remove from favourite
        </button>
      )}
    </div>
  );
};

export default BookCard;


