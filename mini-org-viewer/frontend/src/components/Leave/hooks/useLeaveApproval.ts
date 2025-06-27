import { useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext.ts';
import { useEmployees } from '../../../hooks/useEmployees';
import { useLeaveRequest } from '../../../hooks/useLeaveRequest';
import { usePagination } from '../../../hooks/usePagination';
import { api } from '../../../utils/api';

export const useLeaveApproval = () => {
    const { user, token } = useAuth();
    const { requests, loading, reFetch } = useLeaveRequest();
    const { employees } = useEmployees();
    const { page, limit, totalPages, setPage, updateTotal } = usePagination();

    const myTeamId = employees.find(e => e.id === user?.id)?.team_id;

    const relevantLeaves = useMemo(() => {
        if (!user) return [];

        return requests.filter(req => {
            if (user.role === 'ADMIN') {
                return req.status === 'PENDING';
            }
            if (user.role === 'TEAM_LEAD') {
                const requestUser = employees.find(e => e.id === req.user_id);
                return req.status === 'PENDING' && requestUser?.team_id === myTeamId;
            }
            return false;
        });
    }, [requests, employees, user]);

    const paginatedLeaves = useMemo(() => {
        return relevantLeaves.slice((page - 1) * limit, page * limit);
    }, [relevantLeaves, page, limit]);

    useEffect(() => {
        updateTotal(relevantLeaves.length);
    }, [relevantLeaves]);

    const handleApprove = (id: string) => {
        if (!token) return;
        return async () => {
            try {
                await api.put(`/api/leave/requests/${id}/approve`, {}, token);
                reFetch();
            } catch (error) {
                console.error('Error approving leave request:', error);
            }
        };
    };

    const handleReject = (id: string) => {
        if (!token) return;
        return async () => {
            try {
                await api.put(`/api/leave/requests/${id}/reject`, {}, token);
                reFetch();
            } catch (error) {
                console.error('Error rejecting leave request:', error);
            }
        };
    };

    return {
        loading,
        employees,
        paginatedLeaves,
        handleApprove,
        handleReject,
        page,
        totalPages,
        setPage,
        user,
    };
};
