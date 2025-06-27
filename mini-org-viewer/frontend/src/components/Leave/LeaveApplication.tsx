import React, {useState} from 'react';
import {Alert, Box, Button, MenuItem, Snackbar, TextField, Typography} from '@mui/material';
import {api} from '../../utils/api.ts';
import {useAuth} from "../../context/AuthContext.tsx";
import CenteredBox from "../CardDesign";
import type {LeaveFormState, LeaveType, PostLeaveRequest} from "../../types";
import {Sidebar} from "../../pages/Sidebar.tsx";
import Layout from "../../pages/Layout.tsx";
import {useLeaveRequest} from "../../hooks/useLeaveRequest.ts";
import {useLeavePolicy} from "../../hooks/useLeavePolicy.ts";
import {calculateUsedLeaves} from "./utils/LeaveUtils.tsx";

const leaveTypeToPolicyKey = {
    SICK: 'sick_leave',
    CASUAL: 'casual_leave',
    WFH: 'work_from_home'
} as const;

const LeaveApplication: React.FC = () => {
    const {user, token} = useAuth();
    const {policy} = useLeavePolicy();
    const {requests} = useLeaveRequest();
    const [error, setError] = useState<string | null>(null);
    const [leave, setLeave] = useState<LeaveFormState>({
        type: 'SICK',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const getAvailableBalance = (): number => {
        const used = calculateUsedLeaves(requests);
        const type = leave.type;

        const policyKey = leaveTypeToPolicyKey[type];
        const total = policy[policyKey];
        const usedDays = used[type];
        console.log(`Leave Type: ${type}, Total: ${total}, Used: ${usedDays}`);

        return total - usedDays;
    };

    const handleSubmit = async () => {
        if (!user || !token) {
            console.log('User or token not available');
            return;
        }

        if (!leave.startDate || !leave.endDate) {
            setError('Please select both Start and End dates.');
            return;
        }
        if (leave.startDate > leave.endDate) {
            setError('End date cannot be before Start date.');
            return;
        }

        const daysRequested =
            (new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) /
            (1000 * 60 * 60 * 24) + 1;

        const availableBalance = getAvailableBalance();

        if (daysRequested > availableBalance) {
            setError(`Not enough ${leave.type} leave balance. You have only ${availableBalance} day(s) left.`);
            return;
        }

        try {
            await api.post<PostLeaveRequest>('/api/leave/requests', {
                leave_type: leave.type,
                start_date: leave.startDate,
                end_date: leave.endDate,
                reason: leave.reason,
            }, token);

            setOpenSnackbar(true);
            setLeave({type: 'SICK', startDate: '', endDate: '', reason: ''});
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error)
                console.error('Leave request failed:', err.message);
            else
                console.error('Leave request failed:', err);
        }
    };

    const validateLeaveBalance = (type: LeaveType, start: string, end: string): string | null => {
        if (!start || !end) return null;

        const daysRequested =
            (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24) + 1;

        const available = getAvailableBalance();

        return daysRequested > available
            ? `Not enough ${type} leave balance.`
            : null;
    };

    if (!user) return null;
    const today = new Date().toISOString().split('T')[0];

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{flexGrow: 1}}>
                <CenteredBox>
                    <Typography variant="h4" gutterBottom>Apply for Leave</Typography>
                    {error && (
                        <Typography color="error" sx={{mt: 1}}>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        select
                        label="Leave Type"
                        value={leave.type}
                        onChange={(e) => {
                            const newType = e.target.value as LeaveType;
                            setLeave(prev => ({...prev, type: newType}));
                            const validationError = validateLeaveBalance(newType, leave.startDate, leave.endDate);
                            setError(validationError);
                        }}
                        fullWidth
                        margin="normal"
                        required
                    >
                        <MenuItem value="SICK">Sick Leave</MenuItem>
                        <MenuItem value="CASUAL">Casual Leave</MenuItem>
                        <MenuItem value="WFH">Work From Home</MenuItem>
                    </TextField>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={leave.startDate}
                        onChange={(e) => {
                            const newStart = e.target.value;
                            setLeave(prev => ({...prev, startDate: newStart}));
                            const validationError = validateLeaveBalance(leave.type, newStart, leave.endDate);
                            setError(validationError);
                        }}
                        fullWidth
                        margin="normal"
                        focused
                        required
                        slotProps={{
                            input: {
                                inputProps: {
                                    min: today
                                }
                            },
                        }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={leave.endDate}
                        onChange={(e) => {
                            const newEnd = e.target.value;
                            setLeave(prev => ({...prev, endDate: newEnd}));
                            const validationError = validateLeaveBalance(leave.type, leave.startDate, newEnd);
                            setError(validationError);
                        }}
                        fullWidth
                        margin="normal"
                        focused
                        required
                        slotProps={{
                            input: {
                                inputProps: {
                                    min: today
                                }
                            },
                        }}
                    />
                    <TextField
                        label="Reason"
                        value={leave.reason}
                        onChange={(e) => setLeave({...leave, reason: e.target.value})}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Button variant="contained" onClick={handleSubmit} sx={{mt: 2, backgroundColor: '#263238'}}>
                        Submit
                    </Button>

                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={() => setOpenSnackbar(false)}
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    >
                        <Alert severity="success">
                            Leave application submitted!
                        </Alert>
                    </Snackbar>
                </CenteredBox>
            </Box>
        </Layout>
    );
};

export default LeaveApplication;
