
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import InsightsPage from "./pages/InsightsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-gray-900">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-md py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition">Support</a></li>
                  <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2026 EFCC Convictions Explorer. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-4 md:mt-0">
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
