import React from 'react';
import {
    Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput,
    Pagination, Paper, Select, Snackbar, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Typography
} from '@mui/material';

import Layout from '../../../pages/Layout.tsx';
import { Sidebar } from '../../../pages/Sidebar.tsx';
import { useTeamForm } from '../hook/useTeamForm.ts';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const TeamManagement: React.FC = () => {
    const {
        user, employees, loading, search, setSearch,
        openDialog, setOpenDialog, editMode, selectedMembers, setSelectedMembers,
        formData, setFormData, handleOpenAdd, handleEdit, handleSubmit,
        handleDeactivate, deactivateDialogOpen, setDeactivateDialogOpen, setSelectedId, error, openSnackbar, setOpenSnackbar,
        page, totalPages, setPage, paginatedTeams
    } = useTeamForm();

    if (!user) return null;

    return (
        <Layout>
            <Sidebar role={user.role} />
            <Box sx={{ width: '100%', padding: 3, paddingTop: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" sx={{ mb: 2, ml: 2, mt: 2 }}>Team Management</Typography>
                    <Button color="secondary" variant="contained" startIcon={<GroupAddIcon />} onClick={handleOpenAdd}
                            sx={{ mb: 2, mt: 2, backgroundColor: '#263238' }}>New Team</Button>
                </Box>

                <TextField
                    label="Search Teams"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: '30%', ml: 2 }}
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
                                            <Button onClick={() => handleEdit(team)} startIcon={<EditIcon />} />
                                            <Button color="error" onClick={() => {
                                                setSelectedId(team.id);
                                                setDeactivateDialogOpen(true);
                                            }} startIcon={<DeleteIcon />} />
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
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity="success">Team Updated Successfully!</Alert>
                </Snackbar>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>{editMode ? 'Edit Team' : 'Add Team'}</DialogTitle>
                    {error && (
                        <Typography color="error" sx={{ mt: 1, ml: 2 }}>{error}</Typography>
                    )}
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth margin="dense" required
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth margin="dense" multiline
                        />
                        <TextField
                            label="Team Lead ID"
                            value={formData.team_lead_id || ''}
                            onChange={(e) => setFormData({ ...formData, team_lead_id: e.target.value })}
                            fullWidth margin="dense" required
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Members</InputLabel>
                            <Select
                                multiple
                                value={selectedMembers}
                                onChange={(e) => setSelectedMembers(e.target.value as string[])}
                                input={<OutlinedInput label="Members" />}
                                renderValue={(selected) =>
                                    selected.map(id => {
                                        const emp = employees.find(e => e.id === id);
                                        return emp?.name || id;
                                    }).join(', ')
                                }
                            >
                                {employees.filter(emp => emp.is_active).map(emp => (
                                    <MenuItem key={emp.id} value={emp.id}>
                                        <Checkbox checked={selectedMembers.includes(emp.id)} />
                                        <ListItemText primary={emp.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ color: '#263238' }} onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button sx={{ backgroundColor: '#263238' }} onClick={handleSubmit} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)}>
                    <DialogTitle>Deactivate Team</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to deactivate this team?</Typography>
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

export default TeamManagement;
