import React from 'react';

/**
 * CreditsDisplay — shows remaining AI credits with a visual progress bar.
 *
 * Props:
 *   used      {number}  credits consumed
 *   total     {number}  total credits in plan
 *   loading   {boolean}
 *   onTopUp   {function} optional top-up handler
 */
export default function CreditsDisplay({ used = 0, total = 0, loading = false, onTopUp }) {
  const pct = total > 0 ? Math.min(Math.round((used / total) * 100), 100) : 0;
  const remaining = Math.max(total - used, 0);

  const barColor =
    pct >= 90 ? 'bg-red-500' :
    pct >= 70 ? 'bg-amber-500' :
    'bg-indigo-500';

  const textColor =
    pct >= 90 ? 'text-red-600' :
    pct >= 70 ? 'text-amber-600' :
    'text-indigo-600';

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-24 mb-3" />
        <div className="h-2 bg-gray-200 rounded-full" />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">AI Credits</h3>
          <p className="text-xs text-gray-400 mt-0.5">Resets with billing cycle</p>
        </div>
        <span className="text-2xl">🪙</span>
      </div>

      <div className="flex items-end gap-1 mb-1">
        <span className={`text-3xl font-extrabold tabular-nums ${textColor}`}>
          {remaining.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400 mb-1">/ {total.toLocaleString()}</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">{pct}% used</p>

      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {pct >= 80 && (
        <p className="mt-2 text-xs text-amber-600 font-medium">
          ⚠️ Running low on credits.
        </p>
      )}

      {onTopUp && (
        <button
          onClick={onTopUp}
          className="mt-4 btn-secondary w-full text-xs py-2"
        >
          Top up credits
        </button>
      )}
    </div>
  );
}
