import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-slide-up">
        <div className="text-7xl mb-6">😕</div>
        <h1 className="text-3xl font-extrabold text-gray-900">Payment cancelled</h1>
        <p className="mt-3 text-gray-500">
          No worries — your checkout was cancelled and you have not been charged. You can choose a
          plan whenever you're ready.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/pricing" className="btn-primary px-8 py-3">
            View plans
          </Link>
          <Link to="/dashboard" className="btn-outline px-8 py-3">
            Back to Dashboard
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          Need help?{' '}
          <a href="mailto:support@phu-ai.com" className="text-indigo-500 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
