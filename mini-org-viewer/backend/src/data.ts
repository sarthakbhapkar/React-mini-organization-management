import bcrypt from 'bcryptjs';
import {LeavePolicy, LeaveRequest, Team, User} from './types';

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
    }, {
        id: 'tl1',
        email: 'tl@company.com',
        name: 'Team Lead',
        password_hash: bcrypt.hashSync('tl123', 10),
        role: 'TEAM_LEAD',
        join_date: '2023-12-01',
        team_id: "team-001",
        is_active: true,
        created_at: '2023-12-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z'
    }, {
        id: 'emp1',
        email: 'emp1@company.com',
        name: 'Emp 1',
        password_hash: bcrypt.hashSync('emp123', 10),
        role: 'MEMBER',
        team_id: "team-001",
        join_date: '2023-12-01',
        reports_to: 'tl1',
        is_active: true,
        created_at: '2023-12-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z'
    },
    {
        id: 'tl2',
        email: 'tl2@company.com',
        name: 'Team Lead',
        password_hash: bcrypt.hashSync('tl123', 10),
        role: 'TEAM_LEAD',
        join_date: '2023-12-01',
        team_id: "team-002",
        is_active: true,
        created_at: '2023-12-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z'
    }, {
        id: 'emp2',
        email: 'emp2@company.com',
        name: 'Emp 2',
        password_hash: bcrypt.hashSync('emp123', 10),
        role: 'MEMBER',
        team_id: "team-002",
        reports_to: 'tl2',
        join_date: '2023-12-01',
        is_active: true,
        created_at: '2023-12-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z'
    }
];

export const teams: Team[] = [
    {
        id: "team-001",
        name: "Engineering",
        description: "Responsible for core product development",
        team_lead_id: "tl1",
        is_active: true,
        created_at: "2024-12-01T10:00:00Z",
        updated_at: "2025-06-20T08:30:00Z"
    },
    {
        id: "team-002",
        name: "Design",
        description: "Handles UI/UX and branding",
        team_lead_id: "tl2",
        is_active: true,
        created_at: "2024-12-15T12:15:00Z",
        updated_at: "2025-06-18T09:45:00Z"
    },
    {
        id: "team-003",
        name: "Marketing",
        description: "Oversees marketing campaigns and social presence",
        team_lead_id: "emp-103",
        is_active: false,
        created_at: "2024-11-10T09:00:00Z",
        updated_at: "2025-01-10T10:00:00Z"
    },
    {
        id: "team-004",
        name: "HR",
        description: "Handles recruitment and employee welfare",
        team_lead_id: "emp-104",
        is_active: true,
        created_at: "2025-01-05T11:00:00Z",
        updated_at: "2025-05-22T14:25:00Z"
    },
    {
        id: "team-005",
        name: "Customer Success",
        description: "Supports client onboarding and retention",
        team_lead_id: "emp-105",
        is_active: true,
        created_at: "2025-03-20T13:30:00Z",
        updated_at: "2025-06-01T16:00:00Z"
    }
];


export const leavePolicies: LeavePolicy[] = [
    {
        id: '1',
        sick_leave: 10,
        casual_leave: 8,
        work_from_home: 12,
        year: 2025,
        created_at: '2025-01-01T09:00:00Z',
        updated_at: '2025-06-01T10:00:00Z'
    },
    {
        id: '2',
        sick_leave: 12,
        casual_leave: 10,
        work_from_home: 15,
        year: 2024,
        created_at: '2024-01-15T11:00:00Z',
        updated_at: '2024-05-20T15:30:00Z'
    },
    {
        id: '3',
        sick_leave: 8,
        casual_leave: 6,
        work_from_home: 10,
        year: 2023,
        created_at: '2023-02-20T13:45:00Z',
        updated_at: '2023-07-10T09:15:00Z'
    }
];


export const leaveRequests: LeaveRequest[] = [{
    id: '1',
    user_id: 'emp1',
    leave_type: 'SICK',
    start_date: '2025-06-01',
    end_date: '2025-06-05',
    reason: 'Flu',
    status: 'REJECTED',
    created_at: '2025-05-20T08:00:00Z',
    updated_at: '2025-05-20T08:00:00Z'
}, {
    id: '2',
    user_id: 'emp1',
    leave_type: 'CASUAL',
    start_date: '2025-07-01',
    end_date: '2025-07-03',
    reason: 'Family Trip',
    status: 'APPROVED',
    created_at: '2025-06-15T10:30:00Z',
    updated_at: '2025-06-16T11:00:00Z'
},{
    id: '3',
    user_id: 'tl1',
    leave_type: 'WFH',
    start_date: '2025-08-01',
    end_date: '2025-08-02',
    reason: 'Work from home request',
    status: 'PENDING',
    created_at: '2025-07-20T09:15:00Z',
    updated_at: '2025-07-20T09:15:00Z'
},{
    id: '4',
    user_id: 'emp2',
    leave_type: 'CASUAL',
    start_date: '2025-07-01',
    end_date: '2025-07-10',
    reason: 'Family Trip',
    status: 'PENDING',
    created_at: '2025-06-15T10:30:00Z',
    updated_at: '2025-06-16T11:00:00Z'
}];

// Helper functions to generate IDs
export const generateId = (prefix: string): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCurrentTimestamp = (): string => {
    return new Date().toISOString();
}; 