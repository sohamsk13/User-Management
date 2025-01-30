export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  avatar: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
}