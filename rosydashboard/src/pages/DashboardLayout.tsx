import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: '64px' // Margen superior igual a la altura del Header (64px)
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
