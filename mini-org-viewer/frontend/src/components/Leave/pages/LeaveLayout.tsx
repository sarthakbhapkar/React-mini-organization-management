import React from 'react';
import { Outlet } from 'react-router-dom';
import LeaveNavbar from './LeaveNavBar';
import { Box } from '@mui/material';

const LeaveLayout: React.FC = () => {
    return (
        <Box
            sx={{
                width: '100%',
                ml: { xs: 0},
                overflow: 'auto',
            }}
        >
            <LeaveNavbar />
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default LeaveLayout;