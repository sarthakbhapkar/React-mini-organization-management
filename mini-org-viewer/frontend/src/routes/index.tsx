import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "../pages/Login.tsx";
import Dashboard from "../pages/Dashboard";
import LeaveApplication from "../components/Leave/pages/LeaveApplication.tsx";
import {ProtectedRoute, AdminRoute, TeamLeadRoute} from "./roles.tsx";
import Profile from "../components/Profile/pages/Profile.tsx";
import UserManagement from "../components/User/pages/UserManagement.tsx";
import TeamManagement from "../components/Team/pages/TeamManagement.tsx";
import LeaveApproval from "../components/Leave/pages/LeaveApproval.tsx";
import OrgChart from "../pages/OrgChart";
import LeaveRequests from "../components/Leave/pages/LeaveRequests.tsx";
import LeavePolicy from "../components/Leave/pages/LeavePolicy.tsx";
import LeaveBalance from "../components/Leave/pages/LeaveBalance.tsx";
import TeamMembers from "../components/Team/pages/TeamMembers.tsx";

const AppRoutes:React.FC=()=>{
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
            <Route path="/leave-apply" element={<ProtectedRoute><LeaveApplication /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
            <Route path="/users" element={<AdminRoute> <UserManagement /> </AdminRoute>} />
            <Route path="/teams" element={<AdminRoute> <TeamManagement/> </AdminRoute>} />
            <Route path="/leave-approval" element={<TeamLeadRoute> <LeaveApproval /> </TeamLeadRoute>} />
            <Route path="/org-chart" element={<ProtectedRoute> <OrgChart /> </ProtectedRoute>} />
            <Route path="/leave-requests" element={<ProtectedRoute> <LeaveRequests /> </ProtectedRoute>} />
            <Route path="/leave-policies" element={<AdminRoute> <LeavePolicy /> </AdminRoute>} />
            <Route path="/leave-balance" element={<ProtectedRoute> <LeaveBalance /> </ProtectedRoute>} />
            <Route path="/team-members" element={<ProtectedRoute><TeamMembers/> </ProtectedRoute>}/>
            <Route path="*" element={<Navigate to='/dashboard'/>} />
        </Routes>
    );
}

export default AppRoutes;