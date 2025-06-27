import React from 'react';
import { Box, type BoxProps } from '@mui/material';

interface CenteredBoxProps extends BoxProps {
    children: React.ReactNode;
}

const CenteredBox: React.FC<CenteredBoxProps> = ({ children, ...rest }) => {
    return (
        <Box
            sx={{
                minHeight: '84vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: 400,
                    maxWidth: '90%',
                }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                {...rest}
            >
                {children}
            </Box>
        </Box>
    );
};

export default CenteredBox;
