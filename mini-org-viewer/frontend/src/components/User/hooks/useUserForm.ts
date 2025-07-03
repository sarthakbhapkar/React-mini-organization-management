import {useEffect, useState} from 'react';
import {api} from '../../../utils/api';
import {useAuth} from '../../../context/AuthContext.ts';
import {useEmployees} from '../../../hooks/useEmployees';
import {useDebounce} from '../../../hooks/useDebounce';
import {usePagination} from '../../../hooks/usePagination';
import {useTeams} from "../../../hooks/useTeams.ts";
import type {Team, User} from "../../../types";

export function useUserForm() {
    const {user, token} = useAuth();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const {page, limit, totalPages, setPage, updateTotal} = usePagination();

    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('ALL');
    const [teamOptions, setTeamOptions] = useState<{
        id: string,
        name: string,
        lead_id: string,
        lead_name: string
    }[]>([]);
    const {employees, loading, reFetch, total} = useEmployees(page, limit, {
        search: debouncedSearch,
        role: selectedRole,
    });
    const {teams} = useTeams();
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        is_active: true,
        reports_to: ''
    });

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, selectedRole]);

    useEffect(() => {
        const formatted = teams
            .filter((t: Team) => t.is_active)
            .map((t: Team) => ({
                id: t.id,
                name: t.name,
                lead_id: t.team_lead_id,
                lead_name: t.team_lead_name
            }));

        setTeamOptions(formatted);
    }, [teams]);

    useEffect(() => {
        updateTotal(total);
    }, [total]);

    const handleOpenAdd = () => {
        setEditMode(false);
        setFormData({id: '', name: '', email: '', password: '', role: 'MEMBER', is_active: true, reports_to: ''});
        setOpenDialog(true);
    };

    const handleEdit = (emp: User) => {
        setEditMode(true);
        setFormData({...emp, password: '', reports_to: emp.reports_to || ''});
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
        const {id, ...data} = formData;
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
                            reports_to: data.reports_to
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
            await api.put(`/api/users/${selectedId}`, {...employee, is_active: false}, token);
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
