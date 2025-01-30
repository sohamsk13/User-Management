import React, { useState, useEffect } from 'react';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import { User, UserFormData } from './types/user';
import { Plus } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      const formattedUsers: User[] = data.map((user: any) => ({
        id: user.id,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        department: user.company.name,
        avatar: '',
      }));

      setUsers(prev => page === 1 ? formattedUsers : [...prev, ...formattedUsers]);
      setHasMore(formattedUsers.length === ITEMS_PER_PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleAddUser = async (userData: UserFormData) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to add user');

      const data = await response.json();
      const newUser: User = {
        ...userData,
        id: data.id,
        avatar: '',
      };

      setUsers([newUser, ...users]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const handleEditUser = async (userData: UserFormData) => {
    if (!editingUser) return;

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to update user');

      const updatedUser: User = {
        ...userData,
        id: editingUser.id,
        avatar: '',
      };

      setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
      setEditingUser(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-100">User Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add User
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/10 border border-red-900/20 text-red-500 px-4 py-3 rounded-lg relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700/50">
              <UserForm
                onSubmit={editingUser ? handleEditUser : handleAddUser}
                initialData={editingUser || undefined}
                isEditing={!!editingUser}
                onCancel={() => {
                  setShowForm(false);
                  setEditingUser(null);
                }}
              />
            </div>
          </div>
        )}

        <UserList
          users={users}
          onEdit={(user) => {
            setEditingUser(user);
            setShowForm(true);
          }}
          onDelete={handleDeleteUser}
          loading={loading}
          error={error}
        />

        {hasMore && !loading && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-6 py-3 bg-gray-800 text-gray-100 rounded-md hover:bg-gray-700 transition-colors border border-gray-700/50"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;