import React from 'react';

const ROLE_BADGE = {
  owner:  'badge-error',
  admin:  'badge-warning',
  member: 'badge-info',
};

/**
 * TeamMemberList — displays a list of team members with role badges and actions.
 *
 * Props:
 *   members   {{ id, name, email, role, joinedAt }[]}
 *   currentUserId {string}
 *   onRemove  {function(member)}
 *   onChangeRole {function(member, newRole)}
 *   loading   {boolean}
 */
export default function TeamMemberList({
  members = [],
  currentUserId,
  onRemove,
  onChangeRole,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-200 rounded w-48" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <svg className="mx-auto h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
        <p className="text-sm">No team members yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {members.map((member) => {
        const isCurrentUser = member.id === currentUserId;
        const initials = member.name
          ? member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
          : member.email.charAt(0).toUpperCase();

        return (
          <div key={member.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {member.name || 'Unknown'}{isCurrentUser && <span className="ml-1 text-xs text-gray-400">(you)</span>}
              </p>
              <p className="text-xs text-gray-500 truncate">{member.email}</p>
            </div>

            {/* Role */}
            <span className={`${ROLE_BADGE[member.role] || 'badge-info'} capitalize`}>
              {member.role}
            </span>

            {/* Actions */}
            {!isCurrentUser && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {onChangeRole && (
                  <select
                    className="text-xs border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={member.role}
                    onChange={(e) => onChangeRole(member, e.target.value)}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
                {onRemove && (
                  <button
                    onClick={() => onRemove(member)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove member"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
