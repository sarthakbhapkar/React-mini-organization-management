import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext.ts';
import { useEmployees } from '../hooks/useEmployees.ts';
import { useTeams } from '../hooks/useTeams.ts';

const Dashboard: React.FC = () => {
    const { employees, loading: loadingEmp } = useEmployees();
    const { teams, loading: loadingTeams } = useTeams();
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Box sx={{ width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h4" gutterBottom sx={{ mb: { xs: 2, sm: 3 } }}>
                Welcome, {user.name}
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6">Total Employees</Typography>
                            <Typography variant="h4">
                                {loadingEmp ? 'Loading...' : employees.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6">Total Teams</Typography>
                            <Typography variant="h4">
                                {loadingTeams ? 'Loading...' : teams.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ color: '#008080', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6">Good Afternoon, {user.name}</Typography>
                            <Typography variant="h4">Have a productive day!</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;