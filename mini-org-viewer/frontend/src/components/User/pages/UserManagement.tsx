import React from 'react';
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Snackbar,
    TextField, Typography
} from '@mui/material';
import { Sidebar } from '../../../pages/Sidebar.tsx';
import Layout from '../../../pages/Layout.tsx';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useUserForm } from '../hooks/useUserForm.ts';
import DataTable from '../../DataTable';
import type { User } from '../../../types';
import type {Column} from "../../DataTable.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const UserManagement: React.FC = () => {
    const {
        user, loading, search, setSearch,
        openDialog, setOpenDialog, editMode, formData, setFormData,
        deactivateDialogOpen, setDeactivateDialogOpen, setSelectedId,
        handleOpenAdd, handleEdit, handleSubmit, handleDeactivate,
        page, totalPages, setPage, filteredUsers, openSnackbar, setOpenSnackbar, error,
        selectedRole, setSelectedRole
    } = useUserForm();

    const columns: Column<User>[] = [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role' },
        {
            label: 'Status',
            key: 'is_active',
            align: 'center',
            render: (emp) => emp.is_active ? 'Active' : 'Inactive'
        },
        {
            label: 'Actions',
            key: 'id',
            align: 'center',
            render: (emp) => (
                <>
                    <Button onClick={() => handleEdit(emp)} sx={{ mr: 1 }} startIcon={<EditIcon />} />
                    <Button
                        color="error"
                        onClick={() => {
                            setSelectedId(emp.id);
                            setDeactivateDialogOpen(true);
                        }}
                        startIcon={<DeleteIcon />}
                    />
                </>
            )
        }
    ];

    if (!user) return null;

    return (
        <Layout>
            <Sidebar role={user.role} />
            <Box sx={{ width: '100%', padding: 3, paddingTop: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom sx={{ mb: 2, ml: 2, mt: 2 }}>User Management</Typography>
                    <Button color="secondary" variant="contained" startIcon={<PersonAddIcon />} onClick={handleOpenAdd}
                            sx={{ mb: 2, mt: 2, backgroundColor: '#263238' }}>New Employee</Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 3, ml: 2 }}>
                    <TextField
                        label="Search Users"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: '25%'}}
                        margin="normal"
                    />

                    <TextField
                        select
                        label="Filter by Role"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        sx={{ width: 200 }}
                        margin="normal"
                    >
                        <MenuItem value="ALL">All Roles</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="TEAM_LEAD">Team Lead</MenuItem>
                        <MenuItem value="MEMBER">Member</MenuItem>
                    </TextField>
                </Box>

                <DataTable
                    columns={columns}
                    rows={filteredUsers}
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

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>{editMode ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
                    {error && <Typography color="error" sx={{ mt: 1, ml: 2 }}>{error}</Typography>}
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth margin="dense" required
                        />
                        <TextField
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth margin="dense"
                            disabled={editMode} required
                        />
                        {!editMode && (
                            <TextField
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                fullWidth margin="dense" required
                            />
                        )}
                        <TextField
                            select label="Role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            fullWidth margin="dense" required
                        >
                            <MenuItem value="MEMBER">Member</MenuItem>
                            <MenuItem value="TEAM_LEAD">Team Lead</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ color: '#263238' }} onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button sx={{ backgroundColor: '#263238' }} onClick={handleSubmit} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
                    <DialogTitle>Deactivate Employee</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to deactivate this employee?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeactivateDialogOpen(false)} color="primary">Cancel</Button>
                        <Button onClick={handleDeactivate} color="secondary">Confirm</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default UserManagement;
