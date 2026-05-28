import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Link, Alert, Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/neoenergia-logo.svg';

const schema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().required('Senha obrigatória'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setAuthError('');
    await new Promise((r) => setTimeout(r, 600));
    const result = login(data.email, data.password);
    if (result.success) {
      enqueueSnackbar('Bem-vindo ao Sistema SAI!', { variant: 'success' });
      navigate('/dashboard');
    } else {
      setAuthError(result.message);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email');
    const emailValido = await trigger('email');

    if (!email || !emailValido) {
      enqueueSnackbar('Informe um e-mail válido para recuperar a senha.', {
        variant: 'warning',
      });
      return;
    }

    // Fluxo simulado para o protótipo (sem backend de envio real).
    enqueueSnackbar(`Enviamos instruções de recuperação para ${email}.`, {
      variant: 'info',
      autoHideDuration: 5000,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #004042 0%, #00A443 60%, #26BF64 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src={logo}
              alt="Neoenergia"
              sx={{ height: 48, mb: 2 }}
            />
            <Typography variant="h5" fontWeight={700} color="primary.dark">
              Sistema SAI
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Faça login para acessar o sistema
            </Typography>
          </Box>

          {authError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {authError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              autoComplete="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ fontWeight: 600, color: 'primary.main' }}
              >
                Esqueci minha senha
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
              startIcon={<LockOutlined />}
              sx={{ py: 1.4, fontSize: '1rem', borderRadius: 2 }}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">ou</Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/cadastro')}
                sx={{ fontWeight: 600, color: 'primary.main' }}
              >
                Cadastre-se
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
