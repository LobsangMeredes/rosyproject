import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import theme from './themes/themes';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';                  // Estilos base de PrimeReact
import 'primeicons/primeicons.css';                                // Iconos de PrimeReact
import 'primeflex/primeflex.css';                                  // PrimeFlex para diseño


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter> {/* Envolvemos la aplicación dentro de BrowserRouter */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
