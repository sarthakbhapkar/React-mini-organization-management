import React from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import {useTeamForm} from '../hook/useTeamForm.ts';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DataTable from '../../DataTable';
import type {Team} from '../../../types';
import type {Column} from "../../DataTable.tsx";

const TeamManagement: React.FC = () => {
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
        handleOpenAdd,
        handleEdit,
        handleSubmit,
        handleDeactivate,
        deactivateDialogOpen,
        setDeactivateDialogOpen,
        setSelectedId,
        error,
        openSnackbar,
        setOpenSnackbar,
        page,
        setPage,
        filteredTeams,
        setSelectedStatus, selectedStatus
    } = useTeamForm();

    const columns: Column<Team>[] = [
        {label: 'Name', key: 'name'},
        {label: 'Description', key: 'description'},
        {
            label: 'Status',
            key: 'is_active',
            render: (row: Team) => row.is_active ? 'Active' : 'Inactive'
        },
        {
            label: 'Team Lead',
            key: 'team_lead_id',
            align: 'center'
        },
        {
            label: 'Actions',
            key: 'id',
            align: 'center',
            render: (row: Team) => (
                <>
                    <Button onClick={() => handleEdit(row)} startIcon={<EditIcon/>} sx={{mr: 1}}/>
                    <Button
                        color="error"
                        onClick={() => {
                            setSelectedId(row.id);
                            setDeactivateDialogOpen(true);
                        }}
                        startIcon={<DeleteIcon/>}
                    />
                </>
            )
        }
    ];

    const itemsPerPage = 5;
    const paginatedTeams = filteredTeams.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

    if (!user) return null;

    return (
        <Box sx={{width: '100%', padding: 3, paddingTop: 1}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h4" sx={{mb: 2, ml: 2, mt: 2}}>Team Management</Typography>
                <Button color="secondary" variant="contained" startIcon={<GroupAddIcon/>} onClick={handleOpenAdd}
                        sx={{mb: 2, mt: 2, backgroundColor: '#263238'}}>New Team</Button>
            </Box>

            <Box sx={{display: 'flex', gap: 3, ml: 2}}>
                <TextField
                    label="Search Teams"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{width: '25%'}}
                    margin="normal"
                />
                <TextField
                    select
                    label="Filter by Status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    sx={{width: 200}}
                    margin="normal"
                >
                    <MenuItem value="ALL">All Teams</MenuItem>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                </TextField>
            </Box>

            <DataTable
                columns={columns}
                rows={paginatedTeams}
                loading={loading}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
                <Alert severity="success">Team Updated Successfully!</Alert>
            </Snackbar>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{editMode ? 'Edit Team' : 'Add Team'}</DialogTitle>
                {error && (
                    <Typography color="error" sx={{mt: 1, ml: 2}}>{error}</Typography>
                )}
                <DialogContent>
                    <TextField
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        fullWidth margin="dense" required
                    />
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        fullWidth margin="dense" multiline
                    />
                    <TextField
                        label="Team Lead ID"
                        value={formData.team_lead_id || ''}
                        onChange={(e) => setFormData({...formData, team_lead_id: e.target.value})}
                        fullWidth margin="dense" required
                    />
                </DialogContent>
                <DialogActions>
                    <Button sx={{color: '#263238'}} onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button sx={{backgroundColor: '#263238'}} onClick={handleSubmit}
                            variant="contained">Save</Button>
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
    );
};

export default TeamManagement;
