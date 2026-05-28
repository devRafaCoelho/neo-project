import { useState } from 'react';
import {
  AppBar, Toolbar, Box, IconButton, Avatar, Button,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, useMediaQuery, useTheme, Tooltip, Menu, MenuItem,
  Typography, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions,
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
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
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

  const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
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
        <MenuItem onClick={handleLogoutClick} sx={{ gap: 1.5, py: 1.2, color: 'error.main' }}>
          <LogoutIcon fontSize="small" />
          <Typography variant="body2">Sair</Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirmar saída</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Tem certeza que deseja sair da sua conta?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleLogoutCancel} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleLogoutConfirm} variant="contained" color="error">
            Sair
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile / tablet Drawer — apenas navegação */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Neoenergia"
            sx={{ height: 32, cursor: 'pointer' }}
            onClick={() => handleNav('/dashboard')}
          />
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Fechar menu">
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 1, py: 2, flex: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: 'text.primary',
                '&.Mui-selected': {
                  bgcolor: '#DCEBE1',
                  color: 'primary.dark',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '&:hover': { bgcolor: '#C5DDD0' },
                },
                '&:hover': { bgcolor: '#F0F7F3' },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: isActive(item.path) ? 700 : 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
