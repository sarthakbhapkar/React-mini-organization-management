import React from 'react';
import { Box } from '@mui/material';
import Navbar from './NavBar';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <Box sx={{ display: 'flex', pt: '64px', minHeight: '100vh' }}>
                {children}
            </Box>
        </>
    );
};

export default Layout;
