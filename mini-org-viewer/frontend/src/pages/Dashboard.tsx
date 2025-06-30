import React from 'react';
import {Box, Card, CardContent, Grid, Typography} from '@mui/material';
import {useAuth} from "../context/AuthContext.ts";
import {useEmployees} from '../hooks/useEmployees.ts';
import {useTeams} from '../hooks/useTeams.ts';

const Dashboard: React.FC = () => {

    const {employees, loading: loadingEmp} = useEmployees();
    const {teams, loading: loadingTeams} = useTeams();
    const {user} = useAuth();

    if (!user) return null;

    return (
        <Box sx={{flexGrow: 1, p: 3}}>
            <Typography variant="h4" gutterBottom>
                Welcome, {user.name}
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{xs: 12, sm: 4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Employees</Typography>
                            <Typography variant="h4">
                                {loadingEmp ? 'Loading...' : employees.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Teams</Typography>
                            <Typography variant="h4">
                                {loadingTeams ? 'Loading...' : teams.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Card sx={{color: '#008080'}}>
                        <CardContent>
                            <Typography variant="h6">Good Afternoon {user.name}</Typography>
                            <Typography variant="h4">Have a productive day!</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;