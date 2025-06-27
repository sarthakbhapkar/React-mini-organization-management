import React, {useEffect} from 'react';
import {
    Box, Typography
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext.ts';
import {Sidebar} from "../../../pages/Sidebar.tsx";
import Layout from '../../../pages/Layout.tsx';
import {useLeaveRequest} from "../../../hooks/useLeaveRequest.ts";
import {usePagination} from "../../../hooks/usePagination.ts";
import DataTable from '../../DataTable.tsx';
import type { Column } from '../../DataTable.tsx';
import type { Leave } from '../../../types';
import LeaveNavbar from "./LeaveNavBar.tsx";

const LeaveRequests: React.FC = () => {
    const { user } = useAuth();
    const { requests, loading } = useLeaveRequest();
    const { page, limit, totalPages, setPage, updateTotal } = usePagination();

    useEffect(() => {
        updateTotal(requests.length);
    }, [requests]);

    const paginatedRequests = requests.slice((page - 1) * limit, page * limit);

    const columns: Column<Leave>[] = [
        { label: 'Employee ID', key: 'user_id' },
        { label: 'Leave Type', key: 'leave_type' },
        { label: 'Start Date', key: 'start_date' },
        { label: 'End Date', key: 'end_date' },
        { label: 'Reason', key: 'reason' },
        { label: 'Status', key: 'status' },
        {
            label: 'Requested On',
            key: 'created_at',
            render: (row) => new Date(row.created_at).toLocaleDateString()
        }
    ];

    if (loading) return <p>Loading leave requests...</p>;

    if (!user) {
        return <Typography>You are not authorized to view this page.</Typography>;
    }

    return (
        <Layout>
        <Sidebar role={user.role}/>
        <Box sx={{ width:'100%'}}>
            <LeaveNavbar />
            <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                All Leave Requests
            </Typography>

            <DataTable
                columns={columns}
                rows={paginatedRequests}
                loading={loading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
            </Box>
        </Box>
        </Layout>
    );
};

export default LeaveRequests;
