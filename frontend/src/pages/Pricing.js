import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCard from '../components/PricingCard';
import { redirectToCheckout } from '../services/stripe';
import { useAuth } from '../context/AuthContext';

const PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for individuals and small projects.',
    priceId: process.env.REACT_APP_STRIPE_STARTER_PRICE_ID || 'price_starter',
    features: [
      '50 000 AI tokens / month',
      '1 user seat',
      'REST API access',
      'Community support',
      'Usage dashboard',
    ],
    highlighted: false,
    cta: 'Start with Starter',
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For growing teams that need more power.',
    priceId: process.env.REACT_APP_STRIPE_PRO_PRICE_ID || 'price_pro',
    features: [
      '500 000 AI tokens / month',
      'Up to 10 user seats',
      'REST + WebSocket API',
      'Priority support (24 h SLA)',
      'Advanced analytics',
      'PHU81 token rewards',
    ],
    highlighted: true,
    cta: 'Start with Pro',
  },
  {
    name: 'Enterprise',
    price: '$399',
    period: '/month',
    description: 'Unlimited scale for large organisations.',
    priceId: process.env.REACT_APP_STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    features: [
      'Unlimited AI tokens',
      'Unlimited user seats',
      'Dedicated model instances',
      'SLA 99.99% uptime',
      'SSO / SAML',
      'Custom contracts & invoicing',
      'Dedicated success manager',
    ],
    highlighted: false,
    cta: 'Contact sales',
  },
];

const FAQ = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. Upgrades take effect immediately (pro-rated). Downgrades apply at the next billing cycle.',
  },
  {
    q: 'What happens when I exceed my token limit?',
    a: 'Requests are throttled. You can purchase additional credit bundles at any time from the billing page.',
  },
  {
    q: 'Is there a free trial?',
    a: 'All plans include a 14-day free trial with no credit card required.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, ACH, and wire transfers for annual enterprise contracts.',
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSelect = async (plan) => {
    setError('');
    if (!user) {
      navigate('/register');
      return;
    }
    if (plan.name === 'Enterprise') {
      window.location.href = 'mailto:sales@phu-ai.com?subject=Enterprise%20Enquiry';
      return;
    }
    setLoadingPlan(plan.name);
    try {
      await redirectToCheckout(plan.priceId);
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Simple, transparent pricing</h1>
          <p className="mt-3 text-lg text-gray-500">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
              loading={loadingPlan === plan.name}
              onSelect={() => handleSelect(plan)}
            />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          All plans include a 14-day free trial · Powered by{' '}
          <span className="font-medium text-indigo-500">Stripe</span>
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="card p-0 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                {item.q}
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <p className="px-5 pb-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
