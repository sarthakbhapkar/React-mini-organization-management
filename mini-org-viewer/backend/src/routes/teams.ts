import express from 'express';
import { teams, users, generateId, getCurrentTimestamp } from '../data';
import { authenticateToken, requireRole, AuthRequest } from '../auth';
import { ApiResponse, Team, TeamWithDetails, TeamWithMembers } from '../types';

const router = express.Router();

// GET /api/teams
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  const teamsWithDetails = teams.map(team => {
    const teamLead = users.find(u => u.id === team.team_lead_id);
    const memberCount = users.filter(u => u.team_id === team.id).length;
    
    return {
      id: team.id,
      name: team.name,
      description: team.description,
      team_lead_id: team.team_lead_id,
      team_lead_name: teamLead?.name,
      member_count: memberCount,
      is_active: team.is_active,
      created_at: team.created_at
    };
  });

  const response: ApiResponse<TeamWithDetails[]> = {
    success: true,
    data: teamsWithDetails
  };

  res.json(response);
});

// POST /api/teams (Admin Only)
router.post('/', authenticateToken, requireRole(['ADMIN']), (req: AuthRequest, res) => {
  const { name, description, team_lead_id } = req.body;

  if (!name || !team_lead_id) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Name and team_lead_id are required'
      }
    };
    return res.status(400).json(response);
  }

  const teamLead = users.find(u => u.id === team_lead_id);
  if (!teamLead) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Team lead not found'
      }
    };
    return res.status(404).json(response);
  }

  const newTeam: Team = {
    id: generateId('team'),
    name,
    description,
    team_lead_id,
    is_active: true,
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp()
  };

  teams.push(newTeam);

  // Update team lead's role and team
  const teamLeadIndex = users.findIndex(u => u.id === team_lead_id);
  if (teamLeadIndex !== -1) {
    users[teamLeadIndex].role = 'TEAM_LEAD';
    users[teamLeadIndex].team_id = newTeam.id;
    users[teamLeadIndex].reports_to = undefined; // Team leads don't report to anyone within the team
    users[teamLeadIndex].updated_at = getCurrentTimestamp();
  }

  const response: ApiResponse<TeamWithDetails> = {
    success: true,
    data: {
      id: newTeam.id,
      name: newTeam.name,
      description: newTeam.description,
      team_lead_id: newTeam.team_lead_id,
      team_lead_name: teamLead.name,
      member_count: 1,
      is_active: newTeam.is_active,
      created_at: newTeam.created_at
    },
    message: 'Team created successfully'
  };

  res.json(response);
});

// PUT /api/teams/:id
router.put('/:id', authenticateToken, requireRole(['ADMIN']), (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, description, team_lead_id, is_active } = req.body;

  const team = teams.find(t => t.id === id);
  if (!team) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Team not found'
      }
    };
    return res.status(404).json(response);
  }

  if (name) team.name = name;
  if (description) team.description = description;
  if (team_lead_id) team.team_lead_id = team_lead_id;
  if (is_active !== undefined) team.is_active = is_active;
  team.updated_at = getCurrentTimestamp();

  const response: ApiResponse<TeamWithDetails> = {
    success: true,
    data: {
      id: team.id,
      name: team.name,
      description: team.description,
      team_lead_id: team.team_lead_id,
      team_lead_name: users.find(u => u.id === team.team_lead_id)?.name,
      member_count: users.filter(u => u.team_id === id).length,
      is_active: team.is_active,
      created_at: team.created_at
    },
    message: 'Team updated successfully'
  };

  res.json(response);
});

// GET /api/teams/:id/members
router.get('/:id/members', authenticateToken, (req: AuthRequest, res) => {
  const { id } = req.params;
  
  const team = teams.find(t => t.id === id);
  if (!team) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Team not found'
      }
    };
    return res.status(404).json(response);
  }

  const members = users
    .filter(u => u.team_id === id)
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      reports_to: u.reports_to,
      join_date: u.join_date
    }));

  const response: ApiResponse<TeamWithMembers> = {
    success: true,
    data: {
      team: {
        id: team.id,
        name: team.name,
        description: team.description
      },
      members
    }
  };

  res.json(response);
});

// POST /api/teams/:id/members (Admin or Team Lead)
router.post('/:id/members', authenticateToken, requireRole(['ADMIN']), (req: AuthRequest, res) => {
  const { id } = req.params;
  const { user_id, reports_to } = req.body;

  if (!user_id || !reports_to) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'user_id and reports_to are required'
      }
    };
    return res.status(400).json(response);
  }

  const team = teams.find(t => t.id === id);
  if (!team) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Team not found'
      }
    };
    return res.status(404).json(response);
  }

  const user = users.find(u => u.id === user_id);
  if (!user) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'User not found'
      }
    };
    return res.status(404).json(response);
  }

  // Check if user is already in this team
  if (user.team_id === id) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'User is already a member of this team'
      }
    };
    return res.status(400).json(response);
  }

  // Validate reports_to user exists and is in the same team
  const reportsToUser = users.find(u => u.id === reports_to);
  if (!reportsToUser) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'reports_to user not found'
      }
    };
    return res.status(404).json(response);
  }

  if (reportsToUser.team_id !== id) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'reports_to user must be in the same team'
      }
    };
    return res.status(400).json(response);
  }

  // Update user's team and reporting structure
  const userIndex = users.findIndex(u => u.id === user_id);
  if (userIndex !== -1) {
    users[userIndex].team_id = id;
    users[userIndex].reports_to = reports_to;
    users[userIndex].updated_at = getCurrentTimestamp();
  }

  const response: ApiResponse<{
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      team_id: string;
    };
    team: {
      id: string;
      name: string;
    };
  }> = {
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        team_id: user.team_id!
      },
      team: {
        id: team.id,
        name: team.name
      }
    },
    message: 'User added to team successfully'
  };

  res.json(response);
});

export default router; 