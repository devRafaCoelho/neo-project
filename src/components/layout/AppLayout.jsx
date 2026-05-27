import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 }, maxWidth: 1400, width: '100%', mx: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
