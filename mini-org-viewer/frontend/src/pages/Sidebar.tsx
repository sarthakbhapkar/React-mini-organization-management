import { NavLink } from 'react-router-dom';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DataExplorationIcon from '@mui/icons-material/DataExploration';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

export const Sidebar = ({ role }: { role: 'MEMBER' | 'TEAM_LEAD' | 'ADMIN' }) => {
    const navItemStyles = {
        color: 'white',
        textTransform: 'none',
        '&.active': {
            backgroundColor: '#455A64',
            borderRadius: 1,
        },
        '&:hover': {
            backgroundColor: '#37474F',
        },
    };

    return (
        <List sx={{ width: {xs:160,sm:240}, backgroundColor: '#263238', minHeight: '170vh', color: 'white', position: 'fixed', zIndex: 1200}}>
            {role !== 'ADMIN' && (
                <ListItem disablePadding>
                    <ListItemButton component={NavLink} to="/team-members" sx={navItemStyles}>
                        <ListItemIcon sx={{ minWidth: 32, color: 'white' }}>
                            <GroupsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="View Team" />
                    </ListItemButton>
                </ListItem>
            )}

            <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/org-chart" sx={navItemStyles}>
                    <ListItemIcon sx={{ minWidth: 32, color: 'white' }}>
                        <TableChartIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View Org Chart" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/profile" sx={navItemStyles}>
                    <ListItemIcon sx={{ minWidth: 32, color: 'white' }}>
                        <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/leave-management" sx={navItemStyles}>
                    <ListItemIcon sx={{ minWidth: 32, color: 'white' }}>
                        <DataExplorationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Leave Management" />
                </ListItemButton>
            </ListItem>

            {role === 'ADMIN' && (
                <>
                    <ListItem disablePadding>
                        <ListItemButton component={NavLink} to="/users" sx={navItemStyles}>
                            <ListItemIcon sx={{ minWidth: 32, color: 'white' }}>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Manage Users" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={NavLink} to="/teams" sx={navItemStyles}>
                            <ListItemIcon sx={{ minWidth: 32, color: 'white' }}>
                                <GroupsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Manage Teams" />
                        </ListItemButton>
                    </ListItem>
                </>
            )}
        </List>
    );
};
