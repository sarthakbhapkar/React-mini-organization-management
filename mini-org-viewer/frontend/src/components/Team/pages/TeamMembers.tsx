import React from 'react';
import { Avatar, Box, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useAuth } from '../../../context/AuthContext.ts';
import { useEmployees } from '../../../hooks/useEmployees.ts';
import CenteredBox from '../../CardDesign.tsx';

const TeamMembers: React.FC = () => {
    const { user } = useAuth();
    const { employees } = useEmployees();

    if (!user) return null;

    if (!user.team_id) {
        return (
            <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
                <Card sx={{ maxWidth: { xs: '100%', sm: 600 }, mx: 'auto', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6">You are not assigned to any team.</Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    const teamMembers = employees.filter((emp) => emp.team_id === user.team_id && emp.is_active);

    return (
        <Box sx={{ width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
            <CenteredBox sx={{ maxWidth: { xs: '100%', sm: 600 }, mx: 'auto' }}>
                <CardContent sx={{ width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        {user.role === 'TEAM_LEAD' ? 'Your Team Members' : 'Your Teammates'}
                    </Typography>

                    {teamMembers.length > 0 ? (
                        <List>
                            {teamMembers.map((member) => (
                                <ListItem key={member.id}>
                                    <ListItemAvatar>
                                        <Avatar src={member.profile_picture || undefined}>{member.name[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={member.name} secondary={member.email} />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2">No team members found.</Typography>
                    )}
                </CardContent>
            </CenteredBox>
        </Box>
    );
};

export default TeamMembers;