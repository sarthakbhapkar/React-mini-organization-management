import { useLeavePolicy } from '../../hooks/useLeavePolicy';
import { useLeaveRequest } from '../../hooks/useLeaveRequest';
import { useAuth } from '../../context/AuthContext';
import {Sidebar} from "../../pages/Sidebar.tsx";
import Layout from "../../pages/Layout.tsx";
import {Box, Card, CardContent, Grid, Typography} from "@mui/material";
import {calculateUsedLeaves} from "./utils/LeaveUtils.tsx";

export default function LeaveBalance() {

    const { user } = useAuth();
    const { policy, loading: loadingPolicy } = useLeavePolicy();
    const { requests, loading: loadingRequests} = useLeaveRequest();

    if (loadingPolicy || loadingRequests) {
        return <div>Loading leave balance...</div>;
    }

    const myRequests = requests.filter((req: { user_id: string; }) => req.user_id === user?.id);
    const used = calculateUsedLeaves(myRequests);

    const balance = {
        sick_leave: policy.sick_leave - used.SICK,
        casual_leave: policy.casual_leave - used.CASUAL,
        work_from_home: policy.work_from_home - used.WFH,
    };

    if(!user) return;
    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4">Available Leave Balance</Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid size={{xs: 12, sm: 4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Sick Leaves</Typography>
                            <Typography variant="h4">
                                {balance.sick_leave} / {policy.sick_leave}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Casual Leaves</Typography>
                            <Typography variant="h4">
                                {balance.casual_leave} / {policy.casual_leave}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, sm: 4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Work From Home</Typography>
                            <Typography variant="h4">{balance.work_from_home} / {policy.work_from_home}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
        </Layout>
    );
}
