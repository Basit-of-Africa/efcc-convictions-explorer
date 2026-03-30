import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { convictionsAPI } from '../services/api';
import DataTable from './DataTable';
import StatsPanel from './StatsPanel';
import SearchBar from './SearchBar';

export default function Dashboard() {
  const [convictions, setConvictions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');

  // Load data function
  const loadData = async (searchQuery = '', filterQuery = '', filterType = 'all', offset = 0) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      const limit = pagination.limit;

      if (searchQuery) {
        response = await convictionsAPI.searchByName(searchQuery, limit, offset);
      } else if (filterType === 'offense' && filterQuery) {
        response = await convictionsAPI.filterByOffense(filterQuery, limit, offset);
      } else if (filterType === 'court' && filterQuery) {
        response = await convictionsAPI.filterByCourt(filterQuery, limit, offset);
      } else {
        response = await convictionsAPI.getConvictions(limit, offset);
      }

      setConvictions(response.data.data);
      setPagination({
        limit: response.data.limit,
        offset: response.data.offset,
        total: response.data.total,
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await convictionsAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    loadData('', '', 'all', 0);
    loadStats();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchTerm(query);
    setFilterValue('');
    setActiveFilter('all');
    setPagination({ ...pagination, offset: 0 });
    loadData(query, '', 'all', 0);
  };

  // Handle filter
  const handleFilter = (type, value) => {
    setFilterValue(value);
    setSearchTerm('');
    setActiveFilter(type);
    setPagination({ ...pagination, offset: 0 });
    loadData('', value, type, 0);
  };

  // Handle pagination
  const handleNextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    if (newOffset < pagination.total) {
      setPagination({ ...pagination, offset: newOffset });
      loadData(searchTerm, filterValue, activeFilter, newOffset);
    }
  };

  const handlePrevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    setPagination({ ...pagination, offset: newOffset });
    loadData(searchTerm, filterValue, activeFilter, newOffset);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterValue('');
    setActiveFilter('all');
    setPagination({ limit: 20, offset: 0, total: 0 });
    loadData('', '', 'all', 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">EFCC Convictions Explorer</h1>
          <p className="text-gray-300">Search and analyze Nigerian EFCC conviction records</p>
        </div>
      </div>

      {/* Stats Panel */}
      {stats && <StatsPanel stats={stats} />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onReset={handleReset} />

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={handleReset}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-secondary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Records
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          convictions={convictions}
          loading={loading}
          pagination={pagination}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onFilterByOffense={(offense) => handleFilter('offense', offense)}
          onFilterByCourt={(court) => handleFilter('court', court)}
        />
      </div>
    </div>
  );
}
