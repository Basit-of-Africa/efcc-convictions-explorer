
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Sun, Moon } from "lucide-react";

const Navbar = ({ isDark, toggleTheme }) => {
  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors ${isDark ? "bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur-md border-slate-700/50" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              FraudCheckr
            </span>
          </Link>

          {/* Navigation Links */}
          <div className={`hidden md:flex items-center gap-8 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <Link to="/" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition font-medium`}>
              Home
            </Link>
            <Link to="/search?name=" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition font-medium`}>
              Search
            </Link>
            <Link to="/insights" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition font-medium`}>
              Insights
            </Link>
            <Link to="/about" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition font-medium`}>
              About
            </Link>
            <Link to="/docs" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition font-medium`}>
              Docs
            </Link>
          </div>

          {/* Right Side: Theme Toggle + Search Button */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Search Button */}
            <Link
              to="/search?name="
              className="hidden sm:inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
