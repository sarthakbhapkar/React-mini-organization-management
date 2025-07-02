import React from 'react';
import {Box, Button, MenuItem, TextField, Typography} from '@mui/material';
import {useLeaveApproval} from "../hooks/useLeaveApproval.ts";
import DataTable, {type Column} from "../../DataTable.tsx";
import type {Leave} from "../../../types";

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
        setSelectedType,
        selectedType,
    } = useLeaveApproval();

    const columns: Column<Leave>[] = [
        {
            label: 'User',
            key: 'user_id',
            render: (leave) =>
                employees.find(e => e.id === leave.user_id)?.name || leave.user_id
        },
        {label: 'Type', key: 'leave_type'},
        {label: 'Start Date', key: 'start_date'},
        {label: 'End Date', key: 'end_date'},
        {label: 'Reason', key: 'reason'},
        {label: 'Status', key: 'status'},
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
        <Box sx={{width: '100%'}}>
            <Box sx={{padding: 2}}>
                <Typography variant="h4" gutterBottom>
                    Leave Approvals
                </Typography>
                <Box sx={{display: 'flex', gap: 3, mb: 3, mt: 3}}>
                    <TextField
                        select
                        label="Filter by Leave Type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        sx={{width: 200}}
                        size="small"
                    >
                        <MenuItem value="ALL">All</MenuItem>
                        <MenuItem value="SICK">Sick</MenuItem>
                        <MenuItem value="CASUAL">Casual</MenuItem>
                        <MenuItem value="WFH">Work From Home</MenuItem>
                    </TextField>
                </Box>

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
    );
};

export default LeaveApproval;
