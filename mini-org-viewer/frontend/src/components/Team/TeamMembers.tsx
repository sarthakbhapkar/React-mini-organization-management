import React from 'react';
import {Avatar, Box, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography,} from '@mui/material';
import {useAuth} from '../../context/AuthContext';
import {useEmployees} from '../../hooks/useEmployees';
import Layout from "../../pages/Layout.tsx";
import {Sidebar} from "../../pages/Sidebar.tsx";
import CenteredBox from "../CardDesign.tsx";

const TeamMembers: React.FC = () => {
    const {user} = useAuth();
    const {employees} = useEmployees();

    if (!user) return;

    if (!user.team_id) {
        return (
            <Card sx={{maxWidth: 600, margin: '1rem auto', boxShadow: 3}}>
                <CardContent>
                    <Typography variant="h6">You are not assigned to any team.</Typography>
                </CardContent>
            </Card>
        );
    }

    const teamMembers = employees.filter(
        (emp) => emp.team_id === user.team_id && emp.id !== user.id && emp.is_active
    );

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{flexGrow: 1}}>
                <CenteredBox>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {user.role === 'TEAM_LEAD' ? 'Your Team Members' : 'Your Teammates'}
                        </Typography>

                        {teamMembers.length > 0 ? (
                            <List>
                                {teamMembers.map((member) => (
                                    <ListItem key={member.id}>
                                        <ListItemAvatar>
                                            <Avatar src={member.profile_picture || undefined}>
                                                {member.name[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={member.name}
                                            secondary={member.email}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2">No team members found.</Typography>
                        )}
                    </CardContent>
                </CenteredBox>
            </Box>
        </Layout>
    );
};

export default TeamMembers;
