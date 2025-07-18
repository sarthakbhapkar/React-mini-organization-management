import React from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
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
import { useTeamForm } from '../hook/useTeamForm.ts';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DataTable from '../../DataTable';
import type { Team } from '../../../types';
import type { Column } from '../../DataTable.tsx';
import { useTeamMembers } from '../hook/useMembers.ts';

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
        setSelectedStatus,
        selectedStatus,
        availableTeamLeads,
    } = useTeamForm();

    const { members } = useTeamMembers(editMode ? formData.id : null);

    const columns: Column<Team>[] = [
        { label: 'Name', key: 'name' },
        { label: 'Description', key: 'description' },
        {
            label: 'Status',
            key: 'is_active',
            render: (row: Team) => (row.is_active ? 'Active' : 'Inactive'),
        },
        {
            label: 'Team Lead',
            key: 'team_lead_name',
            align: 'center',
            render: (row: Team) => row.team_lead_name || '—',
        },
        {
            label: 'Actions',
            key: 'id',
            align: 'center',
            render: (row: Team) => (
                <Box display="flex" justifyContent="center" alignItems="center" gap={{ xs: 1, sm: 4 }}>
                    <IconButton
                        onClick={() => handleEdit(row)}
                        size="small"
                        color="primary"
                        disabled={!row.is_active}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedId(row.id);
                            setDeactivateDialogOpen(true);
                        }}
                        color="error"
                        size="small"
                        disabled={!row.is_active}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const itemsPerPage = 5;
    const paginatedTeams = filteredTeams.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

    if (!user) return null;

    return (
        <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ mb: { xs: 1, sm: 2 }, mt: { xs: 1, sm: 2 } }}>
                    Team Management
                </Typography>
                <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<GroupAddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ backgroundColor: '#263238', mb: { xs: 1, sm: 2 }, mt: { xs: 1, sm: 2 } }}
                >
                    New Team
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                <TextField
                    label="Search Teams"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ maxWidth: { xs: '100%', sm: 300 } }}
                />
                <TextField
                    select
                    label="Filter by Status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{ maxWidth: { xs: '100%', sm: 200 } }}
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="success">Team Updated Successfully!</Alert>
            </Snackbar>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'Edit Team' : 'Add Team'}</DialogTitle>
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
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        fullWidth
                        margin="dense"
                        multiline
                    />
                    <TextField
                        select
                        label="Select Team Lead"
                        value={formData.team_lead_id || ''}
                        onChange={(e) => setFormData({ ...formData, team_lead_id: e.target.value })}
                        fullWidth
                        margin="dense"
                        required
                    >
                        {availableTeamLeads.map((lead) => (
                            <MenuItem key={lead.id} value={lead.id}>
                                {lead.name} ({lead.email})
                            </MenuItem>
                        ))}
                        {availableTeamLeads.length === 0 && (
                            <MenuItem disabled>No available team leads</MenuItem>
                        )}
                    </TextField>

                    {editMode && (
                        <>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                                Team Members
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {members.map((member) => (
                                    <Chip
                                        key={member.id}
                                        label={`${member.name} (${member.email})`}
                                        variant="outlined"
                                        />
                                        ))}
                {members.length === 0 && (
                  <Typography color="textSecondary">No team members found.</Typography>
                )}
              </Box>
            </>
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

      <Dialog open={deactivateDialogOpen} onClose={() => setDeactivateDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Deactivate Team</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to deactivate this team?</Typography>
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

export default TeamManagement;