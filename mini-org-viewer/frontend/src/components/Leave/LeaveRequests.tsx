import React, {useEffect} from 'react';
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Pagination,
    Paper
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import {Sidebar} from "../../pages/Sidebar.tsx";
import Layout from '../../pages/Layout.tsx';
import {useLeaveRequest} from "../../hooks/useLeaveRequest.ts";
import {usePagination} from "../../hooks/usePagination.ts";

const LeaveRequests: React.FC = () => {
    const { user } = useAuth();
    const { requests, loading } = useLeaveRequest();
    const { page, limit, totalPages, setPage, updateTotal } = usePagination();

    useEffect(() => {
        updateTotal(requests.length);
    }, [requests]);

    const paginatedRequests = requests.slice((page - 1) * limit, page * limit);

    if (loading) return <p>Loading leave requests...</p>;

    if (!user) {
        return <Typography>You are not authorized to view this page.</Typography>;
    }

    return (
        <Layout>
        <Sidebar role={user.role}/>
        <Box sx={{ width:'100%', padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                All Leave Requests
            </Typography>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee ID</TableCell>
                                <TableCell>Leave Type</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Requested On</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRequests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.user_id}</TableCell>
                                    <TableCell>{req.leave_type}</TableCell>
                                    <TableCell>{req.start_date}</TableCell>
                                    <TableCell>{req.end_date}</TableCell>
                                    <TableCell>{req.reason}</TableCell>
                                    <TableCell>{req.status}</TableCell>
                                    <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
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

export default LeaveRequests;
