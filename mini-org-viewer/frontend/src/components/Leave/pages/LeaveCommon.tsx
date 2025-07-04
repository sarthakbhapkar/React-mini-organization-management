import React from 'react';
import {Box, Button, MenuItem, TextField, Typography} from '@mui/material';
import type {Column} from '../../DataTable.tsx';
import DataTable from '../../DataTable.tsx';
import type {Leave} from '../../../types';
import {useLeaveManagement} from '../hooks/useLeaveManage.ts';

const LeaveManagement2: React.FC = () => {
    const {
        user,
        loading,
        page,
        totalPages,
        setPage,
        selectedStatus,
        selectedType,
        startDate,
        endDate,
        setSelectedStatus,
        setSelectedType,
        setStartDate,
        setEndDate,
        isApprover,
        requests,
        handleApprove,
        handleReject
    } = useLeaveManagement();

    const columns: Column<Leave>[] = [
        {label: 'User', key: 'user_name'},
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
                            row.status === 'APPROVED' ? '#C8E6C9' :
                                row.status === 'REJECTED' ? '#FFCDD2' : '#ECEFF1',
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
        ...(isApprover ? [{
            label: 'Actions',
            key: 'status',
            align: 'center',
            render: (leave: Leave) => {
                if (leave.status === 'PENDING') {
                    return (
                        <>
                            <Button color="primary" size="small" onClick={() => handleApprove(leave.id)}>
                                Approve
                            </Button>
                            <Button color="secondary" size="small" onClick={() => handleReject(leave.id)}>
                                Reject
                            </Button>
                        </>
                    );
                } else {
                    return '—';
                }
            }
        }] : [])
    ] as Column<Leave>[];

    if (!user) return <Typography>You are not authorized to view this page.</Typography>;

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{padding: 2}}>
                <Typography variant="h4" gutterBottom>
                    Leave Management
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

                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        slotProps={{
                            inputLabel: {shrink: true},
                        }}
                        sx={{width: 200}}
                    />

                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        slotProps={{
                            inputLabel: {shrink: true},
                        }}
                        sx={{width: 200}}
                    />
                </Box>

                <DataTable
                    columns={columns}
                    rows={requests}
                    loading={loading}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </Box>
        </Box>
    );
};

export default LeaveManagement2;