
import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center">
      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <p className="text-4xl font-bold text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
