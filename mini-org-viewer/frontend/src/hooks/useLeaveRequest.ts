import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { Leave,LeaveFilter } from '../types';
import { useAuth } from '../context/AuthContext.ts';

export function useLeaveRequest(forBalance = false, filters: LeaveFilter = {}) {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    const fetchRequests = async () => {
        if (!token || !user) return;

        const query: string[] = [];

        if (forBalance) query.push(`user_id=${(user.id)}`);
        if (filters.status && filters.status !== 'ALL') query.push(`status=${(filters.status)}`);
        if (filters.leave_type && filters.leave_type !== 'ALL') query.push(`leave_type=${(filters.leave_type)}`);
        if (filters.start_date) query.push(`start_date=${(filters.start_date)}`);
        if (filters.end_date) query.push(`end_date=${(filters.end_date)}`);
        if (filters.user_id) query.push(`user_id=${(filters.user_id)}`);

        const url = `/api/leave/requests${query.length > 0 ? `?${query.join('&')}` : ''}`;

        try {
            const res = await api.get<{ data: Leave[] }>(url, token);
            setRequests(res.data.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError('Failed to fetch leave requests: ' + err.message);
            } else {
                setError('Failed to fetch leave requests');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [token, user?.id, filters.status, filters.leave_type, filters.start_date, filters.end_date]);

    return {
        requests,
        loading,
        error,
        reFetch: fetchRequests
    };
}