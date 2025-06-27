import { useState } from 'react';
import { useLeavePolicy } from '../../../hooks/useLeavePolicy';
import { useAuth } from '../../../context/AuthContext.ts';
import { api } from '../../../utils/api';

export const useLeavePolicyForm = () => {
    const { policy, setPolicy } = useLeavePolicy();
    const { token } = useAuth();
    const [snackOpen, setSnackOpen] = useState(false);

    const handleChange = (key: keyof typeof policy, value: number) => {
        setPolicy({ ...policy, [key]: value });
    };

    const handleSave = async () => {
        try {
            await api.put('/api/leave/policies', policy, token);
            setSnackOpen(true);
        } catch (err) {
            console.error('Failed to update leave policy:', err);
        }
    };

    return {
        policy,
        handleChange,
        handleSave,
        snackOpen,
        setSnackOpen,
    };
};