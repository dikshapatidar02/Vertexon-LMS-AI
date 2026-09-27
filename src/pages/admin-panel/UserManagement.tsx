import React, { useState } from 'react';
import { Search, UserCheck, ShieldCheck, UserX, Users } from 'lucide-react';
import { DEMO_USERS } from '../../utils/demoData';

interface DemoUserItem {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  is_active: boolean;
  joinedDate: string;
}

const INITIAL_USER_LIST: DemoUserItem[] = [
  {
    id: DEMO_USERS.student.id,
    full_name: DEMO_USERS.student.name,
    email: DEMO_USERS.student.email,
    role: 'student',
    is_active: true,
    joinedDate: '2026-01-15',
  },
  {
    id: DEMO_USERS.instructor.id,
    full_name: DEMO_USERS.instructor.name,
    email: DEMO_USERS.instructor.email,
    role: 'instructor',
    is_active: true,
    joinedDate: '2025-11-01',
  },
  {
    id: DEMO_USERS.admin.id,
    full_name: DEMO_USERS.admin.name,
    email: DEMO_USERS.admin.email,
    role: 'admin',
    is_active: true,
    joinedDate: '2025-09-01',
  },
  {
    id: 'u-4',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@example.edu',
    role: 'student',
    is_active: true,
    joinedDate: '2026-02-10',
  },
  {
    id: 'u-5',
    full_name: 'Dr. Michael Vance',
    email: 'm.vance@stanford.edu',
    role: 'instructor',
    is_active: true,
    joinedDate: '2025-10-15',
  },
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<DemoUserItem[]>(INITIAL_USER_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery.trim() ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateRole = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
    );
  };

  const handleToggleSuspend = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: !u.is_active } : u))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" /> Platform User Management
          </h1>
          <p className="text-xs text-slate-500">Manage learner roles, grant instructor access, and audit active user status.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search user or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-8 text-xs py-1.5 w-full sm:w-auto sm:min-w-[200px]"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-input text-xs py-1.5 w-full sm:w-auto font-medium"
          >
            <option value="All">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-200 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3.5 whitespace-nowrap">User Name</th>
              <th className="p-3.5 whitespace-nowrap">Email Address</th>
              <th className="p-3.5 whitespace-nowrap">Role</th>
              <th className="p-3.5 whitespace-nowrap">Status</th>
              <th className="p-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{u.full_name}</td>
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
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.is_active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800'
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
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {u.is_active ? 'Suspend' : 'Reactivate'}
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
