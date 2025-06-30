import {useAuth} from '../context/AuthContext.ts';

export default function OrgChart() {
    const {user} = useAuth();
    if (!user) return;
    return (
        <h1>Under Maintenance</h1>
    );
}