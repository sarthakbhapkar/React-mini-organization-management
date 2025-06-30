import React from 'react';
import {Alert, Box, Button, MenuItem, Snackbar, TextField, Typography} from '@mui/material';
import {useAuth} from "../../../context/AuthContext.ts";
import CenteredBox from "../../CardDesign.tsx";
import type {LeaveType} from "../../../types";
import {useLeaveForm} from "../hooks/useLeaveForm.ts";
import LeaveNavbar from "./LeaveNavBar.tsx";

const LeaveApplication: React.FC = () => {

    const { user } = useAuth();
    const {
        leave,
        setLeave,
        error,
        setError,
        openSnackbar,
        setOpenSnackbar,
        handleSubmit,
        validateLeaveBalance
    } = useLeaveForm();

    if (!user) return null;
    const today = new Date().toISOString().split('T')[0];

    return (
            <Box sx={{width: '100%'}}>
                <LeaveNavbar />
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
    );
};

export default LeaveApplication;
