
import React from "react";
import { Scale, Briefcase, Building2, DollarSign } from "lucide-react";

const ResultCard = ({ result }) => {
  return (
    <div className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 mb-4 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10">
      {/* Defendant Name */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
          {result.name}
        </h3>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Offense */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Offense
            </p>
          </div>
          <p className="text-lg text-white font-medium">
            {result.offense}
          </p>
        </div>

        {/* Court */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Court
            </p>
          </div>
          <p className="text-lg text-white font-medium">
            {result.court}
          </p>
        </div>

        {/* Prison Term */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-4 h-4 text-orange-400" />
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Prison Term
            </p>
          </div>
          <p className="text-lg text-white font-medium">
            {result.prison_term}
          </p>
          {result.prison_term_months && (
            <p className="text-xs text-gray-500 mt-1">
              ({result.prison_term_months} months)
            </p>
          )}
        </div>

        {/* Fine/Restitution */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Penalties
            </p>
          </div>
          <div className="space-y-1">
            {result.fine && (
              <p className="text-sm text-white">
                <span className="text-gray-400">Fine:</span> ₦{result.fine}
              </p>
            )}
            {result.restitution && (
              <p className="text-sm text-white">
                <span className="text-gray-400">Restitution:</span> ₦{result.restitution}
              </p>
            )}
            {!result.fine && !result.restitution && (
              <p className="text-sm text-gray-500">No fine or restitution recorded</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Badge */}
      <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between">
        <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">
          EFCC Conviction
        </span>
        <span className="text-xs text-gray-500">
          Case Record
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
