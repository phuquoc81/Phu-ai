import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CreditsDisplay from '../components/CreditsDisplay';
import UsageChart from '../components/UsageChart';

const StatCard = ({ label, value, delta, icon, loading }) => (
  <div className="card flex items-start gap-4">
    <div className="text-3xl">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      {loading ? (
        <div className="h-7 bg-gray-200 rounded animate-pulse mt-1 w-20" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value ?? '—'}</p>
      )}
      {delta !== undefined && !loading && (
        <p className={`text-xs mt-0.5 ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% vs last month
        </p>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then((r) => r.data),
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard-chart'],
    queryFn: () => api.get('/dashboard/usage-chart').then((r) => r.data),
  });

  const labels = chartData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartDatasets = [
    { label: 'API Calls', data: chartData?.calls || [120, 200, 180, 340, 290, 80, 110] },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">
            Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="section-subtitle">Here's what's happening in your workspace.</p>
        </div>
        <Link to="/usage" className="btn-secondary hidden sm:inline-flex">
          Full analytics →
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="API calls this month"
          value={stats?.apiCalls?.toLocaleString()}
          delta={stats?.apiCallsDelta}
          icon="⚡"
          loading={statsLoading}
        />
        <StatCard
          label="Active team members"
          value={stats?.teamSize}
          icon="👥"
          loading={statsLoading}
        />
        <StatCard
          label="Current plan"
          value={stats?.plan || 'Starter'}
          icon="📦"
          loading={statsLoading}
        />
        <StatCard
          label="Tokens used today"
          value={stats?.tokensToday?.toLocaleString()}
          delta={stats?.tokensDelta}
          icon="🪙"
          loading={statsLoading}
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">API calls — last 7 days</h2>
            <span className="badge-info">Weekly</span>
          </div>
          {chartLoading ? (
            <div className="h-56 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <UsageChart type="bar" labels={labels} datasets={chartDatasets} height={220} />
          )}
        </div>

        {/* Credits */}
        <div className="space-y-4">
          <CreditsDisplay
            used={stats?.creditsUsed ?? 0}
            total={stats?.creditsTotal ?? 50000}
            loading={statsLoading}
            onTopUp={() => window.location.href = '/billing'}
          />

          {/* Quick links */}
          <div className="card space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick links</h3>
            {[
              { label: 'Manage team', href: '/team', icon: '👥' },
              { label: 'View invoices', href: '/invoices', icon: '🧾' },
              { label: 'Upgrade plan', href: '/pricing', icon: '⬆️' },
            ].map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>{l.icon}</span>
                <span className="flex-1">{l.label}</span>
                <span className="text-gray-400">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
