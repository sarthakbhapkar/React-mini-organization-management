import React, {useEffect, useState} from 'react';
import {Box, MenuItem, TextField, Typography} from '@mui/material';
import {useAuth} from '../../../context/AuthContext.ts';
import {useLeaveRequest} from "../../../hooks/useLeaveRequest.ts";
import {usePagination} from "../../../hooks/usePagination.ts";
import type {Column} from '../../DataTable.tsx';
import DataTable from '../../DataTable.tsx';
import type {Leave} from '../../../types';

const LeaveRequests: React.FC = () => {
    const {user} = useAuth();
    const {requests, loading} = useLeaveRequest();
    const {page, limit, totalPages, setPage, updateTotal} = usePagination();
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedType, setSelectedType] = useState('ALL');

    const filteredRequests = requests.filter((req) => {
        const statusMatch = selectedStatus === 'ALL' || req.status === selectedStatus;
        const typeMatch = selectedType === 'ALL' || req.leave_type === selectedType;
        return statusMatch && typeMatch;
    });

    const paginatedRequests = filteredRequests.slice((page - 1) * limit, page * limit);

    useEffect(() => {
        updateTotal(filteredRequests.length);
    }, [filteredRequests]);

    const columns: Column<Leave>[] = [
        {label: 'Employee ID', key: 'user_id'},
        {label: 'Leave Type', key: 'leave_type'},
        {label: 'Start Date', key: 'start_date'},
        {label: 'End Date', key: 'end_date'},
        {label: 'Reason', key: 'reason'},
        {
            label: 'Status',
            key: 'status',
            render: (row) => (
                <Box
                    sx={{
                        backgroundColor:
                            row.status === 'APPROVED'
                                ? '#C8E6C9'
                                : row.status === 'REJECTED'
                                    ? '#FFCDD2'
                                    : '#ECEFF1',
                        color: '#000',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        display: 'inline-block',
                        textAlign: 'center',
                        minWidth: 90,
                    }}
                >
                    {row.status}
                </Box>
            )
        },
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
        <Box sx={{width: '100%'}}>
            <Box sx={{padding: 2}}>
                <Typography variant="h4" gutterBottom>
                    Leave Requests
                </Typography>

                <Box sx={{display: 'flex', gap: 3, mb: 3, mt: 3}}>
                    <TextField
                        select
                        label="Filter by Status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        sx={{width: 200}}
                    >
                        <MenuItem value="ALL">All Status</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="APPROVED">Approved</MenuItem>
                        <MenuItem value="REJECTED">Rejected</MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="Filter by Leave Type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        sx={{width: 200}}
                    >
                        <MenuItem value="ALL">All Types</MenuItem>
                        <MenuItem value="SICK">Sick</MenuItem>
                        <MenuItem value="CASUAL">Casual</MenuItem>
                        <MenuItem value="WFH">Work From Home</MenuItem>
                    </TextField>
                </Box>

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
    );
};

export default LeaveRequests;
