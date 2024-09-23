import React from 'react';
import { Box } from '@mui/material';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100%',
        padding: 3,
      }}
    >
      {children}
    </Box>
  );
};

export default MainContent;
