import type { Leave } from '../../../types';

export function calculateUsedLeaves(requests: Leave[]) {
    const result = {
        SICK: 0,
        CASUAL: 0,
        WFH: 0,
    };

    for (const req of requests) {
        if (req.status === 'APPROVED' || req.status === 'PENDING') {
            const days =
                (new Date(req.end_date).getTime() - new Date(req.start_date).getTime()) /
                (1000 * 60 * 60 * 24) +
                1;

            if (req.leave_type in result) {
                result[req.leave_type] += days;
            }
        }
    }

    return result;
}
