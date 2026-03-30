
import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-2 bg-gray-900 rounded-full"></div>
      </div>
      <p className="text-gray-400 mt-6 font-medium">Loading records...</p>
    </div>
  );
};

export default Loader;
