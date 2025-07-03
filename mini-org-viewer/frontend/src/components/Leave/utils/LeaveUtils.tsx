import type { Leave } from '../../../types';

export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
}

export function countWeekdays(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    let count = 0;

    while (s <= e) {
        if (!isWeekend(s)) count++;
        s.setDate(s.getDate() + 1);
    }

    return count;
}

export function calculateUsedLeaves(requests: Leave[]) {
    const result = {
        SICK: 0,
        CASUAL: 0,
        WFH: 0,
    };

    for (const req of requests) {
        if (req.status === 'APPROVED' || req.status === 'PENDING') {
            const days = countWeekdays(req.start_date, req.end_date);

            if (req.leave_type in result) {
                result[req.leave_type] += days;
            }
        }
    }

    return result;
}