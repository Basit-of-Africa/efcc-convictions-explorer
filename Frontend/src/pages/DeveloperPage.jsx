import React, { useState } from "react";
import { Code, ExternalLink, Copy, Check, Menu, X } from "lucide-react";

const DeveloperPage = ({ isDark }) => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedCode, setCopiedCode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bgClass = isDark ? "bg-slate-900" : "bg-white";
  const sideBgClass = isDark ? "bg-slate-800/50" : "bg-gray-50";
  const textColorClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-600";
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const codeBgClass = isDark ? "bg-gray-950" : "bg-gray-100";
  const borderClass = isDark ? "border-gray-700" : "border-gray-200";
  const linkClass = isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700";
  const activeNavClass = isDark ? "bg-blue-600/20 text-blue-400 border-l-2 border-l-blue-600" : "bg-blue-50 text-blue-600 border-l-2 border-l-blue-600";

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: "introduction", label: "Introduction", icon: "📖" },
    { id: "quick-start", label: "Quick Start", icon: "⚡" },
    { id: "api-basics", label: "API Basics", icon: "🔧" },
    { id: "endpoints", label: "Endpoints", icon: "🔗" },
    { id: "examples", label: "Code Examples", icon: "💻" },
    { id: "authentication", label: "Authentication", icon: "🔐" },
    { id: "errors", label: "Error Handling", icon: "⚠️" },
    { id: "support", label: "Get Support", icon: "📞" }
  ];

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/convictions",
      description: "Retrieve all convictions with pagination",
      params: "limit (int), offset (int)"
    },
    {
      method: "GET",
      endpoint: "/search?name={name}",
      description: "Search for convictions by defendant name",
      params: "name (string)"
    },
    {
      method: "GET",
      endpoint: "/offense?type={type}",
      description: "Filter convictions by offense type",
      params: "type (string)"
    },
    {
      method: "GET",
      endpoint: "/court?name={name}",
      description: "Find convictions by court location",
      params: "name (string)"
    },
    {
      method: "GET",
      endpoint: "/stats",
      description: "Get conviction statistics and aggregates",
      params: "None"
    }
  ];

  const codeExamples = [
    {
      id: "curl-search",
      language: "cURL",
      code: `curl https://api.fraudcheckr.com/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "JOHN DOE"}'`
    },
    {
      id: "python-search",
      language: "Python",
      code: `import requests

response = requests.get(
  'https://api.fraudcheckr.com/search',
  params={'name': 'JOHN DOE'},
  headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

convictions = response.json()
print(convictions['data'])`
    },
    {
      id: "javascript-search",
      language: "JavaScript",
      code: `const fetch = require('node-fetch');

const response = await fetch(
  'https://api.fraudcheckr.com/search?name=JOHN DOE',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.data);`
    },
    {
      id: "response-example",
      language: "JSON Response",
      code: `{
  "status": "success",
  "message": "Convictions retrieved",
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
  ],
  "meta": {
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}`
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "introduction":
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${headingClass} mb-4`}>Developer Documentation</h1>
              <p className={`text-lg ${textSecondaryClass}`}>
                Welcome to the Nigeria's Fraud Conviction Records API documentation. Learn how to integrate our API into your applications and access publicly verified fraud conviction records from Nigeria's federal courts.
              </p>
            </div>

            <div className={`bg-gradient-to-br ${isDark ? "from-blue-900/20 to-purple-900/20" : "from-blue-50 to-purple-50"} border ${borderClass} p-8 rounded-xl`}>
              <h3 className={`text-xl font-bold ${headingClass} mb-3`}>What You Can Do</h3>
              <ul className={`space-y-2 ${textSecondaryClass}`}>
                <li>✓ Search conviction records by defendant name</li>
                <li>✓ Filter by offense type and court location</li>
                <li>✓ Retrieve aggregate statistics and trends</li>
                <li>✓ Access 7,788+ verified records from 2020-2024</li>
                <li>✓ Integrate into your application with REST API</li>
              </ul>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Quick Links</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveSection("quick-start")}
                  className={`p-4 text-left rounded-lg border ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-50"} transition`}
                >
                  <h3 className={`font-bold ${headingClass} mb-2`}>⚡ Get Started in 5 Minutes</h3>
                  <p className={textSecondaryClass}>Set up API access and make your first request</p>
                </button>
                <button
                  onClick={() => setActiveSection("endpoints")}
                  className={`p-4 text-left rounded-lg border ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-50"} transition`}
                >
                  <h3 className={`font-bold ${headingClass} mb-2`}>🔗 Browse API Reference</h3>
                  <p className={textSecondaryClass}>Explore all available endpoints</p>
                </button>
                <button
                  onClick={() => setActiveSection("examples")}
                  className={`p-4 text-left rounded-lg border ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-50"} transition`}
                >
                  <h3 className={`font-bold ${headingClass} mb-2`}>💻 Code Examples</h3>
                  <p className={textSecondaryClass}>See working examples in multiple languages</p>
                </button>
                <button
                  onClick={() => setActiveSection("authentication")}
                  className={`p-4 text-left rounded-lg border ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-50"} transition`}
                >
                  <h3 className={`font-bold ${headingClass} mb-2`}>🔐 Authentication</h3>
                  <p className={textSecondaryClass}>Authenticate your API requests</p>
                </button>
              </div>
            </div>
          </div>
        );

      case "quick-start":
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${headingClass} mb-4`}>Quick Start Guide</h1>
              <p className={`text-lg ${textSecondaryClass} mb-6`}>Get up and running with Nigeria's Fraud Conviction Records API in 5 minutes.</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Create an Account",
                  description: "Sign up for a FraudCheckr account to get API access. Visit fraudcheckr.com/api and create a free account."
                },
                {
                  step: 2,
                  title: "Get Your API Key",
                  description: "Once signed up, visit your dashboard and generate an API key. Keep this secure and never share it publicly."
                },
                {
                  step: 3,
                  title: "Make Your First Request",
                  description: "Use your API key to make authenticated requests to any of our endpoints."
                },
                {
                  step: 4,
                  title: "Parse the Response",
                  description: "All responses are in JSON format with consistent structure: status, message, data, and meta."
                },
                {
                  step: 5,
                  title: "Build Your Integration",
                  description: "Integrate the API into your application using SDKs or direct HTTP requests."
                }
              ].map((item) => (
                <div key={item.step} className={`flex gap-6 p-6 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white bg-blue-600`}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className={`font-bold ${headingClass} mb-2`}>{item.title}</h3>
                    <p className={textSecondaryClass}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`bg-gradient-to-br ${isDark ? "from-green-900/20 to-emerald-900/20" : "from-green-50 to-emerald-50"} border border-green-500/30 p-6 rounded-lg`}>
              <h3 className={`font-bold ${headingClass} mb-2`}>✓ First Request Template</h3>
              <p className={textSecondaryClass + " mb-4"}>Ready to make your first API call?</p>
              <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                <Code className="w-4 h-4" />
                See Code Examples
              </button>
            </div>
          </div>
        );

      case "api-basics":
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${headingClass} mb-4`}>API Basics</h1>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Base URL</h2>
              <div className={`${codeBgClass} p-4 rounded-lg border ${borderClass}`}>
                <code className={`text-sm ${isDark ? "text-green-400" : "text-green-700"}`}>
                  https://api.fraudcheckr.com
                </code>
              </div>
              <p className={`mt-3 ${textSecondaryClass}`}>
                All API requests must be made to this base URL using HTTPS. Unencrypted HTTP requests are not supported.
              </p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Available Environments</h2>
              <div className="space-y-4">
                {[
                  { name: "Development", url: "https://api-dev.fraudcheckr.com", purpose: "Testing and development" },
                  { name: "Production", url: "https://api.fraudcheckr.com", purpose: "Live requests and real data" }
                ].map((env, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                    <h3 className={`font-bold ${headingClass} mb-1`}>{env.name}</h3>
                    <p className={`text-sm ${textSecondaryClass} mb-2`}>{env.purpose}</p>
                    <code className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>{env.url}</code>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>HTTP Methods</h2>
              <div className="overflow-x-auto">
                <table className={`w-full text-left ${textSecondaryClass}`}>
                  <thead className={`border-b ${borderClass}`}>
                    <tr>
                      <th className={`py-3 px-4 font-bold ${headingClass}`}>Method</th>
                      <th className={`py-3 px-4 font-bold ${headingClass}`}>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-b ${borderClass}`}>
                      <td className="py-3 px-4"><span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span></td>
                      <td>Retrieve data from the server</td>
                    </tr>
                    <tr className={`border-b ${borderClass}`}>
                      <td className="py-3 px-4"><span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">POST</span></td>
                      <td>Not currently used - read-only API</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Response Format</h2>
              <p className={`${textSecondaryClass} mb-4`}>All responses are returned in JSON format with the following structure:</p>
              <div className={`${codeBgClass} p-4 rounded-lg border ${borderClass} overflow-x-auto`}>
                <pre className="text-sm text-blue-400">
{`{
  "status": "success",
  "message": "Convictions retrieved",
  "data": [ /* actual response data */ ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        );

      case "endpoints":
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${headingClass} mb-4`}>API Endpoints</h1>
              <p className={`text-lg ${textSecondaryClass}`}>Complete reference for all available endpoints.</p>
            </div>

            <div className="space-y-6">
              {apiEndpoints.map((endpoint, idx) => (
                <div key={idx} className={`border ${borderClass} rounded-lg overflow-hidden`}>
                  <div className={`p-4 ${isDark ? "bg-slate-800/50" : "bg-gray-50"} border-b ${borderClass}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded text-white font-bold text-sm ${endpoint.method === "GET" ? "bg-blue-600" : "bg-green-600"}`}>
                        {endpoint.method}
                      </span>
                      <code className={`font-mono ${headingClass}`}>{endpoint.endpoint}</code>
                    </div>
                    <p className={textSecondaryClass}>{endpoint.description}</p>
                  </div>
                  <div className="p-4">
                    <p className={`${textSecondaryClass} mb-2`}><strong className={headingClass}>Query Parameters:</strong> {endpoint.params}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "examples":
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${headingClass} mb-4`}>Code Examples</h1>
              <p className={`text-lg ${textSecondaryClass}`}>See how to integrate the API in your preferred language.</p>
            </div>

            {codeExamples.map((example) => (
              <div key={example.id}>
                <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>{example.language}</h2>
                <div className={`${codeBgClass} rounded-lg border ${borderClass} overflow-hidden`}>
                  <div className={`flex items-center justify-between px-4 py-3 border-b ${borderClass}`}>
                    <span className={`text-sm font-mono ${textSecondaryClass}`}>{example.language}</span>
                    <button
                      onClick={() => copyToClipboard(example.code, example.id)}
                      className={`p-2 rounded ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-200"} transition`}
                      title="Copy code"
                    >
                      {copiedCode === example.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <pre className={`p-4 overflow-x-auto text-sm ${isDark ? "text-green-400" : "text-green-700"}`}>
                    {example.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        );

      case "authentication":
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${headingClass} mb-4`}>Authentication</h1>
              <p className={`text-lg ${textSecondaryClass}`}>All API requests require authentication using your API key.</p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Bearer Token Authentication</h2>
              <p className={`${textSecondaryClass} mb-4`}>Include your API key in the Authorization header of every request:</p>
              <div className={`${codeBgClass} p-4 rounded-lg border ${borderClass}`}>
                <code className={`text-sm ${isDark ? "text-green-400" : "text-green-700"}`}>
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Example Request</h2>
              <div className={`${codeBgClass} p-4 rounded-lg border ${borderClass} overflow-x-auto`}>
                <pre className="text-sm text-blue-400">
{`curl https://api.fraudcheckr.com/search \\
  -H "Authorization: Bearer sk_live_abc123def456" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${isDark ? "from-red-900/20 to-pink-900/20" : "from-red-50 to-pink-50"} border border-red-500/30 p-6 rounded-lg`}>
              <h3 className={`font-bold ${headingClass} mb-2`}>⚠️ Security Best Practices</h3>
              <ul className={`space-y-2 ${textSecondaryClass}`}>
                <li>• Never expose your API key in client-side code</li>
                <li>• Use environment variables to store your key</li>
                <li>• Rotate your keys regularly</li>
                <li>• Use separate keys for development and production</li>
              </ul>
            </div>
          </div>
        );

      case "errors":
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${headingClass} mb-4`}>Error Handling</h1>
              <p className={`text-lg ${textSecondaryClass}`}>Understand and handle API errors gracefully.</p>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>HTTP Status Codes</h2>
              <div className="space-y-3">
                {[
                  { code: 200, message: "OK", description: "Request successful" },
                  { code: 400, message: "Bad Request", description: "Invalid parameters or malformed request" },
                  { code: 401, message: "Unauthorized", description: "Missing or invalid API key" },
                  { code: 404, message: "Not Found", description: "Requested resource not found" },
                  { code: 429, message: "Too Many Requests", description: "Rate limit exceeded" },
                  { code: 500, message: "Server Error", description: "Internal server error" }
                ].map((error, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                    <div className="flex items-start gap-3">
                      <span className={`font-bold px-3 py-1 rounded text-white text-sm ${error.code >= 500 ? "bg-red-600" : error.code >= 400 ? "bg-yellow-600" : "bg-green-600"}`}>
                        {error.code}
                      </span>
                      <div>
                        <h4 className={`font-bold ${headingClass}`}>{error.message}</h4>
                        <p className={textSecondaryClass}>{error.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-bold ${headingClass} mb-4`}>Error Response Format</h2>
              <div className={`${codeBgClass} p-4 rounded-lg border ${borderClass} overflow-x-auto`}>
                <pre className="text-sm text-blue-400">
{`{
  "status": false,
  "message": "Invalid API key",
  "data": null,
  "meta": {
    "error_code": "UNAUTHORIZED"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${headingClass} mb-4`}>Get Support</h1>
              <p className={`text-lg ${textSecondaryClass}`}>We're here to help you succeed with our API.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-xl font-bold ${headingClass} mb-3`}>📧 Email Support</h3>
                <p className={`${textSecondaryClass} mb-4`}>For general questions and support requests</p>
                <a href="mailto:support@fraudcheckr.com" className={`font-semibold ${linkClass}`}>
                  support@fraudcheckr.com
                </a>
                <p className={`text-sm ${textSecondaryClass} mt-3`}>Response time: 24-48 hours</p>
              </div>

              <div className={`p-6 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                <h3 className={`text-xl font-bold ${headingClass} mb-3`}>🚀 Developer Support</h3>
                <p className={`${textSecondaryClass} mb-4`}>For API integration issues and technical questions</p>
                <a href="mailto:api@fraudcheckr.com" className={`font-semibold ${linkClass}`}>
                  api@fraudcheckr.com
                </a>
                <p className={`text-sm ${textSecondaryClass} mt-3`}>Response time: 2-4 hours</p>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${isDark ? "from-blue-900/20 to-purple-900/20" : "from-blue-50 to-purple-50"} border ${borderClass} p-6 rounded-lg`}>
              <h3 className={`text-xl font-bold ${headingClass} mb-3`}>📖 Additional Resources</h3>
              <ul className={`space-y-2 ${textSecondaryClass}`}>
                <li><a href="#" className={linkClass}>Community Forum</a></li>
                <li><a href="#" className={linkClass}>Status Page</a></li>
                <li><a href="#" className={linkClass}>Changelog</a></li>
                <li><a href="#" className={linkClass}>GitHub Repository</a></li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b ${isDark ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-gray-200"} backdrop-blur`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${headingClass}`}>Developers</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`md:hidden p-2 rounded ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div
          className={`fixed md:static w-64 h-screen ${isDark ? "bg-slate-800/50" : "bg-gray-50"} border-r ${borderClass} overflow-y-auto transition-all duration-300 z-30 md:z-auto ${
            sidebarOpen ? "left-0" : "left-full md:left-0"
          }`}
        >
          <div className="p-6 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeSection === section.id
                    ? activeNavClass
                    : isDark
                    ? "hover:bg-slate-700/50"
                    : "hover:bg-gray-100"
                } ${textColorClass}`}
              >
                <span className="mr-2">{section.icon}</span>
                <span className="font-medium text-sm">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-4xl">{renderContent()}</div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DeveloperPage;
