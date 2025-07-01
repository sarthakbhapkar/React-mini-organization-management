import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext.ts';
import { useEmployees } from '../../../hooks/useEmployees';
import { useDebounce } from '../../../hooks/useDebounce';
import { usePagination } from '../../../hooks/usePagination';
import type {Team} from "../../../types";

type EmployeesResponse = {
    success: boolean;
    data: Team[];
};

export function useUserForm() {
    const { user, token } = useAuth();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, totalPages, setPage, updateTotal } = usePagination();
    const { employees, loading, reFetch, total } = useEmployees(page, limit);

    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('ALL');
    const [teamOptions, setTeamOptions] = useState<{ id: string, name: string, lead_id: string, lead_name: string }[]>([]);

    useEffect(() => {
        if (!token) return;

        const fetchTeams = async () => {
            try {
                const res = await api.get<EmployeesResponse>('/api/teams', token);
                const teams = res.data.data;

                const formatted = teams
                    .filter((t: any) => t.is_active)
                    .map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        lead_id: t.team_lead_id,
                        lead_name: t.team_lead_name
                    }));

                setTeamOptions(formatted);
            } catch (err) {
                console.error('Failed to load team options', err);
            }
        };

        fetchTeams();
    }, [token]);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        is_active: true,
        reports_to:''
    });

    useEffect(() => {
        updateTotal(total);
    }, [total]);

    const filteredUsers = employees.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const handleOpenAdd = () => {
        setEditMode(false);
        setFormData({ id: '', name: '', email: '', password: '', role: 'MEMBER', is_active: true, reports_to: '' });
        setOpenDialog(true);
    };

    const handleEdit = (emp: any) => {
        setEditMode(true);
        setFormData({ ...emp, password: '', reports_to: emp.reports_to || '' });
        setOpenDialog(true);
        reFetch().then();
    };

    const initiateDeactivate = (id: string) => {
        setSelectedId(id);
        setDeactivateDialogOpen(true);
        reFetch();
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
                setError(null);
                await api.put(`/api/users/${id}`, data, token);

                if (data.reports_to) {
                    const teamId = teamOptions.find(t => t.lead_id === data.reports_to)?.id;

                    if (teamId) {
                        await api.post(`/api/teams/${teamId}/members`, {
                            user_id: id,
                            reports_to:data.reports_to
                        }, token);
                    }
                }
            } else {
                if (!data.name || !data.email || !data.password || !data.role) {
                    setError('All Fields are required');
                    return;
                }
                setError(null);
                await api.post('/api/users', data, token);
            }
            setOpenDialog(false);
            reFetch();
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Error saving employee:', err);
            setError('User with this email-id already exists');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDeactivate = async () => {
        if (!selectedId || !token) return;
        const employee = employees.find(emp => emp.id === selectedId);
        if (!employee) return;

        try {
            await api.put(`/api/users/${selectedId}`, { ...employee, is_active: false }, token);
            setDeactivateDialogOpen(false);
            setSelectedId(null);
            reFetch();
        } catch (err) {
            console.error('Failed to deactivate employee:', err);
        }
    };

    return {
        user,
        token,
        search,
        setSearch,
        debouncedSearch,
        page,
        limit,
        totalPages,
        setPage,
        employees,
        filteredUsers,
        loading,
        reFetch,
        openDialog,
        setOpenDialog,
        editMode,
        setEditMode,
        error,
        setError,
        openSnackbar,
        setOpenSnackbar,
        deactivateDialogOpen,
        setDeactivateDialogOpen,
        selectedId,
        setSelectedId,
        formData,
        setFormData,
        handleOpenAdd,
        handleEdit,
        initiateDeactivate,
        handleSubmit,
        handleDeactivate,
        selectedRole,
        setSelectedRole,
        teamOptions
    };
}
