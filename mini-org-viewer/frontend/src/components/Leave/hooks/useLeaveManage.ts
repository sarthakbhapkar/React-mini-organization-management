import {useEffect, useState} from 'react';
import {useAuth} from '../../../context/AuthContext.ts';
import {useLeaveRequest} from '../../../hooks/useLeaveRequest.ts';
import {usePagination} from '../../../hooks/usePagination';
import {api} from '../../../utils/api';

export const useLeaveManagement = () => {
    const {user, token} = useAuth();
    const {page, limit, totalPages, setPage, updateTotal} = usePagination();

    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedType, setSelectedType] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const isApprover = user?.role === 'TEAM_LEAD';

    const {requests, loading, reFetch} = useLeaveRequest(false, {
        status: selectedStatus,
        leave_type: selectedType,
        start_date: startDate,
        end_date: endDate
    });

    const handleApprove = async (id: string) => {
        await api.put(`/api/leave/requests/${id}/approve`, {}, token);
        reFetch();
    };

    const handleReject = async (id: string) => {
        await api.put(`/api/leave/requests/${id}/reject`, {}, token);
        reFetch();
    };

    const paginatedRequests = requests.slice((page - 1) * limit, page * limit);

    useEffect(() => {
        updateTotal(requests.length);
    }, [requests]);

    return {
        user,
        loading,
        page,
        totalPages,
        setPage,
        selectedStatus,
        selectedType,
        startDate,
        endDate,
        setSelectedStatus,
        setSelectedType,
        setStartDate,
        setEndDate,
        isApprover,
        requests: paginatedRequests,
        handleApprove,
        handleReject,
    };
};