import React from 'react';
import {
    Box,
    Button,
    Typography
} from '@mui/material';
import {Sidebar} from '../../../pages/Sidebar.tsx';
import Layout from '../../../pages/Layout.tsx';
import {useLeaveApproval} from "../hooks/useLeaveApproval.ts";
import DataTable, {type Column} from "../../DataTable.tsx";
import type {Leave} from "../../../types";
import LeaveNavbar from "./LeaveNavBar.tsx";

const LeaveApproval: React.FC = () => {
    const {
        user,
        employees,
        loading,
        paginatedLeaves,
        handleApprove,
        handleReject,
        page,
        totalPages,
        setPage,
    } = useLeaveApproval();

    const columns: Column<Leave>[] = [
        {
            label: 'User',
            key: 'user_id',
            render: (leave) =>
                employees.find(e => e.id === leave.user_id)?.name || leave.user_id
        },
        { label: 'Type', key: 'leave_type' },
        { label: 'Start Date', key: 'start_date' },
        { label: 'End Date', key: 'end_date' },
        { label: 'Reason', key: 'reason' },
        { label: 'Status', key: 'status' },
        {
            label: 'Actions',
            key: 'id',
            align: 'center',
            render: (leave) =>
                leave.status === 'PENDING' && (
                    <>
                        <Button color="primary" size="small" onClick={handleApprove(leave.id)}>
                            Approve
                        </Button>
                        <Button color="secondary" size="small" onClick={handleReject(leave.id)}>
                            Reject
                        </Button>
                    </>
                )
        }
    ];

    if (!user) return null;

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{ width:'100%'}}>
                <LeaveNavbar />
                <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Leave Approvals
                </Typography>
                <DataTable
                    columns={columns}
                    rows={paginatedLeaves}
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

export default LeaveApproval;
