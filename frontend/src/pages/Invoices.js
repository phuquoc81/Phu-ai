import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const STATUS_BADGE = {
  paid: 'badge-success',
  open: 'badge-warning',
  void: 'badge-error',
  draft: 'badge-info',
};

export default function Invoices() {
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoices', page],
    queryFn: () => api.get(`/billing/invoices?page=${page}&limit=${PER_PAGE}`).then((r) => r.data),
    keepPreviousData: true,
  });

  const invoices = data?.invoices || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Invoices</h1>
        <p className="section-subtitle">Download your billing history.</p>
      </div>

      {isError && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load invoices. Please try again.
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Invoice #', 'Date', 'Amount', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5].map((j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                  No invoices yet.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{inv.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{inv.date}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className={STATUS_BADGE[inv.status] || 'badge-info'}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {inv.pdfUrl && (
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        Download PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} · {total} invoices
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="btn-outline py-1.5 px-3 text-xs disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="btn-outline py-1.5 px-3 text-xs disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
