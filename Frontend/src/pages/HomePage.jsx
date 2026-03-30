
import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { Shield, Search, BarChart3, Lock, Zap, Globe } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl w-full z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Check EFCC Conviction
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Records</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Access publicly verified EFCC (Economic and Financial Crimes Commission) conviction records. Search by defendant name, offense type, or court location. Transparent, accurate, and always up-to-date.
            </p>
            
            <div className="mb-16">
              <SearchBar />
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Verified Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-gray-900 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Comprehensive tools to search, analyze, and understand EFCC conviction records
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Search</h3>
              <p className="text-gray-400">
                Find conviction records by defendant name with instant, accurate results. Supports partial matches and fuzzy search.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Deep Analytics</h3>
              <p className="text-gray-400">
                Explore conviction trends, offense statistics, court distribution, and sentencing patterns across the database.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Nationwide Coverage</h3>
              <p className="text-gray-400">
                Access records from 33+ Federal High Courts across Nigeria. Filter by court location and jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Search",
                description: "Enter a defendant's name to search our database of 864 verified conviction records"
              },
              {
                step: 2,
                title: "Review",
                description: "View detailed case information including offense, court, sentence, and penalties"
              },
              {
                step: 3,
                title: "Analyze",
                description: "Explore statistics, trends, and patterns in fraud convictions across Nigeria"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Conviction Records", value: "864" },
              { label: "Federal Courts", value: "33" },
              { label: "Offense Types", value: "192" },
              { label: "Years Covered", value: "2020" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Access the Data?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Start exploring EFCC conviction records today. Completely free and accessible to everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search?name=" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105">
              Start Searching
            </Link>
            <Link to="/insights" className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg border border-slate-700 hover:border-gray-500 transition-all">
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Is this data publicly available?",
                a: "Yes, all EFCC conviction records are public information from official court proceedings and the Economic and Financial Crimes Commission website."
              },
              {
                q: "How often is the data updated?",
                a: "Our database is updated regularly with new convictions. The current dataset covers convictions from 2020 with ongoing updates as new cases are finalized."
              },
              {
                q: "Can I download the data?",
                a: "Currently, data can be viewed through our web interface. API access and bulk download features are coming soon."
              },
              {
                q: "Is this information confidential?",
                a: "No, this is public information from court records. However, we encourage responsible use of this data for legitimate purposes only."
              },
              {
                q: "What if I find incorrect information?",
                a: "If you find discrepancies, please contact our support team. We cross-reference all data with official EFCC records."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-slate-800 rounded-lg border border-slate-700 p-6 cursor-pointer hover:border-slate-600 transition-colors">
                <summary className="flex justify-between items-center font-semibold text-white">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <p className="text-gray-400 mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Trusted by Organizations Nationwide
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Used by journalists, researchers, compliance officers, and organizations seeking verified fraud conviction data
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                org: "Media & Journalism",
                uses: "Investigative reporting and fact-checking"
              },
              {
                org: "Compliance & Risk",
                uses: "Due diligence and background verification"
              },
              {
                org: "Research & Academia",
                uses: "Fraud studies and trend analysis"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">{item.org}</h3>
                <p className="text-gray-400">{item.uses}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
