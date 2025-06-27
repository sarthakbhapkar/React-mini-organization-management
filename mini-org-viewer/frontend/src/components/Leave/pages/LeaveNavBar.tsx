import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import {useAuth} from "../../../context/AuthContext.ts";

const LeaveNavbar: React.FC = () => {
    const location = useLocation();
    const {user} = useAuth();
    if (!user) return null;

    const navItems = [
        { label: 'Apply Leave', path: '/leave-apply',roles: ['TEAM_LEAD', 'MEMBER']  },
        { label: 'Leave Balance', path: '/leave-balance',roles: ['TEAM_LEAD', 'MEMBER'] },
        { label: 'Leave Requests', path: '/leave-requests',roles: ['ADMIN', 'TEAM_LEAD', 'MEMBER'] },
        { label: 'Leave Approvals', path: '/leave-approval',roles: ['TEAM_LEAD'] },
        { label: 'Leave Policy', path: '/leave-policies',roles: ['ADMIN'] }
    ];

    const visibleItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <AppBar
            position="static"
            sx={{ backgroundColor: '#37474F', borderBottom: '1px solid #ccc' }}
            elevation={0}
        >
            <Toolbar variant="dense" sx={{ gap: 2 }}>
                {visibleItems.map((item) => (
                    <Button
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        sx={{
                            color: 'white',
                            '&.active': {
                                backgroundColor: '#263238',
                                borderRadius: 1,
                            },
                            textTransform: 'none',
                            '&:hover': {backgroundColor: '#263238'}
                        }}
                        className={location.pathname === item.path ? 'active' : ''}
                    >
                        {item.label}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default LeaveNavbar;
