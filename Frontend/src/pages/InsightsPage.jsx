
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { BarChart3, Briefcase, Scale, TrendingUp } from "lucide-react";

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
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 flex items-center justify-center">
        <EmptyState message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Conviction Intelligence
          </h1>
          <p className="text-xl text-gray-400">
            Deep dive into EFCC fraud conviction data and trends
          </p>
        </div>

        {/* Main Stats Grid */}
        {stats && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Total Cases */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Scale className="w-7 h-7 text-blue-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Total Convictions</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    {stats.total_cases}
                  </p>
                  <p className="text-xs text-gray-500">Verified cases</p>
                </div>
              </div>

              {/* Unique Offenses */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all hover:shadow-xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Briefcase className="w-7 h-7 text-purple-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Offense Types</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    {stats.unique_offenses}
                  </p>
                  <p className="text-xs text-gray-500">Distinct charges</p>
                </div>
              </div>

              {/* Unique Courts */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-green-500 transition-all hover:shadow-xl hover:shadow-green-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-7 h-7 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Federal Courts</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    {stats.unique_courts}
                  </p>
                  <p className="text-xs text-gray-500">Jurisdictions</p>
                </div>
              </div>

              {/* Average Sentence */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-orange-500 transition-all hover:shadow-xl hover:shadow-orange-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-7 h-7 text-orange-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Avg Sentence</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    {stats.average_prison_term_months
                      ? Math.round(stats.average_prison_term_months / 12)
                      : "N/A"}{" "}
                    <span className="text-xl">yrs</span>
                  </p>
                  <p className="text-xs text-gray-500">Average prison term</p>
                </div>
              </div>
            </div>

            {/* Most Common Offense */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 mb-16">
              <h2 className="text-2xl font-bold text-white mb-6">
                Most Common Offense
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">⚖️</span>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Leading Charge Type</p>
                  <p className="text-4xl font-bold text-white">
                    {stats.most_common_offense}
                  </p>
                  <p className="text-gray-500 mt-2">
                    Most frequently prosecuted offense in EFCC records
                  </p>
                </div>
              </div>
            </div>

            {/* Insights Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-8 rounded-2xl border border-blue-700/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  Conviction Coverage
                </h3>
                <p className="text-gray-300 mb-4">
                  Our database contains comprehensive conviction records spanning multiple years, covering fraud cases processed through various federal courts across Nigeria.
                </p>
                <div className="text-blue-400 font-semibold">
                  {stats.total_cases} verified records
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-8 rounded-2xl border border-purple-700/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  Offense Diversity
                </h3>
                <p className="text-gray-300 mb-4">
                  Convictions span {stats.unique_offenses} different offense types,
                  from cyber crimes to embezzlement. The variation shows the wide
                  scope of EFCC's enforcement activities.
                </p>
                <div className="text-purple-400 font-semibold">
                  {stats.unique_offenses} distinct offense types
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 p-8 rounded-2xl border border-green-700/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  Jurisdictional Spread
                </h3>
                <p className="text-gray-300 mb-4">
                  Cases are distributed across {stats.unique_courts} Federal High
                  Courts nationwide, reflecting EFCC's presence throughout Nigeria's
                  federal judicial system.
                </p>
                <div className="text-green-400 font-semibold">
                  {stats.unique_courts} federal courts involved
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 p-8 rounded-2xl border border-orange-700/30">
                <h3 className="text-xl font-bold text-white mb-4">
                  Sentencing Patterns
                </h3>
                <p className="text-gray-300 mb-4">
                  The average prison sentence reflects the seriousness with which
                  fraud crimes are prosecuted, indicating substantial custodial
                  penalties for convicted offenders.
                </p>
                <div className="text-orange-400 font-semibold">
                  {stats.average_prison_term_months
                    ? Math.round(stats.average_prison_term_months / 12)
                    : "N/A"}{" "}
                  years average
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
