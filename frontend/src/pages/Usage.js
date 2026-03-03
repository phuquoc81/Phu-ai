import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import UsageChart from '../components/UsageChart';

const RANGE_OPTIONS = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

const StatPill = ({ label, value, loading }) => (
  <div className="card text-center">
    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
    {loading ? (
      <div className="h-7 bg-gray-200 rounded animate-pulse mt-2 mx-auto w-24" />
    ) : (
      <p className="text-2xl font-bold text-indigo-600 mt-1">{value}</p>
    )}
  </div>
);

export default function Usage() {
  const [range, setRange] = useState('7d');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['usage', range],
    queryFn: () => api.get(`/usage?range=${range}`).then((r) => r.data),
  });

  const labels = data?.labels || [];
  const apiCallsData = data?.apiCalls || [];
  const tokensData = data?.tokens || [];
  const errorRateData = data?.errorRate || [];

  const summary = data?.summary || {};

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Usage analytics</h1>
          <p className="section-subtitle">Monitor API consumption, tokens, and error rates.</p>
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                range === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load usage data. Please try again.
        </div>
      )}

      {/* Summary pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatPill label="Total API calls" value={summary.totalCalls?.toLocaleString()} loading={isLoading} />
        <StatPill label="Total tokens" value={summary.totalTokens?.toLocaleString()} loading={isLoading} />
        <StatPill label="Avg latency" value={summary.avgLatency ? `${summary.avgLatency} ms` : '—'} loading={isLoading} />
        <StatPill label="Error rate" value={summary.errorRate ? `${summary.errorRate}%` : '—'} loading={isLoading} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">API calls over time</h2>
          {isLoading ? (
            <div className="h-56 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <UsageChart
              type="bar"
              labels={labels}
              datasets={[{ label: 'API Calls', data: apiCallsData }]}
              height={220}
            />
          )}
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Token consumption</h2>
          {isLoading ? (
            <div className="h-56 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <UsageChart
              type="line"
              labels={labels}
              datasets={[{ label: 'Tokens', data: tokensData }]}
              height={220}
            />
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Error rate (%)</h2>
        {isLoading ? (
          <div className="h-40 bg-gray-50 rounded-lg animate-pulse" />
        ) : (
          <UsageChart
            type="line"
            labels={labels}
            datasets={[
              {
                label: 'Error rate',
                data: errorRateData,
                color: 'rgba(239, 68, 68, 1)',
              },
            ]}
            height={160}
          />
        )}
      </div>
    </div>
  );
}
