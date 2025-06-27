import React from 'react';
import {
    Box,
    Button,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {Sidebar} from '../../../pages/Sidebar.tsx';
import Layout from '../../../pages/Layout.tsx';
import {useLeaveApproval} from "../hooks/useLeaveApproval.ts";

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

    if (!user) return null;

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{width: '100%', padding: 3}}>
                <Typography variant="h4" gutterBottom>
                    Leave Approvals
                </Typography>

                {loading ? (
                    <Typography>Loading leave requests...</Typography>
                ) : (
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>User</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedLeaves.map(leave => (
                                    <TableRow key={leave.id}>
                                        <TableCell>
                                            {employees.find(e => e.id === leave.user_id)?.name || leave.user_id}
                                        </TableCell>
                                        <TableCell>{leave.leave_type}</TableCell>
                                        <TableCell>{leave.start_date}</TableCell>
                                        <TableCell>{leave.end_date}</TableCell>
                                        <TableCell>{leave.reason}</TableCell>
                                        <TableCell>{leave.status}</TableCell>
                                        <TableCell align="center">
                                            {leave.status === 'PENDING' && (
                                                <>
                                                    <Button color="primary" size="small"
                                                            onClick={handleApprove(leave.id)}>
                                                        Approve
                                                    </Button>
                                                    <Button color="secondary" size="small"
                                                            onClick={handleReject(leave.id)}>
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                )}
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            </Box>
        </Layout>
    );
};

export default LeaveApproval;
