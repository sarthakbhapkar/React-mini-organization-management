import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { User } from '../types';

type EmployeesResponse = {
    success: boolean;
    data: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export function useEmployees(page: number=1 ,limit:number=10, filters?: { search?: string; role?: string }) {
    const [employees, setEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<null | string>(null);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = '/api/users';

            const query: string[] = [];
            query.push(`page=${page}`);
            query.push(`limit=${limit}`)
            if (filters?.search) {
                query.push(`search=${encodeURIComponent(filters.search)}`);
            }
            if (filters?.role && filters.role !== 'ALL') {
                query.push(`role=${filters.role}`);
            }

            if (query.length > 0) {
                url += '?' + query.join('&');
            }

            const res = await api.get<EmployeesResponse>(url, token);
            setEmployees(res.data.data);
            if (res.data.pagination) {
                setTotal(res.data.pagination.total);
            }
        } catch (err) {
            console.error('Failed to fetch employees', err);
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [page, filters?.search, filters?.role]);

    return {
        employees,
        loading,
        total,
        error,
        reFetch: fetchEmployees,
    };
}
