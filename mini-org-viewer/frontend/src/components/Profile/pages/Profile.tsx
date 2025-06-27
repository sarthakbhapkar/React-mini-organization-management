import React from 'react';
import {Alert, Box, Button, Snackbar, TextField, Typography} from '@mui/material';
import CenteredBox from "../../CardDesign.tsx";
import Layout from "../../../pages/Layout.tsx";
import {Sidebar} from "../../../pages/Sidebar.tsx";
import {useProfileForm} from "../hook/useProfile.ts";

const Profile: React.FC = () => {
    const {
        user,
        name,
        password,
        error,
        openSnackbar,
        setName,
        setPassword,
        setOpenSnackbar,
        handleUpdate
    } = useProfileForm();
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
                    <Button color="secondary" variant="contained" onClick={handleUpdate}
                            sx={{mt: 2, backgroundColor: '#263238'}}>
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