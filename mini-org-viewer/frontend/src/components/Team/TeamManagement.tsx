import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Pagination,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import Layout from '../../pages/Layout';
import {Sidebar} from '../../pages/Sidebar';
import {useAuth} from '../../context/AuthContext';
import {useTeams} from '../../hooks/useTeams';
import {api} from '../../utils/api';
import {useEmployees} from '../../hooks/useEmployees';
import {useDebounce} from "../../hooks/useDebounce.ts";
import {usePagination} from '../../hooks/usePagination';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const TeamManagement: React.FC = () => {
    const {teams, loading, refetch} = useTeams();
    const {employees} = useEmployees();
    const {user, token} = useAuth();
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);
    const {page, limit, totalPages, setPage, updateTotal} = usePagination();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        team_lead_id: '',
        is_active: true,
    });

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) && t.is_active
    );

    useEffect(() => {
        updateTotal(filteredTeams.length);
    }, [filteredTeams]);

    const paginatedTeams = filteredTeams.slice((page - 1) * limit, page * limit);

    const handleOpenAdd = () => {
        setEditMode(false);
        setFormData({id: '', name: '', description: '', team_lead_id: '', is_active: true});
        setSelectedMembers([]);
        setOpenDialog(true);
    };

    const handleEdit = (team: any) => {
        setEditMode(true);
        setFormData(team);
        setSelectedMembers(team.members?.map((m: any) => m.id) || []);
        setOpenDialog(true);
    };

    const initiateDeactivate = (id: string) => {
        setSelectedId(id);
        setDeactivateDialogOpen(true);
        refetch().then();
    };

    const handleSubmit = async () => {
        if (!token) return;
        const {id, ...data} = formData;

        try {
            if (editMode) {
                if (!data.name) {
                    setError('Name Field Should not be empty');
                    return;
                }
                setError('');
                await api.put(`/api/teams/${id}`, data, token);
            } else {
                if (!data.name || !data.team_lead_id) {
                    setError('Team Name and Lead are required');
                    return;
                }
                setError('');
                await api.post('/api/teams', data, token);
            }
            setOpenDialog(false);
            await refetch();
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Error saving team:', err);
            setError('Something went wrong');
            setTimeout(() => setError(''), 3000);
        }
    };
    if (!user) return null;

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{width: '100%', padding: 3, paddingTop: 1}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h4" gutterBottom sx={{mb: 2, ml: 2, mt: 2}}>Team Management</Typography>
                    <Button color="secondary" variant="contained" startIcon={<GroupAddIcon/>} onClick={handleOpenAdd}
                            sx={{mb: 2, mt: 2, backgroundColor: '#263238'}}>New Team</Button>
                </Box>
                <TextField
                    label="Search Teams"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{width: '30%', ml: 2}}
                    margin="normal"
                />

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Team Lead</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedTeams.map(team => (
                                    <TableRow key={team.id}>
                                        <TableCell>{team.name}</TableCell>
                                        <TableCell>{team.description}</TableCell>
                                        <TableCell>{team.is_active ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell align="center">{team.team_lead_id}</TableCell>
                                        <TableCell align="center">
                                            <Button onClick={() => handleEdit(team)} startIcon={<EditIcon/>}></Button>
                                            <Button color="error" onClick={() => initiateDeactivate(team.id)}
                                                    startIcon={<DeleteIcon/>}></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                )}
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                >
                    <Alert severity="success">
                        Team Updated Successfully!
                    </Alert>
                </Snackbar>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>{editMode ? 'Edit Team' : 'Add Team'}</DialogTitle>
                    {error && (
                        <Typography color="error" sx={{mt: 1, ml: 2}}>
                            {error}
                        </Typography>
                    )}
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            fullWidth
                            margin="dense"
                            required
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            fullWidth
                            margin="dense"
                            multiline
                        />
                        <TextField
                            label="Team Lead ID"
                            value={formData.team_lead_id || ''}
                            onChange={(e) => setFormData({...formData, team_lead_id: e.target.value})}
                            fullWidth
                            margin="dense"
                            required
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Members</InputLabel>
                            <Select
                                multiple
                                value={selectedMembers}
                                onChange={(e) => setSelectedMembers(e.target.value as string[])}
                                input={<OutlinedInput label="Members"/>}
                                renderValue={(selected) =>
                                    selected.map(id => {
                                        const emp = employees.find(e => e.id === id);
                                        return emp?.name || id;
                                    }).join(', ')
                                }
                            >
                                {employees
                                    .filter(emp => emp.is_active)
                                    .map(emp => (
                                        <MenuItem key={emp.id} value={emp.id}>
                                            <Checkbox checked={selectedMembers.includes(emp.id)}/>
                                            <ListItemText primary={emp.name}/>
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{color: '#263238'}} onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button sx={{backgroundColor: '#263238'}} onClick={handleSubmit}
                                variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
                    <DialogTitle>Deactivate Employee</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to deactivate this team?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeactivateDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                if (!selectedId || !token) return;
                                try {
                                    const team = teams.find(team => team.id === selectedId);
                                    if (!team) return;

                                    await api.put(`/api/teams/${selectedId}`, {
                                        ...team,
                                        is_active: false,
                                    }, token);

                                    setDeactivateDialogOpen(false);
                                    setSelectedId(null);
                                    refetch().then();
                                } catch (err) {
                                    console.error('Failed to deactivate Team:', err);
                                }
                            }}
                            color="secondary"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default TeamManagement;
