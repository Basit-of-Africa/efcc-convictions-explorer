
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import InsightsPage from "./pages/InsightsPage";
import AboutPage from "./pages/AboutPage";
import DocumentationPage from "./pages/DocumentationPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import SupportPage from "./pages/SupportPage";

function App() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Check system preference - default to light
      setIsDark(false);
    }
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const bgClass = isDark 
    ? "bg-gradient-to-b from-slate-900 via-slate-800 to-gray-900"
    : "bg-white";

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <main className="min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<HomePage isDark={isDark} />} />
            <Route path="/search" element={<SearchResultsPage isDark={isDark} />} />
            <Route path="/insights" element={<InsightsPage isDark={isDark} />} />
            <Route path="/about" element={<AboutPage isDark={isDark} />} />
            <Route path="/docs" element={<DocumentationPage isDark={isDark} />} />
            <Route path="/privacy" element={<PrivacyPage isDark={isDark} />} />
            <Route path="/terms" element={<TermsPage isDark={isDark} />} />
            <Route path="/disclaimer" element={<DisclaimerPage isDark={isDark} />} />
            <Route path="/contact" element={<ContactPage isDark={isDark} />} />
            <Route path="/faq" element={<FAQPage isDark={isDark} />} />
            <Route path="/support" element={<SupportPage isDark={isDark} />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className={`border-t transition-colors py-12 ${isDark ? "border-slate-700 bg-slate-900/50 backdrop-blur-md" : "border-gray-200 bg-white"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Product</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                  <li><a href="/" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Features</a></li>
                  <li><a href="/docs" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Documentation</a></li>
                  <li><a href="/docs#api" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>API Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Company</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <li><a href="/about" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>About</a></li>
                  <li><a href="/contact" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Contact</a></li>
                  <li><a href="/support" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Legal</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <li><a href="/privacy" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Privacy</a></li>
                  <li><a href="/terms" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Terms</a></li>
                  <li><a href="/disclaimer" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Disclaimer</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Resources</h3>
                <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <li><a href="/docs" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Docs</a></li>
                  <li><a href="/support" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>Support</a></li>
                  <li><a href="/faq" className={`${isDark ? "hover:text-white" : "hover:text-gray-900"} transition`}>FAQ</a></li>
                </ul>
              </div>
            </div>
            
            <div className={`border-t pt-8 ${isDark ? "border-slate-700" : "border-gray-200"}`}>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  © 2026 FraudCheckr. All rights reserved.
                </p>
                <p className={`text-xs mt-4 md:mt-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  Providing transparent access to public EFCC conviction records
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
