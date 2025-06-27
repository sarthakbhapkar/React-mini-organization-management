import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { Leave } from '../types';
import { useAuth } from '../context/AuthContext.ts';

export function useLeaveRequest() {
    const { token } = useAuth();
    const [requests, setRequests] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    const LeaveReqs =  async () => {
        if (!token) return;
        api.get<{ data: Leave[] }>('/api/leave/requests', token)
            .then(res => setRequests(res.data.data))
            .catch(err => setError('Failed to fetch leave requests: ' + err.message))
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        LeaveReqs().then();
    }, []);

    return { requests, loading, error, reFetch: LeaveReqs };
}
