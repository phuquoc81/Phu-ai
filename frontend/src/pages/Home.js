import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Blazing-fast AI inference',
    description:
      'Sub-second latency for text generation, summarisation, and classification tasks powered by our optimised model fleet.',
  },
  {
    icon: '📊',
    title: 'Real-time usage analytics',
    description:
      'Granular dashboards show token consumption, cost breakdown, and trend forecasting across your entire org.',
  },
  {
    icon: '👥',
    title: 'Team & role management',
    description:
      'Invite unlimited collaborators, assign admin or member roles, and control access with fine-grained permissions.',
  },
  {
    icon: '🔒',
    title: 'Enterprise-grade security',
    description:
      'SOC 2 Type II, GDPR-compliant, end-to-end encryption, and SSO support out of the box.',
  },
  {
    icon: '💳',
    title: 'Flexible billing',
    description:
      'Monthly or annual plans, per-seat or usage-based pricing, and instant upgrades/downgrades via Stripe.',
  },
  {
    icon: '🪙',
    title: 'PHU81 token rewards',
    description:
      'Earn on-chain PHU81 tokens for platform activity and redeem them for additional AI credits.',
  },
];

const SOCIAL_PROOF = [
  { metric: '10 M+', label: 'API calls/day' },
  { metric: '3 000+', label: 'Companies' },
  { metric: '99.99%', label: 'Uptime SLA' },
  { metric: '< 300 ms', label: 'Avg. latency' },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 px-4 py-1 text-xs font-semibold text-indigo-200 mb-6">
            🚀 Now in General Availability
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Enterprise AI,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">
              simplified.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-indigo-200 leading-relaxed">
            Phu-AI gives your team production-ready AI capabilities, real-time analytics, and
            flexible billing — all in one platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-8 py-3 bg-white text-indigo-700 hover:bg-indigo-50">
              Start free trial
            </Link>
            <Link to="/pricing" className="btn-outline text-base px-8 py-3 border-indigo-400 text-indigo-100 hover:bg-indigo-700/30">
              View pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-indigo-300">No credit card required · 14-day free trial</p>
        </div>
      </section>

      {/* ── Social proof ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {SOCIAL_PROOF.map((s) => (
            <div key={s.metric}>
              <p className="text-3xl font-extrabold text-indigo-600">{s.metric}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Everything your team needs
            </h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              From AI inference to billing automation — we handle the infrastructure so you can
              ship faster.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow animate-slide-up">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-indigo-600 py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to supercharge your team?</h2>
          <p className="mt-4 text-indigo-200 text-lg">
            Join 3 000+ companies already using Phu-AI to build smarter products.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-primary bg-white text-indigo-700 hover:bg-indigo-50 text-base px-8 py-3">
              Get started free
            </Link>
            <Link to="/pricing" className="btn-outline border-indigo-300 text-white hover:bg-indigo-700/30 text-base px-8 py-3">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
