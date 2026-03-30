
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("name");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      axios
        .get(`http://127.0.0.1:8000/search?name=${query}`)
        .then((response) => {
          setResults(response.data.data); // Extract the data array from paginated response
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch results. Please try again later.");
          console.error("API Error:", err);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Search Results{query && ` for "${query}"`}
          </h1>
          <p className="text-gray-400">
            {loading ? "Searching..." : `Found ${results.length} record${results.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar initialValue={query} />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader />
            </div>
          ) : error ? (
            <EmptyState message={error} />
          ) : results.length > 0 ? (
            <>
              <p className="text-gray-400 mb-6">
                Showing {results.length} matching record{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((result, index) => (
                <ResultCard key={index} result={result} />
              ))}
            </>
          ) : (
            <>
              <EmptyState message={`No records found for "${query}". Try a different search.`} />
              <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Search Tips:</h3>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>• Try searching with just a first name or last name</li>
                  <li>• Search is case-insensitive</li>
                  <li>• Partial matches are supported</li>
                  <li>• Visit the <a href="/insights" className="text-blue-400 hover:text-blue-300">Insights</a> page to explore conviction statistics</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
