import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { developerSignup, setDeveloperSessionToken } from "../lib/developerAuth";

const DeveloperSignupPage = ({ isDark }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await developerSignup({
        email: form.email,
        password: form.password,
      });
      setDeveloperSessionToken(data.access_token);
      navigate("/developers/account");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen px-4 py-16 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <div className={`max-w-md mx-auto rounded-3xl border p-8 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-500 mb-3">Developer API</p>
        <h1 className={`text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Create account</h1>
        <p className={`${isDark ? "text-slate-400" : "text-gray-600"} mb-8`}>
          Set up your FraudCheckr developer workspace to manage billing, API keys, and screening reports.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-200" : "text-gray-700"}`}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="team@example.com"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-200" : "text-gray-700"}`}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-200" : "text-gray-700"}`}>Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="Repeat your password"
              minLength={8}
              required
            />
          </div>

          {error && (
            <div className={`rounded-xl border px-4 py-3 text-sm ${isDark ? "border-red-800 bg-red-950/40 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 text-white font-semibold px-4 py-3 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create developer account"}
          </button>
        </form>

        <p className={`mt-6 text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}>
          Already have an account?{" "}
          <Link to="/developers/login" className="text-blue-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DeveloperSignupPage;
