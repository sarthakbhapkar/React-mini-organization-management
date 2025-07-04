import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.ts';
import { Sidebar } from './Sidebar.tsx';
import Layout from './Layout.tsx';
import {Box} from "@mui/material";

const MainLayout: React.FC = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (!user) return null;

    return (
        <Layout onToggleSidebar={toggleSidebar}>
            <Sidebar role={user.role} open={sidebarOpen} onToggle={toggleSidebar} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: { xs: 0, sm: '240px' },
                    width: { xs: '100%', sm: 'calc(100% - 240px)' },
                }}
            >
                <Outlet />
            </Box>
        </Layout>
    );
};

export default MainLayout;