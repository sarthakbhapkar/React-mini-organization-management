import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { LeavePolicyType } from '../types';
import { useAuth } from '../context/AuthContext';

export function useLeavePolicy() {
    const { token } = useAuth();
    const [policy, setPolicy] = useState<LeavePolicyType>({
        sick_leave: 0,
        casual_leave: 0,
        work_from_home: 0,
        year: new Date().getFullYear(),
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    const fetchPolicy = async () => {
        try {
            setLoading(true);
            const res = await api.get<{ data: LeavePolicyType }>('/api/leave/policies', token);
            setPolicy(res.data.data);
        } catch (err) {
            console.error('Failed to fetch leave policy:', err);
            setError('Failed to fetch leave policy');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicy().then();
    }, [token]);

    return { policy, setPolicy, loading, error, refetch: fetchPolicy };
}
