import React, { useState } from "react";
import { Code, Lock, CreditCard, BookOpen, Zap, FileText } from "lucide-react";

const DocumentationPage = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState("getting-started");

  const bgClass = isDark ? "bg-gradient-to-b from-slate-900 to-gray-900" : "bg-white";
  const cardBgClass = isDark ? "from-slate-800 to-slate-900 border-slate-700" : "from-gray-50 to-white border-gray-200";
  const textColorClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-600";
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const codeBgClass = isDark ? "bg-gray-950" : "bg-gray-100";

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: Zap },
    { id: "api", label: "API Reference", icon: Code },
    { id: "pricing", label: "API Pricing", icon: CreditCard },
    { id: "examples", label: "Code Examples", icon: FileText }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "getting-started":
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>5-Minute Setup</h3>
              <ol className={`space-y-4 ${textSecondaryClass}`}>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">1.</span>
                  <div>
                    <strong className={headingClass}>Visit FraudCheckr</strong>
                    <p>Navigate to https://fraudcheckr.com and open the search page</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">2.</span>
                  <div>
                    <strong className={headingClass}>Search by Name</strong>
                    <p>Enter a defendant's name to find related conviction records</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">3.</span>
                  <div>
                    <strong className={headingClass}>View Details</strong>
                    <p>Click on any record to see full details including offense, court, and sentencing</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-500 font-bold">4.</span>
                  <div>
                    <strong className={headingClass}>Explore Analytics</strong>
                    <p>Visit the Insights page to view statistics and trends</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Database Overview</h3>
              <div className={`bg-gradient-to-br ${cardBgClass} p-6 rounded-xl border`}>
                <p className={textSecondaryClass}>
                  FraudCheckr provides access to verified EFCC conviction records including:
                </p>
                <ul className={`mt-4 space-y-2 ${textSecondaryClass}`}>
                  <li>✓ 864 total conviction records</li>
                  <li>✓ 33 Federal High Courts covered</li>
                  <li>✓ 192 distinct offense types</li>
                  <li>✓ Complete sentencing information</li>
                  <li>✓ Fine and restitution details</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "api":
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>REST API Endpoints</h3>
              <div className="space-y-6">
                {[
                  {
                    method: "GET",
                    endpoint: "/search?name={name}",
                    description: "Search for convictions by defendant name"
                  },
                  {
                    method: "GET",
                    endpoint: "/offense?type={type}",
                    description: "Filter convictions by offense type"
                  },
                  {
                    method: "GET",
                    endpoint: "/court?name={name}",
                    description: "Find convictions by court"
                  },
                  {
                    method: "GET",
                    endpoint: "/stats",
                    description: "Get conviction statistics and aggregates"
                  },
                  {
                    method: "GET",
                    endpoint: "/convictions?limit=10&offset=0",
                    description: "Retrieve all convictions with pagination"
                  }
                ].map((endpoint, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${cardBgClass} p-6 rounded-xl border`}>
                    <div className="flex items-start gap-4">
                      <span className={`px-3 py-1 rounded text-white font-bold text-sm ${endpoint.method === "GET" ? "bg-blue-600" : "bg-green-600"}`}>
                        {endpoint.method}
                      </span>
                      <div>
                        <code className={`block ${codeBgClass} p-2 rounded mb-2 font-mono text-sm`}>
                          {endpoint.endpoint}
                        </code>
                        <p className={textSecondaryClass}>{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Response Format</h3>
              <div className={`bg-gradient-to-br ${cardBgClass} p-6 rounded-xl border`}>
                <pre className={`${codeBgClass} p-4 rounded overflow-x-auto text-sm`}>
{`{
  "total": 10,
  "limit": 20,
  "offset": 0,
  "data": [
    {
      "name": "JOHN DOE",
      "offense": "FRAUD",
      "prison_term": "5 YEARS",
      "prison_term_months": 60,
      "fine": "5000000",
      "restitution": "1000000",
      "court": "FEDERAL HIGH COURT"
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Web Search - FREE</h3>
              <div className={`bg-gradient-to-br ${cardBgClass} p-6 rounded-xl border border-green-500/50`}>
                <p className={textSecondaryClass}>
                  Use FraudCheckr web interface to search and view conviction records completely free. Perfect for:
                </p>
                <ul className={`mt-4 space-y-2 ${textSecondaryClass}`}>
                  <li>✓ Quick record lookups</li>
                  <li>✓ Background verification</li>
                  <li>✓ Viewing conviction details</li>
                  <li>✓ Accessing analytics</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>API Access - PAID</h3>
              <p className={textSecondaryClass + " mb-6"}>
                Programmatic access to FraudCheckr data is available through our REST API, priced per request or monthly subscription.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Starter",
                    price: "₦500",
                    period: "/month",
                    requests: "1,000 API requests",
                    features: ["REST API access", "Search & Filter endpoints", "Email support"]
                  },
                  {
                    name: "Professional",
                    price: "₦2,500",
                    period: "/month",
                    requests: "50,000 API requests",
                    features: ["All Starter features", "Bulk export capability", "Priority support", "Rate limit: 100 req/min"],
                    highlight: true
                  },
                  {
                    name: "Enterprise",
                    price: "Custom",
                    period: "",
                    requests: "Unlimited requests",
                    features: ["All Professional features", "Dedicated support", "Custom integrations", "SLA guarantee"],
                  }
                ].map((plan, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${cardBgClass} p-6 rounded-xl border ${plan.highlight ? "border-blue-500 shadow-lg shadow-blue-500/20" : ""}`}>
                    <h4 className={`text-xl font-bold ${headingClass} mb-2`}>{plan.name}</h4>
                    <div className="mb-4">
                      <span className={`text-3xl font-bold ${headingClass}`}>{plan.price}</span>
                      <span className={textSecondaryClass}>{plan.period}</span>
                    </div>
                    <p className={`text-sm ${textSecondaryClass} mb-4`}>{plan.requests}</p>
                    <ul className={`space-y-2 ${textSecondaryClass} mb-6`}>
                      {plan.features.map((feature, i) => (
                        <li key={i}>✓ {feature}</li>
                      ))}
                    </ul>
                    <button className={`w-full py-2 rounded font-semibold transition ${plan.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : isDark ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"}`}>
                      {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Billing & Payment</h3>
              <div className={`bg-gradient-to-br ${cardBgClass} p-6 rounded-xl border`}>
                <ul className={`space-y-3 ${textSecondaryClass}`}>
                  <li><strong className={headingClass}>Payment Methods:</strong> Bank transfer, Card (Visa/Mastercard)</li>
                  <li><strong className={headingClass}>Billing Cycle:</strong> Monthly, renewable automatically</li>
                  <li><strong className={headingClass}>Cancellation:</strong> Cancel anytime, no lock-in contract</li>
                  <li><strong className={headingClass}>Refunds:</strong> 7-day money-back guarantee for new customers</li>
                  <li><strong className={headingClass}>Invoice:</strong> Automatic invoice generation upon payment</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Get API Key</h3>
              <div className={`bg-gradient-to-br from-blue-600/20 to-purple-600/20 border ${isDark ? "border-blue-700/30" : "border-blue-300/30"} p-6 rounded-xl`}>
                <p className={textSecondaryClass + " mb-4"}>
                  Ready to integrate FraudCheckr API into your application?
                </p>
                <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  Subscribe to API
                </button>
              </div>
            </div>
          </div>
        );

      case "examples":
        return (
          <div className="space-y-8">
            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Python Example</h3>
              <div className={codeBgClass + " p-4 rounded-lg overflow-x-auto"}>
                <pre className="text-sm text-green-400">
{`import requests

# Search for convictions
response = requests.get(
  "https://api.fraudcheckr.com/search",
  params={"name": "JOHN DOE"},
  headers={"Authorization": "Bearer YOUR_API_KEY"}
)

records = response.json()
for record in records['data']:
  print(f"{record['name']} - {record['offense']}")`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>JavaScript/Node.js Example</h3>
              <div className={codeBgClass + " p-4 rounded-lg overflow-x-auto"}>
                <pre className="text-sm text-green-400">
{`const axios = require('axios');

async function searchConvictions(name) {
  const response = await axios.get(
    'https://api.fraudcheckr.com/search',
    {
      params: { name },
      headers: { 
        Authorization: 'Bearer YOUR_API_KEY' 
      }
    }
  );
  
  return response.data.data;
}

searchConvictions('JOHN DOE')
  .then(records => console.log(records));`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>cURL Example</h3>
              <div className={codeBgClass + " p-4 rounded-lg overflow-x-auto"}>
                <pre className="text-sm text-green-400">
{`curl -X GET "https://api.fraudcheckr.com/search?name=JOHN DOE" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-bold ${headingClass} mb-4`}>Getting Your API Key</h3>
              <ol className={`space-y-3 ${textSecondaryClass}`}>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">1.</span>
                  <span>Subscribe to an API plan (Starter, Professional, or Enterprise)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">2.</span>
                  <span>Complete payment and email verification</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">3.</span>
                  <span>Access your dashboard at https://dashboard.fraudcheckr.com</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">4.</span>
                  <span>Generate a new API key from Settings → API Keys</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">5.</span>
                  <span>Include the key in the Authorization header of your API requests</span>
                </li>
              </ol>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} py-20 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-bold ${headingClass} mb-4`}>Documentation</h1>
          <p className={`text-xl ${textSecondaryClass}`}>
            Everything you need to integrate FraudCheckr into your application
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex flex-wrap gap-4 mb-8 p-4 rounded-lg ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === section.id
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className={`bg-gradient-to-br ${cardBgClass} p-8 rounded-2xl border`}>
          {renderContent()}
        </div>

        {/* Support Section */}
        <div className={`mt-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border ${isDark ? "border-blue-700/30" : "border-blue-300/30"} p-12 rounded-2xl text-center`}>
          <h2 className={`text-3xl font-bold ${headingClass} mb-4`}>Need Help?</h2>
          <p className={`${textSecondaryClass} mb-8 max-w-2xl mx-auto`}>
            Check our FAQ, email support@fraudcheckr.com, or visit our community forum for assistance
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
