import {Sidebar} from "../../../pages/Sidebar.tsx";
import Layout from "../../../pages/Layout.tsx";
import {Box, Card, CardContent, Grid, Typography} from "@mui/material";
import {useLeaveBalance} from "../hooks/useLeaveBalance.ts";
import LeaveNavbar from "./LeaveNavBar.tsx";

export default function LeaveBalance() {

    const { user, loading, balance, policy } = useLeaveBalance();

    if (!user) return null;

    if (loading) {
        return <div>Loading leave balance...</div>;
    }

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{ width:'100%'}}>
                <LeaveNavbar />
                <Box sx={{ padding: 3 }}>
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
        </Box>
        </Layout>
    );
}
