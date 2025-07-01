import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { Leave } from '../types';
import { useAuth } from '../context/AuthContext.ts';

export function useLeaveRequest(forBalance = false) {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    const fetchRequests = async () => {
        if (!token || !user) return;

        let url = '/api/leave/requests';
        if (forBalance) {
            url += `?user_id=${user.id}`;
        }

        try {
            const res = await api.get<{ data: Leave[] }>(url, token);
            setRequests(res.data.data);
        } catch (err: any) {
            setError('Failed to fetch leave requests: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests().then();
    }, [token, user?.id]);

    return {
        requests,
        loading,
        error,
        reFetch: fetchRequests
    };
}
