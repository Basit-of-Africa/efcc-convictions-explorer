
import React from "react";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
          Check EFCC Conviction Records
        </h1>
        <p className="text-xl text-gray-500 mb-12">
          Search publicly available fraud convictions
        </p>
        <SearchBar />
        <div className="mt-24 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Verification</h3>
            <p className="text-gray-600">
              Quickly verify if a name appears in the EFCC conviction records.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Case Details</h3>
            <p className="text-gray-600">
              View structured and easy-to-read details of each conviction.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Insights</h3>
            <p className="text-gray-600">
              Explore statistics and trends from the conviction data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
