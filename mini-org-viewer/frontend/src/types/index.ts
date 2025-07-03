export interface Leave {
    id:string;
    user_id: string;
    employee_id: string;
    leave_type: 'SICK' | 'CASUAL' | 'WFH';
    start_date: string;
    end_date: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at: string;
}

export interface PostLeaveRequest {
    leave_type: 'SICK' | 'CASUAL' | 'WFH';
    start_date: string;
    end_date: string;
    reason: string;
}

export type LeaveFormState = {
    type: 'SICK' | 'CASUAL' | 'WFH';
    startDate: string;
    endDate: string;
    reason: string;
};

export interface LeavePolicyType {
    sick_leave: number;
    casual_leave: number;
    work_from_home: number;
    year: number;
}

export type LeaveType = 'SICK' | 'CASUAL' | 'WFH';

export type UserRole = 'ADMIN' | 'TEAM_LEAD' | 'MEMBER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    profile_picture?: string;
    team_id?: string;
    reports_to?: string;
    is_active: boolean;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
}

export interface TeamWithLead {
    team_id: string;
    team_name: string;
    team_lead: TeamMember | null;
    members: TeamMember[];
}

export interface Organization {
    name: string;
    total_employees: number;
    total_teams: number;
}

export interface OrgData {
    organization: Organization;
    hierarchy: TeamWithLead[];
}

export interface OrgApiResponse {
    success: boolean;
    data: OrgData;
}

export interface Team{
    id: string;
    name: string;
    description?: string;
    team_lead_id: string;
    is_active: boolean;
    team_lead_name: string;
    members: TeamMember[];
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

export interface LeaveFilter {
    status?: string;
    user_id?: string;
    leave_type?: string;
    start_date?: string;
    end_date?: string;
}


