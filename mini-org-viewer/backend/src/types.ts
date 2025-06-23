export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'ADMIN' | 'TEAM_LEAD' | 'MEMBER';
  team_id?: string;
  reports_to?: string;
  join_date: string;
  is_active: boolean;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  team_lead_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeavePolicy {
  id: string;
  sick_leave: number;
  casual_leave: number;
  work_from_home: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: 'SICK' | 'CASUAL' | 'WFH';
  start_date: string;
  end_date: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  team_id?: string;
  reports_to?: string;
}

// Public user type without sensitive fields
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: string;
  team_id?: string;
  reports_to?: string;
  join_date: string;
  is_active: boolean;
  profile_picture?: string;
}

// User with team name for list responses
export interface UserWithTeamName extends PublicUser {
  team_name?: string;
}

// Team with additional details for responses
export interface TeamWithDetails {
  id: string;
  name: string;
  description?: string;
  team_lead_id: string;
  team_lead_name?: string;
  member_count: number;
  is_active: boolean;
  created_at: string;
}

// Team member info for hierarchy
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  reports_to?: string;
  join_date: string;
}

// Team with members for detailed responses
export interface TeamWithMembers {
  team: {
    id: string;
    name: string;
    description?: string;
  };
  members: TeamMember[];
}

// Organization hierarchy types
export interface HierarchyMember {
  id: string;
  name: string;
  email: string;
  reports_to?: string;
  reports: HierarchyMember[];
}

export interface TeamHierarchy {
  team_id: string;
  team_name: string;
  team_lead: {
    id: string;
    name: string;
    email: string;
    reports_to?: string;
  } | null;
  members: HierarchyMember[];
}

export interface OrganizationHierarchy {
  organization: {
    name: string;
    total_employees: number;
    total_teams: number;
  };
  hierarchy: TeamHierarchy[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 
