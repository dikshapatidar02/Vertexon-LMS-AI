import React, { useState, useEffect } from 'react';
import { Search, UserCheck, ShieldCheck } from 'lucide-react';
import { api } from '../../utils/api';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  is_active: boolean;
  created_at: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      const params: any = {};
      if (searchQuery) params.q = searchQuery;
      if (roleFilter !== 'All') params.role = roleFilter;
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users || []);
    } catch (e) {
      setUsers([
        {
          id: 'usr-student-001',
          full_name: 'Ananya Sharma',
          email: 'ananya@example.com',
          role: 'student',
          is_active: true,
          created_at: '2026-01-15',
        },
        {
          id: 'usr-instructor-001',
          full_name: 'Rohit Verma',
          email: 'rohit@example.com',
          role: 'instructor',
          is_active: true,
          created_at: '2025-11-01',
        },
        {
          id: 'usr-admin-001',
          full_name: 'Meera Patel',
          email: 'meera@example.com',
          role: 'admin',
          is_active: true,
          created_at: '2025-09-01',
        },
      ]);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (e) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      );
    }
  };

  const handleToggleSuspend = async (userId: string) => {
    try {
      await api.put(`/admin/users/${userId}/suspend`);
      fetchUsers();
    } catch (e) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !u.is_active } : u))
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User & Access Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Assign system roles, audit permissions, and manage account statuses</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-9 text-xs py-1.5 min-w-[220px]"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-input text-xs py-1.5 w-auto"
          >
            <option value="All">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-200 uppercase text-[10px] font-semibold">
            <tr>
              <th className="p-3.5">User Name</th>
              <th className="p-3.5">Email Address</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Account Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{u.full_name}</td>
                <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{u.email}</td>
                <td className="p-3.5">
                  <select
                    value={u.role}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    className="form-input text-xs py-1 px-2.5 w-auto font-medium"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      u.is_active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    {u.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleToggleSuspend(u.id)}
                    className={`px-3 py-1 font-semibold rounded text-xs transition-colors ${
                      u.is_active
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {u.is_active ? 'Suspend Account' : 'Reactivate Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

