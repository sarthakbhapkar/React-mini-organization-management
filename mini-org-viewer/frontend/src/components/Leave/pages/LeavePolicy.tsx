import React from 'react';
import {Alert, Box, Button, Snackbar, TextField, Typography} from '@mui/material';
import {useAuth} from '../../../context/AuthContext.ts';
import {Sidebar} from "../../../pages/Sidebar.tsx";
import Layout from "../../../pages/Layout.tsx";
import CenteredBox from "../../CardDesign.tsx";
import {useLeavePolicyForm} from "../hooks/useLeavePolicyForm.ts";
import LeaveNavbar from "./LeaveNavBar.tsx";

const LeavePolicy: React.FC = () => {
    const { user } = useAuth();
    const {
        policy,
        handleChange,
        handleSave,
        snackOpen,
        setSnackOpen
    } = useLeavePolicyForm();

    if (!user) return null;

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{ width:'100%'}}>
                <LeaveNavbar />
                <CenteredBox>
                    <Typography variant="h5" gutterBottom>
                        Leave Policy Settings
                    </Typography>
                    <TextField
                        label="Sick Leave"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={policy.sick_leave}
                        onChange={(e) => handleChange('sick_leave',+e.target.value)}
                        required
                    />
                    <TextField
                        label="Casual Leave"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={policy.casual_leave}
                        onChange={(e) => handleChange('casual_leave', +e.target.value)}
                        required
                    />
                    <TextField
                        label="Work From Home"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={policy.work_from_home}
                        onChange={(e) => handleChange('work_from_home', +e.target.value)}
                        required
                    />
                    <TextField
                        label="Year"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={policy.year}
                        onChange={(e) => handleChange('year',+e.target.value)}
                        required
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleSave}
                        sx={{mt: 2, backgroundColor:'#263238'}}
                    >
                        Save Policy
                    </Button>

                    <Snackbar
                        open={snackOpen}
                        autoHideDuration={2000}
                        onClose={() => setSnackOpen(false)}
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    >
                        <Alert severity="success">
                            Leave Policy Updated!
                        </Alert>
                    </Snackbar>
                </CenteredBox>
            </Box>

        </Layout>
    );
};

export default LeavePolicy;
