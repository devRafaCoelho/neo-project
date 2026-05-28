import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ptBR } from '@mui/x-date-pickers/locales';
import { SnackbarProvider } from 'notistack';
import './utils/dayjsPtBr';
import { BrandThemeProvider } from './context/BrandThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrandThemeProvider>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="pt-br"
        localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={3500}
        >
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </BrandThemeProvider>
  </StrictMode>,
);
