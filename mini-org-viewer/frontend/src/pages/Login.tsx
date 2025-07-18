import bgImage from '../assets/bg2.jpg';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {useLoginForm} from '../hooks/useLoginForm.ts';

const Login = () => {
    const {
        email,
        password,
        showPass,
        loading,
        errorMsg,
        snackOpen,
        setEmail,
        setPassword,
        setShowPass,
        setSnackOpen,
        handleSubmit,
    } = useLoginForm();

    return (
        <Container maxWidth={false}
                   disableGutters
                   sx={{
                       minHeight: '100vh',
                       backgroundImage: `url(${bgImage})`,
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       position: 'relative',
                   }}>
            <Box sx={{
                backgroundColor: 'rgba(255,255,255,0.85)',
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
                width: 400,
                maxWidth: '90%',
            }} mt={8} display="flex" flexDirection="column" alignItems="center">
                <Typography component="h1" variant="h5" mb={2} fontWeight={600}>
                    🔐 Mini Org Viewer Login
                </Typography>

                {errorMsg && <Alert severity="error" sx={{width: '100%', mb: 2}}>{errorMsg}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{width: '100%'}}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                                            {showPass ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{mt: 3, backgroundColor: '#263238'}}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20}/>}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={snackOpen}
                autoHideDuration={2000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert severity="success">
                    Login successful 🎉
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;
