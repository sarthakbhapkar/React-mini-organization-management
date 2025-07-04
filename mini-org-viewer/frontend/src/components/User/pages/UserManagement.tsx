import React from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useUserForm } from '../hooks/useUserForm.ts';
import DataTable from '../../DataTable';
import type { User } from '../../../types';
import type { Column } from '../../DataTable.tsx';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const UserManagement: React.FC = () => {
    const {
        user,
        loading,
        search,
        setSearch,
        openDialog,
        setOpenDialog,
        editMode,
        formData,
        setFormData,
        deactivateDialogOpen,
        setDeactivateDialogOpen,
        setSelectedId,
        handleOpenAdd,
        handleEdit,
        handleSubmit,
        handleDeactivate,
        page,
        totalPages,
        setPage,
        openSnackbar,
        setOpenSnackbar,
        error,
        selectedRole,
        setSelectedRole,
        teamOptions,
        employees,
    } = useUserForm();

    const columns: Column<User>[] = [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role' },
        {
            label: 'Status',
            key: 'is_active',
            align: 'center',
            render: (emp) => (emp.is_active ? 'Active' : 'Inactive'),
        },
        {
            label: 'Actions',
            key: 'id',
            align: 'center',
            render: (emp) => (
                <Box display="flex" justifyContent="center" alignItems="center" gap={{ xs: 1, sm: 4 }}>
                    <IconButton onClick={() => handleEdit(emp)} size="small" color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedId(emp.id);
                            setDeactivateDialogOpen(true);
                        }}
                        color="error"
                        size="small"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    if (!user) return null;

    return (
        <Box sx={{ width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ mb: { xs: 1, sm: 2 }, mt: { xs: 1, sm: 2 } }}>
                    User Management
                </Typography>
                <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ backgroundColor: '#263238', mb: { xs: 1, sm: 2 }, mt: { xs: 1, sm: 2 } }}
                >
                    New Employee
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2, ml: 2 }}>
                <TextField
                    label="Search Users"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ maxWidth: { xs: '100%', sm: 300 } }}
                />
                <TextField
                    select
                    label="Filter by Role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ maxWidth: { xs: '100%', sm: 200 } }}
                >
                    <MenuItem value="ALL">All Roles</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="TEAM_LEAD">Team Lead</MenuItem>
                    <MenuItem value="MEMBER">Member</MenuItem>
                </TextField>
            </Box>

            <DataTable
                columns={columns}
                rows={employees}
                loading={loading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="success">User Updated Successfully!</Alert>
            </Snackbar>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
                {error && (
                    <Typography color="error" sx={{ mt: 1, mx: 2 }}>
                        {error}
                    </Typography>
                )}
                <DialogContent>
                    <TextField
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                        margin="dense"
                        required
                    />
                    <TextField
                        label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        fullWidth
                        margin="dense"
                        disabled={editMode}
                        required
                    />
                    {!editMode && (
                        <TextField
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            fullWidth
                            margin="dense"
                            required
                        />
                    )}
                    <TextField
                        select
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        fullWidth
                        margin="dense"
                        required
                    >
                        <MenuItem value="MEMBER">Member</MenuItem>
                        <MenuItem value="TEAM_LEAD">Team Lead</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                    </TextField>

                    {editMode && formData.role === 'MEMBER' && (
                        <TextField
                            select
                            label="Reports To (Team Lead)"
                            value={formData.reports_to}
                            onChange={(e) => setFormData({ ...formData, reports_to: e.target.value })}
                            fullWidth
                            margin="dense"
                        >
                            {teamOptions.map((team) => (
                                <MenuItem key={team.lead_id} value={team.lead_id}>
                                    {team.name} — {team.lead_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: '#263238' }} onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button sx={{ backgroundColor: '#263238' }} onClick={handleSubmit} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deactivateDialogOpen}
                onClose={() => setDeactivateDialogOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Deactivate Employee</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to deactivate this employee?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeactivateDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeactivate} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;