
import React, { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const InsightsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/stats")
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch stats. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Fraud Insights
      </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <EmptyState message={error} />
      ) : stats ? (
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StatCard title="Total Convictions" value={stats.total_convictions} />
          <StatCard
            title="Most Common Offense"
            value={stats.most_common_offense}
          />
          <StatCard title="Average Sentence" value={`${stats.average_sentence_years} years`} />
        </div>
      ) : (
        <EmptyState message="No stats available." />
      )}
    </div>
  );
};

export default InsightsPage;
