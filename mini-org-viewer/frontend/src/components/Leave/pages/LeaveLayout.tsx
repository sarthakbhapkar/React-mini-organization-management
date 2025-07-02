import React from 'react';
import {Outlet} from 'react-router-dom';
import LeaveNavbar from './LeaveNavBar';
import {Box} from '@mui/material';

const LeaveLayout: React.FC = () => {
    return (
        <Box
            sx={{
                width: '100%',
                ml: {
                    xs:'160px',
                    sm: '240px',
                },
                overflowX: 'hidden',
            }}
        >
            <LeaveNavbar/>
            <Box sx={{ p: { xs: 1, sm: 3 } }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default LeaveLayout;
