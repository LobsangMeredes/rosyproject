// src/components/dashboard/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar
      position="fixed"  // Fijamos el header en la parte superior
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}  // Aseguramos que el z-index sea superior al del sidebar
    >
      <Toolbar>
        <Typography color='white' variant="h6" noWrap component="div">
          Rosy Badia Alquileres-Sistema de Inventario y Facturacion V1.0
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
