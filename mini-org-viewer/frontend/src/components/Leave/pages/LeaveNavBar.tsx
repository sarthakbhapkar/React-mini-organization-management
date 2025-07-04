import React from 'react';
import { AppBar, Button, Toolbar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.ts';

const LeaveNavbar: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    const navItems = [
        { label: 'Apply Leave', path: '/leave/leave-apply', roles: ['TEAM_LEAD', 'MEMBER'] },
        { label: 'Leave Balance', path: '/leave/leave-balance', roles: ['TEAM_LEAD', 'MEMBER'] },
        { label: 'Leave Requests', path: '/leave/requests', roles: ['ADMIN', 'TEAM_LEAD', 'MEMBER'] },
        { label: 'Leave Policy', path: '/leave/leave-policies', roles: ['ADMIN'] },
    ];

    const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#37474F',
                borderBottom: '1px solid #ccc',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                width: '100%',
            }}
            elevation={0}
        >
            <Toolbar
                variant="dense"
                sx={{
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    py: { xs: 1, sm: 0.5 },
                }}
            >
                {visibleItems.map((item) => (
                    <Button
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        sx={{
                            color: 'white',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            px: { xs: 1, sm: 2 },
                            minWidth: { xs: 'auto', sm: 64 },
                            '&.active': {
                                backgroundColor: '#263238',
                                borderRadius: 1,
                            },
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#263238' },
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default LeaveNavbar;