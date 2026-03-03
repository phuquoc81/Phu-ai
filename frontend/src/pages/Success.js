import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Success() {
  // Verify session on mount (optional — backend can handle via webhook)
  const { data, isLoading } = useQuery({
    queryKey: ['checkout-success'],
    queryFn: () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      if (!sessionId) return null;
      return api.post('/billing/verify-session', { sessionId }).then((r) => r.data);
    },
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-slide-up">
        {isLoading ? (
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent mb-4" />
        ) : (
          <div className="text-7xl mb-6">🎉</div>
        )}
        <h1 className="text-3xl font-extrabold text-gray-900">
          {isLoading ? 'Confirming your subscription…' : 'You\'re all set!'}
        </h1>
        {!isLoading && (
          <>
            <p className="mt-3 text-gray-500">
              {data?.planName
                ? `Your ${data.planName} plan is now active. Welcome to Phu-AI!`
                : 'Your subscription has been activated. Welcome to Phu-AI!'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard" className="btn-primary px-8 py-3">
                Go to Dashboard
              </Link>
              <Link to="/billing" className="btn-outline px-8 py-3">
                View billing
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
