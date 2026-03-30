
import React from "react";

const EmptyState = ({ message }) => {
  return (
    <div className="text-center py-12">
      <p className="text-xl text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default EmptyState;
