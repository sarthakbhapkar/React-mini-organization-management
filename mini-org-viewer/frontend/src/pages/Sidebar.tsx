import {Link} from 'react-router-dom';
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DataExplorationIcon from '@mui/icons-material/DataExploration';
import ApprovalIcon from '@mui/icons-material/Approval';
import PolicyIcon from '@mui/icons-material/Policy';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

export const Sidebar = ({role}: { role: 'MEMBER' | 'TEAM_LEAD' | 'ADMIN' }) => (
    <List sx={{width: 240, backgroundColor: '#263238', minHeight: '90vh', color: 'white'}}>
        {(role !== 'ADMIN') && (
            <>
                <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
                    <ListItemButton component={Link} to="/leave-apply">
                        <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                            <HolidayVillageIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Apply Leave"/>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
                    <ListItemButton component={Link} to="/leave-balance">
                        <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                            <AccountBalanceWalletIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Leave Balance"/>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
                    <ListItemButton component={Link} to="/team-members">
                        <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                            <GroupsIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="View Team"/>
                    </ListItemButton>
                </ListItem>
            </>
        )}

        <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
            <ListItemButton component={Link} to="/org-chart">
                <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                    <TableChartIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="View Org Chart"/>
            </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
            <ListItemButton component={Link} to="/profile">
                <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                    <AccountCircleIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Profile"/>
            </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
            <ListItemButton component={Link} to="/leave-requests">
                <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                    <DataExplorationIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Leave Requests"/>
            </ListItemButton>
        </ListItem>

        {(role === 'TEAM_LEAD') && (
            <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
                <ListItemButton component={Link} to="/leave-approval">
                    <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                        <ApprovalIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Leave Approvals"/>
                </ListItemButton>
            </ListItem>
        )}

        {role === 'ADMIN' && (
            <>
                <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
                    <ListItemButton component={Link} to="/leave-policies">
                        <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                            <PolicyIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Leave Policy"/>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
                    <ListItemButton component={Link} to="/users">
                        <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                            <PersonIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Manage Users"/>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{'&:hover': {backgroundColor: '#37474F'}}}>
                    <ListItemButton component={Link} to="/teams">
                        <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                            <GroupsIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Manage Teams"/>
                    </ListItemButton>
                </ListItem>
            </>
        )}
    </List>
);
