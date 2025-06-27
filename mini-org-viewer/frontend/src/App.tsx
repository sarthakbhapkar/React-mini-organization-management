import {BrowserRouter} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import AppRoutes from "./routes";
import {AuthProvider} from "./context/AuthProvider.tsx"

const App = () => {

    return (
        <AuthProvider>
            <BrowserRouter>
                <CssBaseline/>
                <AppRoutes/>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;