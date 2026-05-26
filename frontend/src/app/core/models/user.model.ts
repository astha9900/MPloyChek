export type UserRole = 'Admin' | 'General User';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email: string;
  department: string;
  phone: string;
  status: UserStatus;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}
