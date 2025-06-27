import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Pagination,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {useEmployees} from '../../hooks/useEmployees';
import {Sidebar} from '../../pages/Sidebar';
import Layout from '../../pages/Layout';
import {useAuth} from '../../context/AuthContext';
import {api} from '../../utils/api';
import {useDebounce} from "../../hooks/useDebounce.ts";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {usePagination} from "../../hooks/usePagination";

const UserManagement: React.FC = () => {
    const {user, token} = useAuth();
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const debouncedSearch = useDebounce(search, 500);
    const {page, limit, totalPages, setPage, updateTotal} = usePagination();
    const {employees, loading, reFetch, total} = useEmployees(page, limit);
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        is_active: true
    });

    useEffect(() => {
        updateTotal(total);
    }, [total]);

    const filteredUsers = employees.filter(u =>
        u.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (!user) return null;

    const handleOpenAdd = () => {
        setEditMode(false);
        setFormData({id: '', name: '', email: '', password: '', role: 'MEMBER', is_active: true});
        setOpenDialog(true);
    };

    const handleEdit = (emp: any) => {
        setEditMode(true);
        setFormData({...emp, password: ''});
        setOpenDialog(true);
        reFetch().then();
    };

    const initiateDeactivate = (id: string) => {
        setSelectedId(id);
        setDeactivateDialogOpen(true);
        reFetch().then();
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
                await api.put(`/api/users/${id}`, data, token);
            } else {
                if (!data.name || !data.email || !data.password || !data.role) {
                    setError('All Fields are required');
                    return;
                }
                setError('');
                await api.post('/api/users', data, token);
            }
            setOpenDialog(false);
            reFetch().then();
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Error saving employee:', err);
            setError('User with this email-id already exists');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <Layout>
            <Sidebar role={user.role}/>
            <Box sx={{width: '100%', padding: 3, paddingTop: 1}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h4" gutterBottom sx={{mb: 2, ml: 2, mt: 2}}>User Management</Typography>
                    <Button color="secondary" variant="contained" startIcon={<PersonAddIcon/>} onClick={handleOpenAdd}
                            sx={{mb: 2, mt: 2, backgroundColor: '#263238'}}>New Employee</Button>
                </Box>
                <TextField
                    label="Search Users"
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
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map(emp => (
                                    <TableRow key={emp.id}>
                                        <TableCell>{emp.name}</TableCell>
                                        <TableCell>{emp.email}</TableCell>
                                        <TableCell>{emp.role}</TableCell>
                                        <TableCell align="center">{emp.is_active ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell align="center">
                                            <Button onClick={() => handleEdit(emp)} sx={{mr: 1}}
                                                    startIcon={<EditIcon/>}></Button>
                                            <Button color="error" onClick={() => initiateDeactivate(emp.id)}
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
                        User Updated Successfully!
                    </Alert>
                </Snackbar>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>{editMode ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
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
                            fullWidth margin="dense"
                            required
                        />
                        <TextField
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            fullWidth margin="dense"
                            disabled={editMode}
                            required
                        />
                        {!editMode && (
                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                fullWidth margin="dense"
                                required
                            />
                        )}
                        <TextField
                            select
                            label="Role"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            fullWidth margin="dense"
                            required
                        >
                            <MenuItem value="MEMBER">Member</MenuItem>
                            <MenuItem value="TEAM_LEAD">Team Lead</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </TextField>
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
                        <Typography>Are you sure you want to deactivate this employee?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeactivateDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                if (!selectedId || !token) return;
                                try {
                                    const employee = employees.find(emp => emp.id === selectedId);
                                    if (!employee) return;

                                    await api.put(`/api/users/${selectedId}`, {
                                        ...employee,
                                        is_active: false,
                                    }, token);

                                    setDeactivateDialogOpen(false);
                                    setSelectedId(null);
                                    reFetch().then();
                                } catch (err) {
                                    console.error('Failed to deactivate employee:', err);
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

export default UserManagement;
