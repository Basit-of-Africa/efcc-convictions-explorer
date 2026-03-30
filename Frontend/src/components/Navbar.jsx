
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl w-full max-w-6xl mx-auto mt-4">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          FraudCheckr
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/insights"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            Insights
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
