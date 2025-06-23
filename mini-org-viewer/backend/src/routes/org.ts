import express from 'express';
import { teams, users } from '../data';
import { authenticateToken, AuthRequest } from '../auth';
import { ApiResponse, OrganizationHierarchy, HierarchyMember } from '../types';

const router = express.Router();

// GET /api/org/hierarchy
router.get('/hierarchy', authenticateToken, (req: AuthRequest, res) => {
  const buildHierarchy = (teamId: string, managerId?: string): HierarchyMember[] => {
    // Find all users in the team who report to the given manager
    const directReports = users.filter(u => 
      u.team_id === teamId && 
      u.reports_to === managerId
    );
    
    return directReports.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      reports_to: member.reports_to,
      reports: buildHierarchy(teamId, member.id)
    }));
  };

  const hierarchy = teams.map(team => {
    const teamLead = users.find(u => u.id === team.team_lead_id);
    // Start building hierarchy from the team lead (who has no reports_to or reports to someone outside the team)
    const members = buildHierarchy(team.id, teamLead?.id);
    
    return {
      team_id: team.id,
      team_name: team.name,
      team_lead: teamLead ? {
        id: teamLead.id,
        name: teamLead.name,
        email: teamLead.email,
        reports_to: teamLead.reports_to
      } : null,
      members
    };
  });

  const totalEmployees = users.filter(u => u.is_active).length;
  const totalTeams = teams.filter(t => t.is_active).length;

  const response: ApiResponse<OrganizationHierarchy> = {
    success: true,
    data: {
      organization: {
        name: 'Tech Corp',
        total_employees: totalEmployees,
        total_teams: totalTeams
      },
      hierarchy
    }
  };

  res.json(response);
});

export default router; 