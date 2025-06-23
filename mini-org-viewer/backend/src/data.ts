import bcrypt from 'bcryptjs';
import { User, Team, LeavePolicy, LeaveRequest } from './types';

// In-memory database
export const users: User[] = [
  {
    id: 'admin_001',
    email: 'admin@company.com',
    name: 'Admin User',
    password_hash: bcrypt.hashSync('admin123', 10),
    role: 'ADMIN',
    join_date: '2023-12-01',
    is_active: true,
    profile_picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    created_at: '2023-12-01T00:00:00Z',
    updated_at: '2023-12-01T00:00:00Z'
  }
];

export const teams: Team[] = [];

export const leavePolicies: LeavePolicy[] = [];

export const leaveRequests: LeaveRequest[] = [];

// Helper functions to generate IDs
export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
}; 