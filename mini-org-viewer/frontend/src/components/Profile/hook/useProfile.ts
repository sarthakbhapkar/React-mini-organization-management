import {useState} from 'react';
import {useAuth} from '../../../context/AuthContext.ts';
import {api} from '../../../utils/api';
import type {User} from "../../../types";

interface ApiResponse {
    success: boolean;
    data: User;
    message: string;
}

interface UserUpdatePayload {
    name: string;
    password?: string;
    role: string;
    is_active: boolean;
}

export const useProfileForm = () => {
    const {user, token, setUser} = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            const res = await api.put<UserUpdatePayload, ApiResponse>(`/api/users/${user.id}`, {
                name: name.trim(),
                password: password || undefined,
                role: user.role,
                is_active: true,
            }, token);

            setUser(res.data.data);

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
