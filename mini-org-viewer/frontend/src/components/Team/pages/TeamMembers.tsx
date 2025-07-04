import React, { useState } from 'react';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import { useAuth } from '../../../context/AuthContext.ts';
import { useEmployees } from '../../../hooks/useEmployees.ts';
import DataTable, {type Column} from '../../DataTable';
import type {User} from "../../../types";

const TeamMembers: React.FC = () => {
    const { user } = useAuth();
    const { employees, loading } = useEmployees();

    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

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

    const teamMembers = employees.filter(
        (emp) => emp.team_id === user.team_id && emp.is_active
    );

    const totalPages = Math.ceil(teamMembers.length / itemsPerPage);
    const paginatedMembers = teamMembers.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const columns:Column<User>[] = [
        {
            label: 'Avatar',
            key: 'profile_picture',
            render: (member) => (
                <Avatar src={member.profile_picture || undefined}>
                    {member.name[0]}
                </Avatar>
            )
        },
        {
            label: 'Name',
            key: 'name'
        },
        {
            label: 'Email',
            key: 'email'
        },
        {
            label: 'Role',
            key: 'role'
        },
    ];

    return (
        <Box sx={{ width: '100%',p:{ md:5}, ml:{ xs:8, md:0, sm:0 } }}>

                <CardContent>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        Team Members
                    </Typography>
                    <DataTable
                        columns={columns}
                        rows={paginatedMembers}
                        loading={loading}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </CardContent>
        </Box>
    );
};

export default TeamMembers;
