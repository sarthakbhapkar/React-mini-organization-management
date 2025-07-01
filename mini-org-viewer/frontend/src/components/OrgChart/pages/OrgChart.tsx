import React from 'react';
import ReactFlow, {Controls, type Edge, MiniMap, type Node,} from 'reactflow';
import 'reactflow/dist/style.css';
import {useOrgChart} from '../hooks/useOrgChart';
import type {TeamMember} from '../../../types';

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

    hierarchy.forEach((team, i) => {
        const baseX = 250 * i;
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
                    position: {x: baseX + j * 80, y: memberY},
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
        <div style={{height: '90vh', width: '100%', marginTop: '0px'}}>
            <ReactFlow nodes={nodes} edges={edges} fitView
                       panOnDrag={false}
                       zoomOnScroll={false}
                       zoomOnPinch={false}
                       panOnScroll={false}
                       nodesDraggable={false}
                       nodesConnectable={false}>
                <MiniMap/>
                <Controls/>
            </ReactFlow>
        </div>
    );
};

export default OrgChart;
