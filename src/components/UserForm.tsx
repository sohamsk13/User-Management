import React from 'react';
import { UserFormData } from '../types/user';
import { X } from 'lucide-react';

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
  isEditing: boolean;
  onCancel: () => void;
}

export function UserForm({ onSubmit, initialData, isEditing, onCancel }: UserFormProps) {
  const [formData, setFormData] = React.useState<UserFormData>(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: 'user',
      status: 'active',
    }
  );

  const [errors, setErrors] = React.useState<Partial<UserFormData>>({});

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Partial<UserFormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          {isEditing ? 'Edit User' : 'Add New User'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-100 transition-colors rounded-md hover:bg-gray-700/50"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.department && (
            <p className="mt-1 text-sm text-red-400">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' | 'manager' })}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            className="mt-1 block w-full rounded-md bg-gray-700/50 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="active">Active</option>
             <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );
}