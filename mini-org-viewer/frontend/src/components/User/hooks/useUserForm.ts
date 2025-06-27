import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext.ts';
import { useEmployees } from '../../../hooks/useEmployees';
import { useDebounce } from '../../../hooks/useDebounce';
import { usePagination } from '../../../hooks/usePagination';

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

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        is_active: true,
    });

    useEffect(() => {
        updateTotal(total);
    }, [total]);

    const filteredUsers = employees.filter((u) =>
        u.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditMode(false);
        setFormData({ id: '', name: '', email: '', password: '', role: 'MEMBER', is_active: true });
        setOpenDialog(true);
    };

    const handleEdit = (emp: any) => {
        setEditMode(true);
        setFormData({ ...emp, password: '' });
        setOpenDialog(true);
        reFetch();
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
        handleDeactivate
    };
}
