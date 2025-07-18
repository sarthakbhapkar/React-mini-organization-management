import { useAuth } from '../../../context/AuthContext.ts';
import { useLeavePolicy } from '../../../hooks/useLeavePolicy';
import { useLeaveRequest } from '../../../hooks/useLeaveRequest';
import { calculateUsedLeaves } from '../utils/LeaveUtils';

export const useLeaveBalance = () => {
    const { user } = useAuth();
    const { policy, loading: loadingPolicy } = useLeavePolicy();
    const { requests, loading: loadingRequests } = useLeaveRequest({
        user_id: user?.id
    });

    const loading = loadingPolicy || loadingRequests;

    const used = calculateUsedLeaves(requests);

    const balance = {
        sick_leave: policy.sick_leave - used.SICK,
        casual_leave: policy.casual_leave - used.CASUAL,
        work_from_home: policy.work_from_home - used.WFH,
    };

    return {
        user,
        loading,
        balance,
        policy,
    };
};
