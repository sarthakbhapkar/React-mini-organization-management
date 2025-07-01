import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import type {OrgApiResponse} from "../../../types";

export const useOrgChart = () => {
    const { token } = useAuth();
    const [orgData, setOrgData] = useState<OrgApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrgData = async () => {
        try {
            setLoading(true);
            const res = await api.get<OrgApiResponse>('/api/org/hierarchy', token);
            setOrgData(res.data);
            setError(null);
        } catch (err: unknown) {
            if(err instanceof Error) {
                setError(err.message || 'Failed to fetch organization hierarchy');
            }else
                setError('An unexpected error occurred while fetching organization hierarchy');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgData().then();
    }, []);

    return {
        orgData,
        loading,
        error,
        refresh: fetchOrgData,
    };
};
