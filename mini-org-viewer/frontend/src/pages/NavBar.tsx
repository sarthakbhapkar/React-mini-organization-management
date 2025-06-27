import React from 'react';
import {AppBar, Button, Toolbar, Typography} from '@mui/material';
import {useAuth} from '../context/AuthContext.ts';
import {useNavigate} from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';

const Navbar: React.FC = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();
    return (
        <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#37474F',}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                    onClick={() => navigate('/dashboard')}
                >
                    <BusinessIcon fontSize="small"/>
                    Mini Organization Viewer
                </Typography>

                <Button variant="outlined" color="inherit" onClick={logout} sx={{backgroundColor: '#263238'}}
                        startIcon={<LogoutIcon/>}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
