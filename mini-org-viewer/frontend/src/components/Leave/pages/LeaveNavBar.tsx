import React from 'react';
import {AppBar, Button, Toolbar} from '@mui/material';
import {NavLink} from 'react-router-dom';
import {useAuth} from "../../../context/AuthContext.ts";

const LeaveNavbar: React.FC = () => {
    const {user} = useAuth();
    if (!user) return null;

    const navItems = [
        {label: 'Apply Leave', path: '/leave/leave-apply', roles: ['TEAM_LEAD', 'MEMBER']},
        {label: 'Leave Balance', path: '/leave/leave-balance', roles: ['TEAM_LEAD', 'MEMBER']},
        {label: 'Leave Requests', path: '/leave/leave-requests', roles: ['ADMIN', 'TEAM_LEAD', 'MEMBER']},
        {label: 'Leave Approvals', path: '/leave/leave-approval', roles: ['TEAM_LEAD']},
        {label: 'Leave Policy', path: '/leave/leave-policies', roles: ['ADMIN']}
    ];

    const visibleItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#37474F',
                borderBottom: '1px solid #ccc',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                width: '100%'
            }}
            elevation={0}
        >
            <Toolbar variant="dense" sx={{gap: 2}}>
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
                    >
                        {item.label}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default LeaveNavbar;
