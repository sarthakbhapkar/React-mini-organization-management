import {useState} from 'react';
import {calculateUsedLeaves} from '../utils/LeaveUtils';
import type {LeaveFormState, LeaveType, PostLeaveRequest} from '../../../types';
import {api} from '../../../utils/api';
import {useLeaveRequest} from '../../../hooks/useLeaveRequest';
import {useLeavePolicy} from '../../../hooks/useLeavePolicy';
import {useAuth} from "../../../context/AuthContext.ts";

const leaveTypeToPolicyKey = {
    SICK: 'sick_leave',
    CASUAL: 'casual_leave',
    WFH: 'work_from_home',
} as const;

export const useLeaveForm = () => {
    const {user, token} = useAuth();
    const {requests} = useLeaveRequest(true);
    const {policy} = useLeavePolicy();

    const [leave, setLeave] = useState<LeaveFormState>({
        type: 'SICK',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const getAvailableBalance = (): number => {
        const used = calculateUsedLeaves(requests);
        const type = leave.type;
        const policyKey = leaveTypeToPolicyKey[type];
        return policy[policyKey] - used[type];
    };

    const validateLeaveBalance = (type: LeaveType, start: string, end: string): string | null => {
        if (!start || !end) return null;

        const daysRequested =
            (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24) + 1;

        const available = getAvailableBalance();

        return daysRequested > available
            ? `Not enough ${type} leave balance.You have only ${available} day(s) left.`
            : null;
    };

    const handleSubmit = async () => {
        if (!user || !token) return;

        if (!leave.startDate || !leave.endDate) {
            setError('Please select both Start and End dates.');
            return;
        }

        if (leave.startDate > leave.endDate) {
            setError('End date cannot be before Start date.');
            return;
        }

        const daysRequested =
            (new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1;

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
            console.error('Leave request failed:', err);
        }
    };

    return {
        leave,
        setLeave,
        error,
        setError,
        openSnackbar,
        setOpenSnackbar,
        handleSubmit,
        validateLeaveBalance
    };
};
