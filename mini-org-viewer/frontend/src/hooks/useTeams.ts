import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type {Team} from '../types';

type EmployeesResponse = {
    success: boolean;
    data: Team[];
};

export function useTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.get<EmployeesResponse>('/api/teams', token);
            setTeams(res.data.data as Team[]);
        } catch (err) {
            setError('Failed to fetch teams: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams().then();
    }, []);

    return {
        teams,
        loading,
        error,
        refetch: fetchTeams,
    };
}
