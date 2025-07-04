import React from 'react';
import {Box, useMediaQuery, useTheme} from '@mui/material';
import ReactFlow, { type Edge, type Node} from 'reactflow';
import 'reactflow/dist/style.css';
import {useOrgChart} from '../hooks/useOrgChart';
import type {TeamMember} from '../../../types';
import {useAuth} from '../../../context/AuthContext.ts';

const OrgChart: React.FC = () => {
    const {orgData, loading, error} = useOrgChart();
    const {user} = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (loading) return <Box sx={{p: {xs: 2, sm: 3}}}>Loading Org Chart...</Box>;
    if (error) return <Box sx={{p: {xs: 2, sm: 3}}}>Error: {error}</Box>;
    if (!orgData) return null;

    const {organization, hierarchy} = orgData.data;

    const nodes: Node[] = [
        {
            id: 'org',
            data: {label: organization.name},
            position: {x: isMobile ? 200 : 400, y: 0},
            type: 'default',
        },
    ];

    const edges: Edge[] = [];

    const baseSpacing = isMobile ? 120 : 250;
    const memberSpacing = isMobile ? 60 : 80;

    hierarchy.forEach((team, i) => {
        const baseX = baseSpacing * i;
        const teamY = 150;
        const leadY = 250;
        const memberY = 350;

        nodes.push({
            id: team.team_id,
            data: {label: team.team_name},
            position: {x: baseX, y: teamY},
            type: 'default',
        });

        edges.push({
            id: `e-org-${team.team_id}`,
            source: 'org',
            target: team.team_id,
            type: 'smoothstep',
        });

        if (team.team_lead) {
            const leadId = `lead-${team.team_lead.id}`;
            nodes.push({
                id: leadId,
                data: {label: `👨‍💼 ${team.team_lead.name}`},
                position: {x: baseX, y: leadY},
                type: 'default',
                style: team.team_lead.id === user?.id ? {border: '2px solid #1976d2', backgroundColor: '#e3f2fd'} : {},
            });

            edges.push({
                id: `e-${team.team_id}-${leadId}`,
                source: team.team_id,
                target: leadId,
                type: 'smoothstep',
            });

            team.members.forEach((member: TeamMember, j: number) => {
                const memberId = `member-${member.id}`;
                nodes.push({
                    id: memberId,
                    data: {label: `👤 ${member.name}`},
                    position: {x: baseX + j * memberSpacing, y: memberY},
                    type: 'default',
                    style: member.id === user?.id ? {border: '2px solid #388e3c', backgroundColor: '#e8f5e9'} : {},
                });

                edges.push({
                    id: `e-${leadId}-${memberId}`,
                    source: leadId,
                    target: memberId,
                    type: 'smoothstep',
                });
            });
        }
    });

    return (
        <Box
            sx={{
                width: '100%',
                height: {xs: '70vh', sm: '80vh'},
                mt: {xs: 2, sm: 3, md: 4},
                ml: {xs: 0, sm: '0px', md:'0px'},
                overflow: 'auto',
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                fitViewOptions={{padding: isMobile ? 0.1 : 0.2}}
            >
            </ReactFlow>
        </Box>
    );
};

export default OrgChart;