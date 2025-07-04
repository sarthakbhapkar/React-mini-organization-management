import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import LeaveNavbar from './LeaveNavBar.tsx';

const LeaveManagement: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Box sx={{ width: '100%'}}>
            <LeaveNavbar />
            <Box
                sx={{
                    minHeight: { xs: '70vh', sm: '80vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h4" sx={{ mr: { xs: 2, sm: 4 } }}>
                    Leave Management
                </Typography>
            </Box>
        </Box>
    );
};

export default LeaveManagement;