import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  clearDeveloperSessionToken,
  clearStoredDeveloperApiKey,
  fetchDeveloperApiKeys,
  fetchDeveloperProfile,
  fetchScreeningReport,
  fetchScreeningReports,
  getDeveloperSessionToken,
  getStoredDeveloperApiKey,
  initializeDeveloperBilling,
  rotateDeveloperApiKey,
  runScreeningReport,
  setStoredDeveloperApiKey,
} from "../lib/developerAuth";
import DeveloperReportView from "../components/DeveloperReportView";

const DeveloperAccountPage = ({ isDark }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [latestApiKey, setLatestApiKey] = useState(getStoredDeveloperApiKey());
  const [apiKeyInput, setApiKeyInput] = useState(getStoredDeveloperApiKey());
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  const [rotateLoading, setRotateLoading] = useState(false);
  const [screeningLoading, setScreeningLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [screeningForm, setScreeningForm] = useState({
    full_name: "",
    aliases: "",
    location: "",
    reference: "",
    limit: 5,
  });

  const cardClass = isDark
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-gray-200";
  const mutedClass = isDark ? "text-slate-400" : "text-gray-600";
  const headingClass = isDark ? "text-white" : "text-gray-900";

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [profileData, keyData, reportData] = await Promise.all([
        fetchDeveloperProfile(),
        fetchDeveloperApiKeys(),
        fetchScreeningReports(),
      ]);
      setProfile(profileData);
      setApiKeys(keyData.keys || []);
      setReports(reportData.reports || []);
      if (reportData.reports?.length > 0) {
        const detail = await fetchScreeningReport(reportData.reports[0].report_id);
        setSelectedReport(detail);
      } else {
        setSelectedReport(null);
      }
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.detail || "Unable to load developer account.";
      setError(message);
      if (err.response?.status === 401) {
        clearDeveloperSessionToken();
        navigate("/developers/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getDeveloperSessionToken()) {
      navigate("/developers/login", { replace: true });
      return;
    }
    loadDashboard();
  }, []);

  useEffect(() => {
    const paymentReference = searchParams.get("reference");
    const paymentStatus = searchParams.get("trxref") || paymentReference;

    if (paymentReference || paymentStatus) {
      setNotice("Returned from Paystack. Refreshing your subscription status now.");
      loadDashboard().finally(() => {
        setSearchParams({}, { replace: true });
      });
    }
  }, []);

  const handleStartBilling = async () => {
    setBillingLoading(true);
    setError("");
    try {
      const response = await initializeDeveloperBilling("Developer API Monthly");
      window.location.href = response.authorization_url;
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Unable to start Paystack checkout.");
      setBillingLoading(false);
    }
  };

  const handleRotateApiKey = async () => {
    setRotateLoading(true);
    setError("");
    try {
      const response = await rotateDeveloperApiKey();
      setLatestApiKey(response.api_key);
      setApiKeyInput(response.api_key);
      setStoredDeveloperApiKey(response.api_key);
      setNotice("New API key issued. Store it securely now.");
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Unable to rotate API key.");
    } finally {
      setRotateLoading(false);
    }
  };

  const handleRunScreening = async (event) => {
    event.preventDefault();
    setScreeningLoading(true);
    setError("");

    const keyToUse = apiKeyInput.trim() || latestApiKey.trim();
    if (!keyToUse) {
      setError("Paste your active API key or rotate a new one before running a screening report.");
      setScreeningLoading(false);
      return;
    }

    try {
      const response = await runScreeningReport(
        {
          full_name: screeningForm.full_name,
          aliases: screeningForm.aliases
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          location: screeningForm.location || undefined,
          reference: screeningForm.reference || undefined,
          limit: Number(screeningForm.limit) || 5,
        },
        keyToUse,
      );
      setSelectedReport(response);
      setNotice("Screening report generated successfully.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Unable to run screening report. Make sure you are using the latest active API key."
      );
    } finally {
      setScreeningLoading(false);
    }
  };

  const handleLogout = () => {
    clearDeveloperSessionToken();
    clearStoredDeveloperApiKey();
    navigate("/developers/login");
  };

  const handleSelectReport = async (reportId) => {
    setReportLoading(true);
    setError("");
    try {
      const detail = await fetchScreeningReport(reportId);
      setSelectedReport(detail);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Unable to load screening report.");
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen px-4 py-16 ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="max-w-6xl mx-auto">Loading developer account...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-10 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-500">Developer account</p>
            <h1 className={`text-4xl font-bold mt-2 ${headingClass}`}>Manage billing, keys, and screening reports</h1>
            <p className={`mt-3 ${mutedClass}`}>{profile?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/developers"
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${isDark ? "border-slate-700 text-slate-200" : "border-gray-300 text-gray-700"}`}
            >
              Docs
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-700 text-white px-4 py-3 text-sm font-medium hover:bg-slate-600"
            >
              Log out
            </button>
          </div>
        </div>

        {error && (
          <div className={`rounded-2xl border px-5 py-4 ${isDark ? "border-red-800 bg-red-950/40 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
            {error}
          </div>
        )}

        {notice && (
          <div className={`rounded-2xl border px-5 py-4 ${isDark ? "border-blue-800 bg-blue-950/40 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
            {notice}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className={`rounded-3xl border p-6 ${cardClass}`}>
            <p className={`text-sm ${mutedClass}`}>Subscription</p>
            <h2 className={`text-2xl font-semibold mt-2 ${headingClass}`}>
              {profile?.has_active_subscription ? "Active" : "Inactive"}
            </h2>
            <p className={`mt-3 ${mutedClass}`}>
              {profile?.has_active_subscription
                ? `Active until ${profile.latest_subscription_active_until || "your current cycle ends"}`
                : "Start Paystack checkout to enable the paid developer API."}
            </p>
            {profile?.latest_subscription_reference && (
              <p className={`mt-3 text-xs ${mutedClass}`}>
                Latest reference: {profile.latest_subscription_reference}
              </p>
            )}
            <button
              onClick={handleStartBilling}
              disabled={billingLoading}
              className="mt-5 w-full rounded-xl bg-blue-600 text-white px-4 py-3 font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {billingLoading ? "Redirecting..." : "Start Paystack checkout"}
            </button>
          </div>

          <div className={`rounded-3xl border p-6 ${cardClass}`}>
            <p className={`text-sm ${mutedClass}`}>API keys</p>
            <h2 className={`text-2xl font-semibold mt-2 ${headingClass}`}>{apiKeys.length}</h2>
            <p className={`mt-3 ${mutedClass}`}>
              Rotate your API key after payment. FraudCheckr shows the full live key only once.
            </p>
            <button
              onClick={handleRotateApiKey}
              disabled={rotateLoading || !profile?.has_active_subscription}
              className="mt-5 w-full rounded-xl bg-emerald-600 text-white px-4 py-3 font-semibold hover:bg-emerald-700 disabled:opacity-60"
            >
              {rotateLoading ? "Rotating..." : "Rotate API key"}
            </button>
          </div>

          <div className={`rounded-3xl border p-6 ${cardClass}`}>
            <p className={`text-sm ${mutedClass}`}>Recent reports</p>
            <h2 className={`text-2xl font-semibold mt-2 ${headingClass}`}>{reports.length}</h2>
            <p className={`mt-3 ${mutedClass}`}>
              Screening reports are saved and can be revisited later for audit and case review.
            </p>
          </div>
        </div>

        {latestApiKey && (
          <div className={`rounded-3xl border p-6 ${cardClass}`}>
            <p className={`text-sm font-medium ${mutedClass}`}>New live API key</p>
            <p className={`mt-2 break-all font-mono text-sm ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>{latestApiKey}</p>
            <p className={`mt-3 text-sm ${mutedClass}`}>
              Store this key securely now. FraudCheckr will not show the full value again after this session.
            </p>
          </div>
        )}

        <div className="grid xl:grid-cols-[1.1fr,0.9fr] gap-6">
          <div className={`rounded-3xl border p-6 ${cardClass}`}>
            <h2 className={`text-2xl font-semibold ${headingClass}`}>Run screening report</h2>
            <p className={`mt-2 ${mutedClass}`}>
              Generate a review-ready report for onboarding, due diligence, or internal risk checks.
            </p>
            <form onSubmit={handleRunScreening} className="mt-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingClass}`}>Full name</label>
                <input
                  value={screeningForm.full_name}
                  onChange={(event) => setScreeningForm((current) => ({ ...current, full_name: event.target.value }))}
                  className={`w-full rounded-xl border px-4 py-3 ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingClass}`}>Active API key</label>
                <input
                  value={apiKeyInput}
                  onChange={(event) => setApiKeyInput(event.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 font-mono text-sm ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  placeholder="Paste your active fchk_live_... key"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingClass}`}>Aliases</label>
                <input
                  value={screeningForm.aliases}
                  onChange={(event) => setScreeningForm((current) => ({ ...current, aliases: event.target.value }))}
                  className={`w-full rounded-xl border px-4 py-3 ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  placeholder="Johnny Doe, J. Doe"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${headingClass}`}>Location</label>
                  <input
                    value={screeningForm.location}
                    onChange={(event) => setScreeningForm((current) => ({ ...current, location: event.target.value }))}
                    className={`w-full rounded-xl border px-4 py-3 ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    placeholder="Lagos"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${headingClass}`}>Reference</label>
                  <input
                    value={screeningForm.reference}
                    onChange={(event) => setScreeningForm((current) => ({ ...current, reference: event.target.value }))}
                    className={`w-full rounded-xl border px-4 py-3 ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    placeholder="cust_12345"
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${headingClass}`}>Result limit</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={screeningForm.limit}
                  onChange={(event) => setScreeningForm((current) => ({ ...current, limit: event.target.value }))}
                  className={`w-full rounded-xl border px-4 py-3 ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>
              <button
                type="submit"
                disabled={screeningLoading || !profile?.has_active_subscription}
                className="w-full rounded-xl bg-blue-600 text-white px-4 py-3 font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {screeningLoading ? "Running report..." : "Run screening report"}
              </button>
            </form>
          </div>

          <div className={`rounded-3xl border p-6 ${cardClass}`}>
            <h2 className={`text-2xl font-semibold ${headingClass}`}>Report viewer</h2>
            <DeveloperReportView isDark={isDark} report={selectedReport} loading={reportLoading} />
          </div>
        </div>

        <div className={`rounded-3xl border p-6 ${cardClass}`}>
          <h2 className={`text-2xl font-semibold ${headingClass}`}>Recent screening reports</h2>
          <div className="mt-4 grid gap-3">
            {reports.length === 0 ? (
              <p className={mutedClass}>No reports yet.</p>
            ) : (
              reports.map((report) => (
                <button
                  key={report.report_id}
                  onClick={() => handleSelectReport(report.report_id)}
                  className={`rounded-2xl border p-4 text-left transition ${isDark ? "border-slate-800 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className={`font-semibold ${headingClass}`}>{report.full_name}</p>
                      <p className={`text-sm ${mutedClass}`}>{report.summary_text}</p>
                    </div>
                    <div className={`text-sm ${mutedClass}`}>
                      {report.status} • {report.confidence} • {report.total_matches} match(es)
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          {reports.length > 0 && (
            <div className="mt-4">
              <Link to={`/developers/reports/${reports[0].report_id}`} className="text-blue-500 font-medium">
                Open latest report as its own page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperAccountPage;
