import {useEffect, useState} from 'react';
import { useAuth } from '../../../context/AuthContext.ts';
import { useEmployees } from '../../../hooks/useEmployees';
import { useLeaveRequest } from '../../../hooks/useLeaveRequest';
import { usePagination } from '../../../hooks/usePagination';
import { api } from '../../../utils/api';
import type {Leave} from "../../../types";

export const useLeaveApproval = () => {
    const { user, token } = useAuth();
    const { requests, loading, reFetch } = useLeaveRequest();
    const { employees } = useEmployees();
    const { page, limit, totalPages, setPage, updateTotal } = usePagination();

    const [selectedType, setSelectedType] = useState('ALL');

    let relevantLeaves: Leave[] = [];
    if (user) {
        const myTeamId = employees.find(e => e.id === user?.id)?.team_id;

        relevantLeaves = requests.filter(req => {
            const typeMatch = selectedType === 'ALL' || req.leave_type === selectedType;

            if (user.role === 'ADMIN') {
                return req.status === 'PENDING' && typeMatch;
            }

            if (user.role === 'TEAM_LEAD') {
                const requestUser = employees.find(e => e.id === req.user_id);
                return req.status === 'PENDING' && requestUser?.team_id === myTeamId && typeMatch;
            }

            return false;
        });
    }

    const paginatedLeaves = relevantLeaves.slice((page - 1) * limit, page * limit);

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
        selectedType,
        setSelectedType
    };
};
