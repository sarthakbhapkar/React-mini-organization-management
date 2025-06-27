import React, {useState} from 'react';
import {Alert, Box, Button, Snackbar, TextField, Typography} from '@mui/material';
import {api} from '../../utils/api';
import {useAuth} from '../../context/AuthContext';
import {Sidebar} from "../../pages/Sidebar.tsx";
import Layout from "../../pages/Layout.tsx";
import CenteredBox from "../CardDesign.tsx";
import {useLeavePolicy} from "../../hooks/useLeavePolicy.ts";

const LeavePolicy: React.FC = () => {
    const {user, token} = useAuth();
    const { policy, setPolicy} = useLeavePolicy();

    const [snackOpen, setSnackOpen] = useState(false);

    const handleSave = async () => {
        try {
            await api.put('/api/leave/policies', policy, token);
            setSnackOpen(true);
        } catch (err) {
            console.error('Failed to update leave policy:', err);
        }
    };
    if (!user) return;

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{flexGrow: 1}}>
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
                            onChange={(e) => setPolicy({...policy, sick_leave: +e.target.value})}
                            required
                        />
                        <TextField
                            label="Casual Leave"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={policy.casual_leave}
                            onChange={(e) => setPolicy({...policy, casual_leave: +e.target.value})}
                            required
                        />
                        <TextField
                            label="Work From Home"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={policy.work_from_home}
                            onChange={(e) => setPolicy({...policy, work_from_home: +e.target.value})}
                            required
                        />
                        <TextField
                            label="Year"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={policy.year}
                            onChange={(e) => setPolicy({...policy, year: +e.target.value})}
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
