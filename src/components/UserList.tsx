import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import { Edit2, Trash2, User as UserIcon, Search } from 'lucide-react';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  error: string | null;
}

export function UserList({ users, onEdit, onDelete, loading, error }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof User>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    // Assign a predefined createdAt timestamp to existing users
    const initializedUsers = users.map((user, index) => ({
      ...user,
      createdAt: user.createdAt || new Date().getTime() - (users.length - index) * 1000,
    }));
    setUserList(initializedUsers);
  }, [users]);

  const filteredUsers = userList
    .sort((a, b) => b.createdAt - a.createdAt) // New users appear first
    .filter(user => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/10 border border-red-900/20 text-red-500 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md bg-gray-800/50 border-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-md bg-gray-800/50 border-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md bg-gray-800/50 border-gray-700/50 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-200 hover:bg-gray-800/70"
          >
            <div className="p-6 flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <UserIcon size={24} className="text-blue-400" />
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-100">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50">
                        {user.department}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50'
                          : user.role === 'manager'
                          ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
                          : 'bg-green-900/30 text-green-400 border border-green-800/50'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                          : 'bg-red-900/30 text-red-400 border border-red-800/50'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50"
                      title="Edit user"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-md hover:bg-gray-700/50"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
