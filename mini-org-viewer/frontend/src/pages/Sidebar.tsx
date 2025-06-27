import {Link} from 'react-router-dom';
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DataExplorationIcon from '@mui/icons-material/DataExploration';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

export const Sidebar = ({role}: { role: 'MEMBER' | 'TEAM_LEAD' | 'ADMIN' }) => (
    <List sx={{width: 240, backgroundColor: '#263238', minHeight: '90vh', color: 'white'}}>
        {(role !== 'ADMIN') && (
            <>
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
            <ListItemButton component={Link} to="/leave-management">
                <ListItemIcon sx={{minWidth: 32, color: 'white'}}>
                    <DataExplorationIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Leave Management"/>
            </ListItemButton>
        </ListItem>

        {role === 'ADMIN' && (
            <>
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
