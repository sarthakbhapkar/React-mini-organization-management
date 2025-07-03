import { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext.ts';
import type { User } from '../../../types';

export const useTeamMembers = (teamId: string | null) => {
    const { token } = useAuth();
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token || !teamId) return;

        const fetchMembers = async () => {
            setLoading(true);
            try {
                const res = await api.get<{ data: { members: User[] } }>(`/api/teams/${teamId}/members`, token);
                setMembers(res.data.data.members);
            } catch (err) {
                console.error('Failed to fetch team members:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [token, teamId]);

    return { members, loading };
};
