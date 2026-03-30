
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
          setResults(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch results. Please try again later.");
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <SearchBar initialValue={query} />
        <div className="mt-8">
          {loading ? (
            <Loader />
          ) : error ? (
            <EmptyState message={error} />
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))
          ) : (
            <EmptyState message="No records found." />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
