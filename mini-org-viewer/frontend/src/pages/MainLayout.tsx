import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.ts';
import { Sidebar } from './Sidebar.tsx';
import Layout from '../pages/Layout.tsx';

const MainLayout: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <Layout>
            <Sidebar role={user.role} />
            <Outlet />
        </Layout>
    );
};

export default MainLayout;
