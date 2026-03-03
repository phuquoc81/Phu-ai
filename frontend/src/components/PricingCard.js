import React from 'react';

const CheckIcon = () => (
  <svg className="h-4 w-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * PricingCard — reusable card for a single subscription tier.
 *
 * Props:
 *   name        {string}    e.g. "Starter"
 *   price       {string}    e.g. "$49"
 *   period      {string}    e.g. "/month"
 *   description {string}
 *   features    {string[]}
 *   cta         {string}    Button label
 *   highlighted {boolean}   Show as featured/recommended
 *   loading     {boolean}
 *   onSelect    {function}
 */
export default function PricingCard({
  name,
  price,
  period = '/month',
  description,
  features = [],
  cta = 'Get started',
  highlighted = false,
  loading = false,
  onSelect,
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-shadow hover:shadow-lg ${
        highlighted
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-glow'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-semibold text-amber-900 shadow-sm">
          Most popular
        </span>
      )}

      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${highlighted ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
        <p className={`mt-1 text-sm ${highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>{description}</p>
      </div>

      <div className="mb-6 flex items-end gap-1">
        <span className={`text-5xl font-extrabold tracking-tight ${highlighted ? 'text-white' : 'text-gray-900'}`}>
          {price}
        </span>
        <span className={`mb-2 text-sm ${highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>{period}</span>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            {highlighted ? (
              <svg className="h-4 w-4 text-indigo-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <CheckIcon />
            )}
            <span className={highlighted ? 'text-indigo-100' : 'text-gray-600'}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={loading}
        className={`w-full rounded-xl px-5 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
          highlighted
            ? 'bg-white text-indigo-700 hover:bg-indigo-50 focus:ring-white'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing…
          </span>
        ) : (
          cta
        )}
      </button>
    </div>
  );
}
