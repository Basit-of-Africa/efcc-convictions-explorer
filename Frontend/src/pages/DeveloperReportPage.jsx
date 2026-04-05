import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearDeveloperSessionToken,
  clearStoredDeveloperApiKey,
  fetchScreeningReport,
  getDeveloperSessionToken,
} from "../lib/developerAuth";
import DeveloperReportView from "../components/DeveloperReportView";

const DeveloperReportPage = ({ isDark }) => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const headingClass = isDark ? "text-white" : "text-gray-900";
  const mutedClass = isDark ? "text-slate-400" : "text-gray-600";
  const cardClass = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200";

  useEffect(() => {
    if (!getDeveloperSessionToken()) {
      navigate("/developers/login", { replace: true });
      return;
    }

    const loadReport = async () => {
      setLoading(true);
      setError("");
      try {
        const detail = await fetchScreeningReport(reportId);
        setReport(detail);
      } catch (err) {
        const message = err.response?.data?.error || err.response?.data?.detail || "Unable to load screening report.";
        setError(message);
        if (err.response?.status === 401) {
          clearDeveloperSessionToken();
          clearStoredDeveloperApiKey();
          navigate("/developers/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  return (
    <div className={`min-h-screen px-4 py-10 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-500">Screening report</p>
            <h1 className={`text-4xl font-bold mt-2 ${headingClass}`}>Saved report detail</h1>
            <p className={`mt-3 ${mutedClass}`}>This route can be refreshed or bookmarked for audit and review.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/developers/account"
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${isDark ? "border-slate-700 text-slate-200" : "border-gray-300 text-gray-700"}`}
            >
              Back to account
            </Link>
            <Link
              to="/developers"
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${isDark ? "border-slate-700 text-slate-200" : "border-gray-300 text-gray-700"}`}
            >
              Docs
            </Link>
          </div>
        </div>

        {error && (
          <div className={`rounded-2xl border px-5 py-4 ${isDark ? "border-red-800 bg-red-950/40 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
            {error}
          </div>
        )}

        <div className={`rounded-3xl border p-6 ${cardClass}`}>
          <DeveloperReportView isDark={isDark} report={report} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default DeveloperReportPage;
