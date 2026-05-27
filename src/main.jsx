import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  </StrictMode>,
);
