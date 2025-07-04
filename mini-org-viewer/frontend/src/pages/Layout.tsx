import React from 'react';
import { Box } from '@mui/material';
import Navbar from './NavBar';

type LayoutProps = {
    children: React.ReactNode;
    onToggleSidebar: () => void;
};

const Layout: React.FC<LayoutProps> = ({ children, onToggleSidebar }) => {
    return (
        <>
            <Navbar onToggleSidebar={onToggleSidebar} />
            <Box sx={{ display: 'flex', pt: { xs: '56px', sm: '64px' }, minHeight: '100vh' }}>
                {children}
            </Box>
        </>
    );
};

export default Layout;