import { useState } from 'react';
import { api } from '../../../utils/api';
import { useDebounce } from '../../../hooks/useDebounce';
import { usePagination } from '../../../hooks/usePagination';
import { useTeams } from '../../../hooks/useTeams';
import { useEmployees } from '../../../hooks/useEmployees';
import { useAuth } from '../../../context/AuthContext.ts';

export const useTeamForm = () => {
    const { user, token } = useAuth();
    const { teams, loading, refetch } = useTeams();
    const { employees } = useEmployees();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { page, limit, totalPages, setPage, updateTotal } = usePagination();
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        team_lead_id: '',
        is_active: true,
    });

    const filteredTeams = teams.filter((team) =>{
        const matchesSearch= team.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        const matchesStatus = selectedStatus === 'ALL' || (selectedStatus === 'ACTIVE' && team.is_active) || (selectedStatus === 'INACTIVE' && !team.is_active);
        return matchesSearch && matchesStatus;
    });

    const paginatedTeams = filteredTeams.slice((page - 1) * limit, page * limit);

    const handleOpenAdd = () => {
        setEditMode(false);
        setFormData({ id: '', name: '', description: '', team_lead_id: '', is_active: true });
        setSelectedMembers([]);
        setOpenDialog(true);
    };

    const handleEdit = (team: any) => {
        setEditMode(true);
        setFormData(team);
        setSelectedMembers(team.members?.map((m: any) => m.id) || []);
        setOpenDialog(true);
    };

    const handleSubmit = async () => {
        if (!token) return;
        const { id, ...data } = formData;

        try {
            if (editMode) {
                if (!data.name) {
                    setError('Name Field Should not be empty');
                    return;
                }
                await api.put(`/api/teams/${id}`, data, token);
            } else {
                if (!data.name || !data.team_lead_id) {
                    setError('Team Name and Lead are required');
                    return;
                }
                await api.post('/api/teams', data, token);
            }
            setError('');
            setOpenDialog(false);
            await refetch();
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Error saving team:', err);
            setError('Something went wrong');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeactivate = async () => {
        if (!selectedId || !token) return;
        try {
            const team = teams.find(team => team.id === selectedId);
            if (!team) return;

            await api.put(`/api/teams/${selectedId}`, {
                ...team,
                is_active: false,
            }, token);

            setDeactivateDialogOpen(false);
            setSelectedId(null);
            await refetch();
        } catch (err) {
            console.error('Failed to deactivate Team:', err);
        }
    };

    return {
        user,
        employees,
        teams,
        loading,
        search,
        setSearch,
        openDialog,
        setOpenDialog,
        editMode,
        setEditMode,
        selectedMembers,
        setSelectedMembers,
        formData,
        setFormData,
        handleOpenAdd,
        handleEdit,
        handleSubmit,
        handleDeactivate,
        deactivateDialogOpen,
        setDeactivateDialogOpen,
        selectedId,
        setSelectedId,
        error,
        setError,
        openSnackbar,
        setOpenSnackbar,
        page,
        limit,
        totalPages,
        setPage,
        updateTotal,
        paginatedTeams,
        filteredTeams,
        setSelectedStatus,
        selectedStatus
    };
};
