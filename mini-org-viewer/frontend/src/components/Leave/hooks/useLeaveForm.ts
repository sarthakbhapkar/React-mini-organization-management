import {useState} from 'react';
import {calculateUsedLeaves, countWeekdays, isWeekend} from '../utils/LeaveUtils';
import type {LeaveFormState, LeaveType, PostLeaveRequest} from '../../../types';
import {api} from '../../../utils/api';
import {useLeaveRequest} from '../../../hooks/useLeaveRequest';
import {useLeavePolicy} from '../../../hooks/useLeavePolicy';
import {useAuth} from "../../../context/AuthContext.ts";
import {useNavigate} from 'react-router-dom';

const leaveTypeToPolicyKey = {
    SICK: 'sick_leave',
    CASUAL: 'casual_leave',
    WFH: 'work_from_home',
} as const;

export const useLeaveForm = () => {
    const {user, token} = useAuth();
    const {requests} = useLeaveRequest({user_id:user?.id});
    const {policy} = useLeavePolicy();
    const navigate = useNavigate();

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

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isWeekend(startDate) || isWeekend(endDate)) {
            return 'Cannot apply leave starting or ending on Saturday or Sunday.';
        }

        const daysRequested = countWeekdays(start, end);

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
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);

        if (startDate > endDate) {
            setError('End date cannot be before Start date.');
            return;
        }

        if (isWeekend(startDate) || isWeekend(endDate)) {
            setError('Cannot apply leave starting or ending on Saturday or Sunday.');
            return;
        }

        const daysRequested = countWeekdays(leave.startDate, leave.endDate);

        const availableBalance = getAvailableBalance();

        if (daysRequested > availableBalance) {
            setError(`Not enough ${leave.type} leave balance. You have only ${availableBalance} day(s) left.`);
            return;
        }

        const existingOverlap = requests.some(req => {
            const reqStart = new Date(req.start_date);
            const reqEnd = new Date(req.end_date);
            return (
                (startDate <= reqEnd && endDate >= reqStart) &&
                req.status !== 'REJECTED'
            );
        });

        if (existingOverlap) {
            setError('You already have a leave applied during the selected dates.');
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
            navigate('/leave/requests');
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
