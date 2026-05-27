import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  MenuItem, Button,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { empresas, fornecedores, contasContabeis } from '../data/mockData';
import CurrencyTextField from '../components/form/CurrencyTextField';
import DatePickerField from '../components/form/DatePickerField';

const formGridSx = {
  display: 'grid',
  gap: 2.5,
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
  },
};

const tripleFieldRowSx = {
  gridColumn: '1 / -1',
  display: 'grid',
  gap: 2.5,
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
  },
};

const schema = yup.object({
  empresa: yup.string().required('Empresa obrigatória'),
  conta: yup.string().required('Conta contábil obrigatória'),
  centroCusto: yup.string().required('Centro de custo obrigatório'),
  elementoPep: yup.string(),
  ordem: yup.string().required('Ordem obrigatória'),
  valor: yup
    .number()
    .typeError('Valor deve ser numérico')
    .positive('Valor deve ser positivo')
    .required('Valor obrigatório'),
  fornecedor: yup.string().required('Fornecedor obrigatório'),
  codigoFornecedor: yup.string(),
  dataNf: yup.string(),
  nfNumero: yup.string(),
  pedidoCompra: yup.string(),
  solicitante: yup.string().required('Solicitante obrigatório'),
  departamento: yup.string().required('Departamento obrigatório'),
  justificativa: yup.string().required('Justificativa obrigatória').min(10, 'Mínimo 10 caracteres'),
});

export default function ProvisaoPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleEmpresaChange = (e) => {
    const emp = empresas.find((x) => x.nome === e.target.value);
    setEmpresaSelecionada(emp);
    if (emp) {
      setValue('centroCusto', emp.cc);
      setValue('ordem', emp.ordem);
      setValue('elementoPep', emp.pep);
    }
  };

  const handleFornecedorChange = (e) => {
    const forn = fornecedores.find((x) => x.nome === e.target.value);
    setFornecedorSelecionado(forn);
    if (forn) setValue('codigoFornecedor', forn.codigo);
  };

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    enqueueSnackbar('Provisão criada com sucesso!', { variant: 'success', autoHideDuration: 4000 });
    reset();
    setEmpresaSelecionada(null);
    setFornecedorSelecionado(null);
  };

  const handleCancelar = () => {
    reset();
    setEmpresaSelecionada(null);
    setFornecedorSelecionado(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">Criação de Provisão</Typography>
        <Typography variant="body2" color="text.secondary">Solicite uma provisão financeira para aprovação</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 3 }}>
              Dados da Provisão
            </Typography>

            <Box sx={formGridSx}>
              <Controller
                name="empresa"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Empresa *"
                    select
                    fullWidth
                    error={!!errors.empresa}
                    helperText={errors.empresa?.message}
                    onChange={(e) => { field.onChange(e); handleEmpresaChange(e); }}
                  >
                    {empresas.map((e) => (
                      <MenuItem key={e.id} value={e.nome}>{e.nome}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="conta"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Conta Contábil *"
                    select
                    fullWidth
                    error={!!errors.conta}
                    helperText={errors.conta?.message}
                  >
                    {contasContabeis.map((c) => (
                      <MenuItem key={c.codigo} value={c.codigo}>{c.codigo} — {c.descricao}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Box sx={tripleFieldRowSx}>
                <TextField
                  label="Centro de Custo *"
                  fullWidth
                  {...register('centroCusto')}
                  error={!!errors.centroCusto}
                  helperText={errors.centroCusto?.message || (empresaSelecionada ? 'Preenchido automaticamente' : '')}
                  slotProps={{ inputLabel: { shrink: !!empresaSelecionada || undefined } }}
                />

                <TextField
                  label="Elemento PEP"
                  fullWidth
                  {...register('elementoPep')}
                  slotProps={{ inputLabel: { shrink: !!empresaSelecionada || undefined } }}
                  helperText={empresaSelecionada ? 'Preenchido automaticamente' : ''}
                />

                <TextField
                  label="Ordem *"
                  fullWidth
                  {...register('ordem')}
                  error={!!errors.ordem}
                  helperText={errors.ordem?.message || (empresaSelecionada ? 'Preenchido automaticamente' : '')}
                  slotProps={{ inputLabel: { shrink: !!empresaSelecionada || undefined } }}
                />
              </Box>

              <Controller
                name="valor"
                control={control}
                render={({ field }) => (
                  <CurrencyTextField
                    label="Valor (R$) *"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={!!errors.valor}
                    helperText={errors.valor?.message}
                  />
                )}
              />

              <Controller
                name="dataNf"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DatePickerField
                    label="Data da NF (opcional)"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <Controller
                name="fornecedor"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fornecedor *"
                    select
                    fullWidth
                    error={!!errors.fornecedor}
                    helperText={errors.fornecedor?.message}
                    onChange={(e) => { field.onChange(e); handleFornecedorChange(e); }}
                  >
                    {fornecedores.map((f) => (
                      <MenuItem key={f.id} value={f.nome}>{f.nome}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                label="Código Fornecedor"
                fullWidth
                {...register('codigoFornecedor')}
                slotProps={{ inputLabel: { shrink: !!fornecedorSelecionado || undefined } }}
                helperText={fornecedorSelecionado ? 'Preenchido automaticamente' : ''}
              />

              <TextField label="Nº NF (opcional)" fullWidth {...register('nfNumero')} />

              <TextField label="Pedido de Compra (opcional)" fullWidth {...register('pedidoCompra')} />

              <TextField
                label="Nome do Solicitante *"
                fullWidth
                {...register('solicitante')}
                error={!!errors.solicitante}
                helperText={errors.solicitante?.message}
              />

              <TextField
                label="Departamento *"
                fullWidth
                {...register('departamento')}
                error={!!errors.departamento}
                helperText={errors.departamento?.message}
              />

              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField
                  label="Justificativa *"
                  fullWidth
                  multiline
                  rows={4}
                  {...register('justificativa')}
                  error={!!errors.justificativa}
                  helperText={errors.justificativa?.message}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
              >
                Salvar Provisão
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
