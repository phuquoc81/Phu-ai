import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TeamMemberList from '../components/TeamMemberList';

export default function Team() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => api.get('/team/members').then((r) => r.data),
  });

  const members = data?.members || [];

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }) => api.post('/team/invite', { email, role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['team-members'] });
      setFormSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setFormError('');
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || 'Failed to send invitation.');
      setFormSuccess('');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (memberId) => api.delete(`/team/members/${memberId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team-members'] }),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }) => api.patch(`/team/members/${id}`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team-members'] }),
  });

  const handleInvite = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!inviteEmail) return;
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title">Team management</h1>
        <p className="section-subtitle">Invite collaborators and manage roles.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Invite form */}
        <div className="card h-fit">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Invite a member</h2>
          <form onSubmit={handleInvite} className="space-y-3">
            {formError && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{formError}</p>
            )}
            {formSuccess && (
              <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">{formSuccess}</p>
            )}
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                required
                className="input"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select
                className="input"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviteMutation.isPending}
              className="btn-primary w-full"
            >
              {inviteMutation.isPending ? 'Sending…' : 'Send invitation'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <strong>Roles:</strong>
              <br />
              <span className="font-medium text-gray-700">Member</span> — use the platform.
              <br />
              <span className="font-medium text-gray-700">Admin</span> — manage members &amp; settings.
            </p>
          </div>
        </div>

        {/* Member list */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Members{!isLoading && ` (${members.length})`}
            </h2>
          </div>
          <TeamMemberList
            members={members}
            currentUserId={user?.id}
            loading={isLoading}
            onRemove={(m) => {
              if (window.confirm(`Remove ${m.name || m.email} from the team?`)) {
                removeMutation.mutate(m.id);
              }
            }}
            onChangeRole={(m, role) => changeRoleMutation.mutate({ id: m.id, role })}
          />
        </div>
      </div>
    </div>
  );
}
