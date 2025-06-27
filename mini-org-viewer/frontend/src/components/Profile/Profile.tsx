import React, {useState} from 'react';
import {Alert, Box, Button, Snackbar, TextField, Typography} from '@mui/material';
import {useAuth} from '../../context/AuthContext';
import CenteredBox from "../CardDesign.tsx";
import Layout from "../../pages/Layout.tsx";
import {api} from "../../utils/api.ts";
import {Sidebar} from "../../pages/Sidebar.tsx";

const Profile: React.FC = () => {
    const {user, token} = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async () => {
        if (!user || !token) return;

        if (!name) {
            setError('Please Enter the name');
            return;
        }

        if (password && (password.length < 8 || !/[!@#$%^&*]/.test(password))) {
            alert('Password must be at least 8 characters and contain a special character');
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
            if (err instanceof Error)
                console.error('Update Failed:', err.message);
            else
                console.error('Update Failed:', err);
        }
    };

    if (!user) return null;

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{flexGrow: 1}}>
                <CenteredBox>
                    <Typography variant="h4" gutterBottom>Profile</Typography>
                    {error && (
                        <Typography color="error" sx={{mt: 1}}>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Email"
                        value={user.email}
                        disabled
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button color="secondary" variant="contained" onClick={handleUpdate} sx={{mt: 2, backgroundColor:'#263238'}}>
                        Update Profile
                    </Button>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={() => setOpenSnackbar(false)}
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    >
                        <Alert severity="success">
                            Profile Updated Successfully!
                        </Alert>
                    </Snackbar>
                </CenteredBox>
            </Box>
        </Layout>
    );
};

export default Profile;