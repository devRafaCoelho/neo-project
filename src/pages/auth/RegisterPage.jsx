import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Stepper, Step, StepLabel, InputAdornment, IconButton,
  MenuItem, Stack, Link, Chip,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import logo from '../../assets/neoenergia-logo.svg';
import { empresas } from '../../data/mockData';

const steps = ['Dados Pessoais', 'Acesso', 'Confirmação'];

const step1Schema = yup.object({
  nome: yup.string().min(3, 'Mínimo 3 caracteres').required('Nome obrigatório'),
  sobrenome: yup.string().min(2, 'Mínimo 2 caracteres').required('Sobrenome obrigatório'),
  departamento: yup.string().required('Departamento obrigatório'),
  empresa: yup.string().required('Empresa obrigatória'),
  cargo: yup.string().required('Cargo obrigatório'),
});

const step2Schema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  senha: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .matches(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
    .matches(/[0-9]/, 'Deve conter ao menos um número')
    .matches(/[^a-zA-Z0-9]/, 'Deve conter ao menos um caractere especial')
    .required('Senha obrigatória'),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref('senha')], 'As senhas não coincidem')
    .required('Confirmação obrigatória'),
});

const schemas = [step1Schema, step2Schema, yup.object()];

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [allData, setAllData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    getValues,
    formState: { errors },
    trigger,
  } = useForm({ resolver: yupResolver(schemas[activeStep]), mode: 'onTouched' });

  const handleNext = async () => {
    const valid = await trigger();
    if (!valid) return;
    const values = getValues();
    setAllData((prev) => ({ ...prev, ...values }));
    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const handleFinish = async () => {
    await new Promise((r) => setTimeout(r, 800));
    enqueueSnackbar('Cadastro realizado com sucesso! Faça login para acessar.', {
      variant: 'success',
      autoHideDuration: 4000,
    });
    navigate('/login');
  };

  const merged = { ...allData, ...getValues() };

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
      <Card sx={{ width: '100%', maxWidth: 560, borderRadius: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box component="img" src={logo} alt="Neoenergia" sx={{ height: 56, mb: 1.5 }} />
            <Typography variant="h5" fontWeight={700} color="primary.dark">Criar Conta</Typography>
            <Typography variant="body2" color="text.secondary">Sistema SAI — Neoenergia</Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* STEP 1 — Dados Pessoais */}
          {activeStep === 0 && (
            <Box component="form" noValidate>
              <Stack spacing={2}>
                <TextField label="Nome" fullWidth {...register('nome')} error={!!errors.nome} helperText={errors.nome?.message} />
                <TextField label="Sobrenome" fullWidth {...register('sobrenome')} error={!!errors.sobrenome} helperText={errors.sobrenome?.message} />
                <TextField label="Cargo" fullWidth {...register('cargo')} error={!!errors.cargo} helperText={errors.cargo?.message} />
                <TextField label="Departamento" fullWidth {...register('departamento')} error={!!errors.departamento} helperText={errors.departamento?.message} />
                <TextField
                  label="Empresa"
                  select
                  fullWidth
                  defaultValue=""
                  {...register('empresa')}
                  error={!!errors.empresa}
                  helperText={errors.empresa?.message}
                >
                  {empresas.map((e) => (
                    <MenuItem key={e.id} value={e.nome}>{e.nome}</MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Box>
          )}

          {/* STEP 2 — Acesso */}
          {activeStep === 1 && (
            <Box component="form" noValidate>
              <Stack spacing={2}>
                <TextField label="E-mail corporativo" type="email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
                <TextField
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  {...register('senha')}
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
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
                />
                <TextField
                  label="Confirmar Senha"
                  type={showConfirm ? 'text' : 'password'}
                  fullWidth
                  {...register('confirmarSenha')}
                  error={!!errors.confirmarSenha}
                  helperText={errors.confirmarSenha?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end">
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Box>
          )}

          {/* STEP 3 — Confirmação */}
          {activeStep === 2 && (
            <Box>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CheckCircle sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" fontWeight={700}>Confirme seus dados</Typography>
                <Typography variant="body2" color="text.secondary">Verifique as informações antes de finalizar</Typography>
              </Box>
              <Box sx={{ bgcolor: '#F0F7F3', borderRadius: 3, p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  ['Nome completo', `${merged.nome || ''} ${merged.sobrenome || ''}`],
                  ['Cargo', merged.cargo],
                  ['Departamento', merged.departamento],
                  ['Empresa', merged.empresa],
                  ['E-mail', merged.email],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
                    <Chip label={value || '—'} size="small" sx={{ bgcolor: 'white', fontWeight: 500 }} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                fullWidth
                sx={{ borderRadius: 2, minHeight: 48, whiteSpace: 'nowrap' }}
              >
                Voltar
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                fullWidth
                sx={{ borderRadius: 2, minHeight: 48, whiteSpace: 'nowrap' }}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleFinish}
                fullWidth
                sx={{ borderRadius: 2, minHeight: 48, whiteSpace: 'nowrap' }}
              >
                Finalizar
              </Button>
            )}
          </Box>

          {activeStep === 0 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Já tem uma conta?{' '}
                <Link component="button" onClick={() => navigate('/login')} sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Fazer login
                </Link>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
