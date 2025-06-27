import React, {} from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.ts";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" />;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user && user.role === 'ADMIN' ? <>{children}</> : <Navigate to="/dashboard" />;
};

export const TeamLeadRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user && (user.role === 'ADMIN' || user.role === 'TEAM_LEAD') ? <>{children}</> : <Navigate to="/dashboard" />;
};