
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

const SearchBar = ({ initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?name=${query.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative flex items-center bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-full shadow-lg focus-within:border-blue-500 focus-within:shadow-xl focus-within:shadow-blue-500/30 transition-all">
          <div className="pl-6 text-gray-500">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by defendant name..."
            className="w-full px-4 py-4 text-lg text-white bg-transparent placeholder-gray-500 focus:outline-none"
          />
          
          <button
            type="submit"
            disabled={!query.trim()}
            className="mr-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/50 focus:outline-none transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            Search
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-center text-gray-500 text-sm mt-4">
        Search 864 verified EFCC conviction records
      </p>
    </form>
  );
};

export default SearchBar;
