import {useEffect, useState} from 'react';
import {useAuth} from '../../../context/AuthContext.ts';
import {api} from '../../../utils/api';

export const useProfileForm = () => {
    const {user, token} = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.name) setName(user.name);
    }, [user?.name]);

    const handleUpdate = async () => {
        if (!user || !token) return;

        if (!name.trim()) {
            setError('Please enter the name');
            return;
        }

        if (password && (password.length < 8 || !/[!@#$%^&*]/.test(password))) {
            setError('Password must be at least 8 characters and contain a special character');
            return;
        }

        try {
            await api.put(`/api/users/${user.id}`, {
                name: name.trim(),
                password: password || undefined,
                role: user.role,
                is_active: true,
            }, token);
            setError(null);
            setOpenSnackbar(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Update Failed:', err.message);
            } else {
                console.error('Update Failed:', err);
            }
        }
    };

    return {
        user,
        name,
        password,
        openSnackbar,
        error,
        setName,
        setPassword,
        setOpenSnackbar,
        handleUpdate,
    };
};
