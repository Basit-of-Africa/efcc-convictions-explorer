
import React from "react";
import { Search } from "lucide-react";

const EmptyState = ({ message }) => {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-full mb-6">
        <Search className="w-10 h-10 text-gray-500" />
      </div>
      <p className="text-xl text-gray-400 font-medium">{message}</p>
      <p className="text-sm text-gray-500 mt-2">
        Try adjusting your search terms or browse all records
      </p>
    </div>
  );
};

export default EmptyState;
