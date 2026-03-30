import React from 'react';
import { TrendingUp, Scale, Building2, AlertCircle } from 'lucide-react';

export default function StatsPanel({ stats }) {
  const statCards = [
    {
      label: 'Total Cases',
      value: stats.total_cases?.toLocaleString() || 0,
      icon: Scale,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Unique Courts',
      value: stats.unique_courts || 0,
      icon: Building2,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Offense Types',
      value: stats.unique_offenses || 0,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-700',
    },
    {
      label: 'Avg Prison Term',
      value: stats.average_prison_term_months ? `${Math.round(stats.average_prison_term_months)} months` : 'N/A',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            );
          })}
        </div>
        {stats.most_common_offense && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Most Common Offense</p>
            <p className="text-lg font-semibold text-blue-900">{stats.most_common_offense}</p>
          </div>
        )}
      </div>
    </div>
  );
}
