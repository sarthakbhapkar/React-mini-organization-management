import React from 'react';
import {AppBar, Button, Toolbar, Typography, IconButton, Box} from '@mui/material';
import { useAuth } from '../context/AuthContext.ts';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery, useTheme } from '@mui/material';

type NavbarProps = {
    onToggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#37474F' }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isMobile && (
                        <IconButton onClick={onToggleSidebar} sx={{ color: 'white' }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        noWrap
                        component="div"
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: isMobile ? '0.9rem' : undefined,
                        }}
                        onClick={() => navigate('/dashboard')}
                    >
                        <BusinessIcon fontSize="small" />
                        Mini Organization Viewer
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleLogout}
                    sx={{
                        backgroundColor: '#263238',
                        fontSize: isMobile ? '0.5rem' : '0.875rem',
                        padding: isMobile ? '4px 8px' : '6px 12px',
                        minWidth: isMobile ? 'auto' : undefined
                    }}
                    startIcon={<LogoutIcon fontSize={isMobile ? 'small' : 'medium'}/>}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;