import React from 'react';
import ReactFlow, {Controls, type Edge, MiniMap, type Node,} from 'reactflow';
import 'reactflow/dist/style.css';
import {useOrgChart} from '../hooks/useOrgChart';
import type {TeamMember} from '../../../types';
import {Box} from "@mui/material";

const OrgChart: React.FC = () => {
    const {orgData, loading, error} = useOrgChart();

    if (loading) return <p>Loading Org Chart...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!orgData) return null;

    const {organization, hierarchy} = orgData.data;

    const nodes: Node[] = [
        {
            id: 'org',
            data: {label: organization.name},
            position: {x: 400, y: 0},
            type: 'default',
        },
    ];

    const edges: Edge[] = [];

    const baseSpacing = window.innerWidth < 600 ? 120 : 250;
    const memberSpacing = window.innerWidth < 600 ? 60 : 80;

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

    <Box sx={{ width: '100%', height: '80vh',
        mt: { xs: 2, sm: 4 },
        ml: { xs: 160, sm: '240px' },overflow: 'auto',overflowY: 'hidden'}}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            fitViewOptions={{ padding: 0.2 }}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    </Box>

);
};

export default OrgChart;
