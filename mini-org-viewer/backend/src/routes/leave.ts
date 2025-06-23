import express from 'express';
import { leavePolicies, leaveRequests, users, generateId, getCurrentTimestamp } from '../data';
import { authenticateToken, requireRole, AuthRequest } from '../auth';
import { ApiResponse, LeaveRequest, LeavePolicy } from '../types';

// Extended leave request type with user names for API responses
interface LeaveRequestWithNames extends LeaveRequest {
  user_name?: string;
  approved_by_name?: string;
}

const router = express.Router();

// GET /api/leave-policies
router.get('/policies', authenticateToken, (req: AuthRequest, res) => {
  const currentPolicy = leavePolicies[0] ?? null; // For simplicity, using the first policy
  
  const response: ApiResponse<LeavePolicy | null> = {
    success: true,
    data: currentPolicy
  };

  res.json(response);
});

// PUT /api/leave-policies (Admin Only)
router.put('/policies', authenticateToken, requireRole(['ADMIN']), (req: AuthRequest, res) => {
  const { sick_leave, casual_leave, work_from_home } = req.body;
  const currentYear = new Date().getFullYear();

  let policy = leavePolicies.find(p => p.year === currentYear);
  
  if (!policy) {
    // Create new policy if none exists
    policy = {
      id: generateId('policy'),
      sick_leave: sick_leave || 0,
      casual_leave: casual_leave || 0, 
      work_from_home: work_from_home || 0,
      year: currentYear,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };
    leavePolicies.push(policy);

    const response: ApiResponse<LeavePolicy> = {
      success: true,
      data: policy,
      message: 'Leave policy created successfully'
    };
    return res.json(response);
  }

  // Update existing policy
  if (sick_leave !== undefined) policy.sick_leave = sick_leave;
  if (casual_leave !== undefined) policy.casual_leave = casual_leave;
  if (work_from_home !== undefined) policy.work_from_home = work_from_home;
  policy.updated_at = getCurrentTimestamp();

  const response: ApiResponse<LeavePolicy> = {
    success: true,
    data: policy,
    message: 'Leave policy updated successfully'
  };

  res.json(response);
});

// POST /api/leave-requests
router.post('/requests', authenticateToken, (req: AuthRequest, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;

  if (!leave_type || !start_date || !end_date) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Leave type, start date, and end date are required'
      }
    };
    return res.status(400).json(response);
  }

  const newRequest: LeaveRequest = {
    id: generateId('leave'),
    user_id: req.user!.id,
    leave_type,
    start_date,
    end_date,
    reason,
    status: 'PENDING',
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp()
  };

  leaveRequests.push(newRequest);

  const response: ApiResponse<LeaveRequest> = {
    success: true,
    data: newRequest,
    message: 'Leave request submitted successfully'
  };

  res.json(response);
});

// GET /api/leave-requests
router.get('/requests', authenticateToken, (req: AuthRequest, res) => {
  const { status, user_id, start_date, end_date, leave_type } = req.query;
  
  let filteredRequests = leaveRequests.filter(request => {
    // Team leads can see requests from their team members, admins see all
    if (req.user!.role === 'MEMBER' && request.user_id !== req.user!.id) {
      return false;
    }
    if (req.user!.role === 'TEAM_LEAD') {
      const requestUser = users.find(u => u.id === request.user_id);
      if (requestUser && requestUser.team_id !== req.user!.team_id && request.user_id !== req.user!.id) {
        return false;
      }
    }
    
    if (status && request.status !== status) return false;
    if (user_id && request.user_id !== user_id) return false;
    if (leave_type && request.leave_type !== leave_type) return false;
    if (start_date && new Date(request.start_date) < new Date(start_date as string)) return false;
    if (end_date && new Date(request.end_date) > new Date(end_date as string)) return false;
    return true;
  });

  const requestsWithUserNames = filteredRequests.map(request => {
    const user = users.find(u => u.id === request.user_id);
    const approver = request.approved_by ? users.find(u => u.id === request.approved_by) : null;
    
    return {
      ...request,
      user_name: user?.name,
      approved_by_name: approver?.name
    };
  });

  const response: ApiResponse<LeaveRequestWithNames[]> = {
    success: true,
    data: requestsWithUserNames
  };

  res.json(response);
});

// PUT /api/leave-requests/:id/approve (Team Lead/Admin Only)
router.put('/requests/:id/approve', authenticateToken, requireRole(['ADMIN', 'TEAM_LEAD']), (req: AuthRequest, res) => {
  const { id } = req.params;

  const requestIndex = leaveRequests.findIndex(r => r.id === id);
  if (requestIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Leave request not found'
      }
    };
    return res.status(404).json(response);
  }

  const request = leaveRequests[requestIndex];
  
  // Team leads can only approve requests from their team
  if (req.user!.role === 'TEAM_LEAD') {
    const requestUser = users.find(u => u.id === request.user_id);
    if (requestUser && requestUser.team_id !== req.user!.team_id) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Can only approve requests from your team'
        }
      };
      return res.status(403).json(response);
    }
  }

  request.status = 'APPROVED';
  request.approved_by = req.user!.id;
  request.approved_at = getCurrentTimestamp();
  request.updated_at = getCurrentTimestamp();

  const user = users.find(u => u.id === request.user_id);
  const approver = users.find(u => u.id === req.user!.id);

  const response: ApiResponse<LeaveRequestWithNames> = {
    success: true,
    data: {
      ...request,
      user_name: user?.name,
      approved_by_name: approver?.name
    },
    message: 'Leave request approved'
  };

  res.json(response);
});

// PUT /api/leave-requests/:id/reject (Team Lead/Admin Only)
router.put('/requests/:id/reject', authenticateToken, requireRole(['ADMIN', 'TEAM_LEAD']), (req: AuthRequest, res) => {
  const { id } = req.params;

  const requestIndex = leaveRequests.findIndex(r => r.id === id);
  if (requestIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Leave request not found'
      }
    };
    return res.status(404).json(response);
  }

  const request = leaveRequests[requestIndex];
  
  // Team leads can only reject requests from their team
  if (req.user!.role === 'TEAM_LEAD') {
    const requestUser = users.find(u => u.id === request.user_id);
    if (requestUser && requestUser.team_id !== req.user!.team_id) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Can only reject requests from your team'
        }
      };
      return res.status(403).json(response);
    }
  }

  request.status = 'REJECTED';
  request.approved_by = req.user!.id;
  request.approved_at = getCurrentTimestamp();
  request.updated_at = getCurrentTimestamp();

  const approver = users.find(u => u.id === req.user!.id);

  const response: ApiResponse<LeaveRequestWithNames> = {
    success: true,
    data: {
      ...request,
      approved_by_name: approver?.name
    },
    message: 'Leave request rejected'
  };

  res.json(response);
});

export default router; 