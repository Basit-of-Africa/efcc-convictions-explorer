
import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              EFCC Explorer
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/search?name="
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Search
            </Link>
            <Link
              to="/insights"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Insights
            </Link>
            <a
              href="#faq"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              About
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/search?name="
              className="hidden sm:inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              Search Records
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
