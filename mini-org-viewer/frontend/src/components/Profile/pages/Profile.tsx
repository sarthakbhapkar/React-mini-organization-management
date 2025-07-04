import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { useProfileForm } from '../hook/useProfile.ts';
import { useLeaveBalance } from '../../Leave/hooks/useLeaveBalance.ts';
import { useTeams } from '../../../hooks/useTeams.ts';
import EditIcon from '@mui/icons-material/Edit';

const Profile: React.FC = () => {
    const {
        user,
        name,
        password,
        openSnackbar,
        setName,
        setPassword,
        error,
        setOpenSnackbar,
        handleUpdate,
    } = useProfileForm();
    const { balance } = useLeaveBalance();
    const { teams } = useTeams();

    const [editMode, setEditMode] = useState(false);

    if (!user) return null;
    const team = teams.find((t) => t.id === user.team_id);

    const handleClick = () => {
        handleUpdate();
        setEditMode(false);
    };

    const handleCancel = () => {
        setName(user.name);
        setPassword('');
        setEditMode(false);
    };

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                width: '100%',
                ml: { xs: 0, sm: 0 },
            }}
        >
            <Typography variant="h4" gutterBottom>
                <strong>Profile Overview</strong>
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 2, sm: 4 } }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                <strong>Team Details</strong>
                            </Typography>
                            {user.team_id ? (
                                <>
                                    <Typography sx={{ fontSize: 16 }}>
                                        <strong>Team ID:</strong> {user.team_id}
                                    </Typography>
                                    <Typography sx={{ mt: 1, fontSize: 16 }}>
                                        <strong>Team Name:</strong> {team?.name}
                                    </Typography>
                                </>
                            ) : (
                                <Typography>No team assigned</Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                <strong>Leave Summary</strong>
                            </Typography>
                            <Typography sx={{ fontSize: 16 }}>
                                <strong>Sick Leaves:</strong> {balance.sick_leave ?? '-'}
                            </Typography>
                            <Typography sx={{ fontSize: 16 }}>
                                <strong>Casual Leaves:</strong> {balance.casual_leave ?? '-'}
                            </Typography>
                            <Typography sx={{ fontSize: 16 }}>
                                <strong>WFH:</strong> {balance.work_from_home ?? '-'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                    <Card sx={{ height: '100%', width: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                <strong>Basic Info</strong>
                            </Typography>
                            {error && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            )}
                            <Typography sx={{ fontSize: 16 }}>
                                <strong>Name:</strong>{' '}
                                {editMode ? (
                                    <TextField
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{ mt: 1, maxWidth: { xs: '100%', sm: 400 } }}
                                    />
                                ) : (
                                    name
                                )}
                            </Typography>

                            <Typography sx={{ mt: 2, fontSize: 16 }}>
                                <strong>Email:</strong> {user.email}
                            </Typography>
                            <Typography sx={{ mt: 2, fontSize: 16 }}>
                                <strong>Role:</strong> {user.role}
                            </Typography>

                            {editMode && (
                                <TextField
                                    label="New Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    margin="normal"
                                    fullWidth
                                    size="small"
                                    sx={{ mt: 2, maxWidth: { xs: '100%', sm: 400 } }}
                                />
                            )}

                            <Box sx={{ mt: 3 }}>
                                {editMode ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            sx={{ mr: 2, backgroundColor: '#263238' }}
                                            onClick={handleClick}
                                        >
                                            Save
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        sx={{ backgroundColor: '#263238' }}
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="success">Profile Updated Successfully!</Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;