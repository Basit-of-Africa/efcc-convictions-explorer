import React from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

export default function DataTable({
  convictions,
  loading,
  pagination,
  onNextPage,
  onPrevPage,
  onFilterByOffense,
  onFilterByCourt,
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  if (!convictions || convictions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-lg">No records found</p>
      </div>
    );
  }

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const showingFrom = pagination.offset + 1;
  const showingTo = Math.min(pagination.offset + pagination.limit, pagination.total);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Offense
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Prison Term
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Court
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {convictions.map((conviction, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{conviction.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => onFilterByOffense(conviction.offense)}
                    className="text-secondary hover:underline"
                  >
                    {conviction.offense}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{conviction.prison_term}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {conviction.fine ? `₦${conviction.fine.toLocaleString()}` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => onFilterByCourt(conviction.court)}
                    className="text-secondary hover:underline"
                  >
                    {conviction.court}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {showingFrom} to {showingTo} of {pagination.total} records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevPage}
            disabled={pagination.offset === 0}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={showingTo >= pagination.total}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
