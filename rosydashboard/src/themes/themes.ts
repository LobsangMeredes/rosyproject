import { createTheme } from '@mui/material/styles';

// Define el tema personalizado de Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF008A',  // Rosa
    },
    secondary: {
      main: '#00BFFF',  // Azul celeste
    },
    error: {
      main: '#FF0000',  // Rojo para los errores
    },

    
  },
});

export default theme;
