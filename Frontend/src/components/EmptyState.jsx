
import React from "react";
import { Search } from "lucide-react";

const EmptyState = ({ message, isDark }) => {
  return (
    <div className="text-center py-16">
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${isDark ? "bg-slate-800" : "bg-gray-200"}`}>
        <Search className={`w-10 h-10 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
      </div>
      <p className={`text-xl font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{message}</p>
      <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
        Try adjusting your search terms or browse all records
      </p>
    </div>
  );
};

export default EmptyState;
