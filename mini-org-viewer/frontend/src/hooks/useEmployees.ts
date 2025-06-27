import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { User } from '../types';

type EmployeesResponse = {
    success: boolean;
    data: User[];
    pagination:{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export function useEmployees(page?: number, limit?: number) {
    const [employees, setEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<null | string>(null);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (page && limit) {
                const res = await api.get<EmployeesResponse>(`/api/users?page=${page}&limit=${limit}`, token);
                setEmployees(res.data.data);
                setTotal(res.data.pagination.total);
            } else {
                const res = await api.get<EmployeesResponse>('/api/users', token);
                setEmployees(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch employees', err);
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees().then();
    }, [page, limit]);

    return {
        employees,
        loading,
        total,
        error,
        reFetch: fetchEmployees,
    };
}
