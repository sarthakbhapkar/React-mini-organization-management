import express from 'express';
import bcrypt from 'bcryptjs';
import { users, teams, generateId, getCurrentTimestamp } from '../data';
import { authenticateToken, requireRole, AuthRequest } from '../auth';
import { ApiResponse, User, UserWithTeamName, PublicUser } from '../types';

const router = express.Router();

// GET /api/users
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  const { page = '1', limit = '5', search, team_id, role } = req.query;
  
  let filteredUsers = users.filter(user => {
    if (search && !user.name.toLowerCase().includes(search.toString().toLowerCase()) && 
        !user.email.toLowerCase().includes(search.toString().toLowerCase())) {
      return false;
    }
    if (team_id && user.team_id !== team_id) return false;
    if (role && user.role !== role) return false;
    return user.is_active;
  });

  const pageNum = parseInt(page.toString());
  const limitNum = parseInt(limit.toString());
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  const usersWithTeamNames = paginatedUsers.map(user => {
    const team = teams.find(t => t.id === user.team_id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      team_id: user.team_id,
      team_name: team?.name,
      reports_to: user.reports_to,
      join_date: user.join_date,
      is_active: user.is_active,
      profile_picture: user.profile_picture
    };
  });

  const response: ApiResponse<UserWithTeamName[]> = {
    success: true,
    data: usersWithTeamNames,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limitNum)
    }
  };

  res.json(response);
});

// POST /api/users (Admin Only)
router.post('/', authenticateToken, requireRole(['ADMIN']), (req: AuthRequest, res) => {
  const { email, name, password, role } = req.body;

  if (!email || !name || !password) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email, name, and password are required'
      }
    };
    return res.status(400).json(response);
  }

  if (role && !['TEAM_LEAD', 'MEMBER'].includes(role)) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid role'
      }
    };
    return res.status(400).json(response);
  }

  if (users.find(u => u.email === email)) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'DUPLICATE_EMAIL',
        message: 'Email already exists in system'
      }
    };
    return res.status(400).json(response);
  }

  const newUser: User = {
    id: generateId('user'),
    email,
    name,
    password_hash: bcrypt.hashSync(password, 10),
    role: role || 'MEMBER',
    reports_to: undefined,
    join_date: new Date().toISOString().split('T')[0],
    is_active: true,
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp()
  };

  users.push(newUser);

  const response: ApiResponse<PublicUser> = {
    success: true,
    data: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      team_id: newUser.team_id,
      reports_to: newUser.reports_to,
      join_date: newUser.join_date,
      is_active: newUser.is_active
    },
    message: 'User created successfully'
  };

  res.json(response);
});

// PUT /api/users/:id
router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, role, is_active, password } = req.body;

  const user = users.find(u => u.id === id);
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

  const isSelfEdit = user.id === req.user!.id;

  // If user is not admin, they can only update their own information
  if (req.user!.role !== 'ADMIN' && !isSelfEdit) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You can only update your own information'
      }
    };
    return res.status(403).json(response);
  }

  if (name) user.name = name;
  if (password) user.password_hash = bcrypt.hashSync(password, 10);
  if (!isSelfEdit) {
    if (role) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;
  }
  user.updated_at = getCurrentTimestamp();

  const response: ApiResponse<PublicUser> = {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      team_id: user.team_id,
      reports_to: user.reports_to,
      join_date: user.join_date,
      is_active: user.is_active
    },
    message: 'User updated successfully'
  };

  res.json(response);
});

export default router; 