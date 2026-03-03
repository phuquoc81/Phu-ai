import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { openCustomerPortal } from '../services/stripe';

const PLAN_COLORS = { Starter: 'badge-info', Pro: 'badge-warning', Enterprise: 'badge-success' };

export default function Billing() {
  const [portalLoading, setPortalLoading] = React.useState(false);
  const [portalError, setPortalError] = React.useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['billing'],
    queryFn: () => api.get('/billing').then((r) => r.data),
  });

  const subscription = data?.subscription;

  const handlePortal = async () => {
    setPortalError('');
    setPortalLoading(true);
    try {
      await openCustomerPortal();
    } catch (err) {
      setPortalError(err.message || 'Failed to open billing portal.');
    } finally {
      setPortalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container animate-fade-in">
        <div className="mb-8">
          <div className="h-7 bg-gray-200 rounded animate-pulse w-40 mb-2" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-64" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card animate-pulse h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Billing &amp; subscription</h1>
        <p className="section-subtitle">Manage your plan and payment methods.</p>
      </div>

      {isError && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load billing information. Please try again.
        </div>
      )}

      {portalError && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {portalError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Current plan */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Current plan</h2>
          {subscription ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">{subscription.planName}</span>
                <span className={PLAN_COLORS[subscription.planName] || 'badge-info'}>
                  {subscription.status}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-indigo-600">
                {subscription.amount}{' '}
                <span className="text-sm font-normal text-gray-500">{subscription.interval}</span>
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Renews on <strong className="text-gray-700">{subscription.renewsAt}</strong></p>
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-amber-600 font-medium">⚠️ Cancels at end of billing period</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <p>No active subscription.</p>
              <Link to="/pricing" className="btn-primary mt-3 inline-flex">View plans</Link>
            </div>
          )}
        </div>

        {/* Payment method */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Payment method</h2>
          {data?.paymentMethod ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 rounded bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                {data.paymentMethod.brand?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  •••• •••• •••• {data.paymentMethod.last4}
                </p>
                <p className="text-xs text-gray-500">
                  Expires {data.paymentMethod.expMonth}/{data.paymentMethod.expYear}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No payment method on file.</p>
          )}
        </div>
      </div>

      {/* Manage subscription */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Manage subscription</h2>
        <p className="text-xs text-gray-500 mb-4">
          Update your plan, payment method, or cancel through the Stripe portal.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handlePortal} disabled={portalLoading} className="btn-primary">
            {portalLoading ? 'Opening portal…' : 'Manage in Stripe'}
          </button>
          <Link to="/pricing" className="btn-outline">Change plan</Link>
          <Link to="/invoices" className="btn-outline">View invoices</Link>
        </div>
      </div>
    </div>
  );
}
