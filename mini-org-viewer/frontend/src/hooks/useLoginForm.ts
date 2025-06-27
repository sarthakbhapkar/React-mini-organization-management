import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.ts';

export function useLoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            await login(email, password);
            setSnackOpen(true);
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Login failed:', err.message);
                setErrorMsg('Invalid Username or Password');
            } else {
                console.error('Login Failed', err);
                setErrorMsg('Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        password,
        showPass,
        loading,
        errorMsg,
        snackOpen,
        setEmail,
        setPassword,
        setShowPass,
        setSnackOpen,
        handleSubmit,
    };
}
