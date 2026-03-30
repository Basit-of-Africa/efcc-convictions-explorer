
import React from "react";
import { Scale, Briefcase, Building2, DollarSign } from "lucide-react";

const ResultCard = ({ result, isDark }) => {
  return (
    <div className={`group border rounded-xl p-6 mb-4 transition-all ${isDark ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10" : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/10"}`}>
      {/* Defendant Name */}
      <div className="mb-6">
        <h3 className={`text-2xl font-bold transition-colors ${isDark ? "text-white group-hover:text-blue-300" : "text-gray-900 group-hover:text-blue-600"}`}>
          {result.name}
        </h3>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Offense */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Offense
            </p>
          </div>
          <p className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            {result.offense}
          </p>
        </div>

        {/* Court */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className={`w-4 h-4 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Court
            </p>
          </div>
          <p className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            {result.court}
          </p>
        </div>

        {/* Prison Term */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Scale className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
            <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Prison Term
            </p>
          </div>
          <p className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            {result.prison_term}
          </p>
          {result.prison_term_months && (
            <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
              ({result.prison_term_months} months)
            </p>
          )}
        </div>

        {/* Fine/Restitution */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Penalties
            </p>
          </div>
          <div className="space-y-1">
            {result.fine && (
              <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Fine:</span> ₦{result.fine}
              </p>
            )}
            {result.restitution && (
              <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Restitution:</span> ₦{result.restitution}
              </p>
            )}
            {!result.fine && !result.restitution && (
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>No fine or restitution recorded</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Badge */}
      <div className={`mt-6 pt-6 border-t flex items-center justify-between ${isDark ? "border-slate-700" : "border-gray-200"}`}>
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
          EFCC Conviction
        </span>
        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
          Case Record
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
