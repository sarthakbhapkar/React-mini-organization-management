import React, {useEffect} from 'react';
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
import {useAuth} from '../../context/AuthContext';
import {Sidebar} from '../../pages/Sidebar';
import Layout from '../../pages/Layout';
import {useEmployees} from '../../hooks/useEmployees';
import {useLeaveRequest} from '../../hooks/useLeaveRequest';
import {api} from "../../utils/api.ts";
import {usePagination} from "../../hooks/usePagination.ts";

const LeaveApproval: React.FC = () => {
    const {user, token} = useAuth();
    const {requests, loading, reFetch} = useLeaveRequest();
    const {employees} = useEmployees();
    const { page, limit, totalPages, setPage, updateTotal } = usePagination();

    useEffect(() => {
        updateTotal(relevantLeaves.length);
    }, [requests, employees]);

    if (!user) return null;

    const myTeamId = employees.find(e => e.id === user.id)?.team_id;

    const relevantLeaves = requests.filter(req => {
        if (user.role === 'ADMIN') {
            return req.status === 'PENDING';
        }

        if (user.role === 'TEAM_LEAD') {
            const requestUser = employees.find(e => e.id === req.user_id);
            return req.status === 'PENDING' && requestUser?.team_id === myTeamId;
        }

        return false;
    });

    const paginatedLeaves = relevantLeaves.slice((page - 1) * limit, page * limit);

    function handleApprove(id: string) {
        if (!token) return;
        return async () => {
            try {
                await api.put(`/api/leave/requests/${id}/approve`, {}, token);
                reFetch().then();
            } catch (error) {
                console.error('Error approving leave request:', error);
            }
        };
    }

    function handleReject(id: string) {
        if (!token) return;
        return async () => {
            try {
                await api.put(`/api/leave/requests/${id}/approve`, {}, token);
                reFetch().then();
            } catch (error) {
                console.error('Error approving leave request:', error);
            }
        };
    }

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
