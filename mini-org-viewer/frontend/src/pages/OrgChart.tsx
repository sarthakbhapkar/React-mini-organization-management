import {Sidebar} from "./Sidebar";
import Layout from './Layout';
import {useAuth} from '../context/AuthContext';

export default function OrgChart(){
    const {user} = useAuth();
    if(!user) return;
    return (
        <Layout>
            <Sidebar role={user.role}/>
            <h1>Under Maintenance</h1>
        </Layout>
    )
}