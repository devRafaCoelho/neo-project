import { useState } from 'react';
import {
  AppBar, Toolbar, Box, IconButton, Avatar, Button,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, useMediaQuery, useTheme, Tooltip, Menu, MenuItem,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CloudUpload as ImportIcon,
  RequestPage as ProvisaoIcon,
  ShoppingCart as PedidoIcon,
  Assessment as RelatoriosIcon,
  Description as ContratosIcon,
  ManageAccounts as GestaoSapIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/neoenergia-logo.svg';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Gestão SAP', path: '/gestao-sap', icon: <GestaoSapIcon /> },
  { label: 'Importação', path: '/importacao', icon: <ImportIcon /> },
  { label: 'Provisão', path: '/provisao', icon: <ProvisaoIcon /> },
  { label: 'Pedido', path: '/pedido', icon: <PedidoIcon /> },
  { label: 'Relatórios', path: '/relatorios', icon: <RelatoriosIcon /> },
  { label: 'Contratos', path: '/contratos', icon: <ContratosIcon /> },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    navigate('/perfil');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'primary.dark',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component="img"
            src={logo}
            alt="Neoenergia"
            sx={{ height: 36, cursor: 'pointer', mr: 3, filter: 'brightness(0) invert(1)' }}
            onClick={() => navigate('/dashboard')}
          />

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  sx={{
                    color: 'white',
                    fontSize: '0.82rem',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: isActive(item.path) ? 'rgba(255,255,255,0.18)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                {user?.name}
              </Typography>
            )}
            <Tooltip title="Perfil e opções">
              <IconButton onClick={handleAvatarClick} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 38,
                    height: 38,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: '2px solid rgba(255,255,255,0.4)',
                  }}
                >
                  {user?.initials || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Avatar dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { mt: 1, minWidth: 200, borderRadius: 3, boxShadow: '0 8px 30px rgba(0,64,66,0.15)' },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile} sx={{ gap: 1.5, py: 1.2 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">Meu Perfil</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.2, color: 'error.main' }}>
          <LogoutIcon fontSize="small" />
          <Typography variant="body2">Sair</Typography>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: 'primary.dark' } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            component="img"
            src={logo}
            alt="Neoenergia"
            sx={{ height: 32, filter: 'brightness(0) invert(1)' }}
          />
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'rgba(0,0,0,0.2)', mx: 1, borderRadius: 2, mb: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700 }}>
            {user?.initials || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{user?.name}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{user?.role}</Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1 }} />

        <List sx={{ px: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: 'white',
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.18)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 1 }} />
        <List sx={{ px: 1 }}>
          <ListItemButton onClick={() => { handleNav('/perfil'); }} sx={{ borderRadius: 2, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: 40 }}><PersonIcon /></ListItemIcon>
            <ListItemText primary="Meu Perfil" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#FF8A80', '&:hover': { bgcolor: 'rgba(255,100,100,0.15)' } }}>
            <ListItemIcon sx={{ color: '#FF8A80', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Sair" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
