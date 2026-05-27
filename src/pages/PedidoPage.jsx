import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  MenuItem, Button, Divider, Chip,
} from '@mui/material';
import { Save, Cancel, InfoOutlined } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { empresas, fornecedores, contasContabeis, tiposPedido, contratos } from '../data/mockData';
import CurrencyTextField from '../components/form/CurrencyTextField';
import CnpjTextField from '../components/form/CnpjTextField';
import { digitsOnlyCnpj } from '../utils/cnpj';

const formGridSx = {
  display: 'grid',
  gap: 2.5,
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
  },
};

const formGridTripleSx = {
  gridColumn: '1 / -1',
  display: 'grid',
  gap: 2.5,
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
  },
};

const fullWidthField = { gridColumn: '1 / -1' };

const schema = yup.object({
  tipoPedido: yup.string().required('Tipo de pedido obrigatório'),
  assunto: yup.string().required('Assunto obrigatório').min(5, 'Mínimo 5 caracteres'),
  empresa: yup.string().required('Empresa obrigatória'),
  escopo: yup.string().required('Escopo obrigatório'),
  fornecedor: yup.string().required('Fornecedor obrigatório'),
  cnpjFornecedor: yup
    .string()
    .test('cnpj', 'CNPJ deve ter 14 dígitos', (val) => {
      if (!val || !String(val).trim()) return true;
      return digitsOnlyCnpj(val).length === 14;
    }),
  tipoPagamento: yup.string().required('Tipo de pagamento obrigatório'),
  valor: yup
    .number()
    .typeError('Valor deve ser numérico')
    .positive('Valor deve ser positivo')
    .required('Valor obrigatório'),
  justificativaDesvio: yup.string(),
  conta: yup.string().required('Conta obrigatória'),
  solicitante: yup.string().required('Solicitante obrigatório'),
  departamento: yup.string().required('Departamento obrigatório'),
});

export default function PedidoPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [tipoPedido, setTipoPedido] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [contratosSelecionaveis, setContratosSelecionaveis] = useState([]);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);

  const temContrato = tipoPedido.includes('com-contrato');
  const isElektro = empresaSelecionada?.sigla === 'ELEKTRO';

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleFornecedorChange = (e, field) => {
    field.onChange(e);
    const forn = fornecedores.find((x) => x.nome === e.target.value);
    setFornecedorSelecionado(forn);
    if (forn) setValue('cnpjFornecedor', forn.cnpj);
    setContratosSelecionaveis([]);
    setContratoSelecionado(null);
  };

  const handleEmpresaChange = (e, field) => {
    field.onChange(e);
    const emp = empresas.find((x) => x.nome === e.target.value);
    setEmpresaSelecionada(emp);
    filterContratos(e.target.value, fornecedorSelecionado?.nome);
  };

  const filterContratos = (emp, forn) => {
    if (!emp || !forn) return;
    const filtered = contratos.filter(
      (c) => c.empresa === emp && c.fornecedor === forn,
    );
    setContratosSelecionaveis(filtered);
  };

  const handleContratoChange = (e) => {
    const cont = contratosSelecionaveis.find((c) => c.id === e.target.value);
    setContratoSelecionado(cont);
  };

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    enqueueSnackbar('Pedido criado com sucesso! Aprovador notificado.', {
      variant: 'success',
      autoHideDuration: 5000,
    });
    reset();
    setTipoPedido('');
    setFornecedorSelecionado(null);
    setEmpresaSelecionada(null);
    setContratosSelecionaveis([]);
    setContratoSelecionado(null);
  };

  const handleCancelar = () => {
    reset();
    setTipoPedido('');
    setFornecedorSelecionado(null);
    setEmpresaSelecionada(null);
    setContratosSelecionaveis([]);
    setContratoSelecionado(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="primary.dark">Criação de Pedido</Typography>
        <Typography variant="body2" color="text.secondary">Crie pedidos de serviço ou material com ou sem contrato</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Tipo de Pedido</Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                mb: 3,
                gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
                alignItems: { md: 'center' },
              }}
            >
              <Controller
                name="tipoPedido"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tipo de Pedido *"
                    select
                    fullWidth
                    error={!!errors.tipoPedido}
                    helperText={errors.tipoPedido?.message}
                    onChange={(e) => { field.onChange(e); setTipoPedido(e.target.value); }}
                  >
                    {tiposPedido.map((t) => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
              {tipoPedido && (
                <Chip
                  icon={<InfoOutlined />}
                  label={temContrato ? 'Requer contrato ativo' : 'Sem vínculo contratual'}
                  color={temContrato ? 'success' : 'warning'}
                  variant="outlined"
                  sx={{ justifySelf: { xs: 'start', md: 'center' } }}
                />
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Dados Gerais</Typography>
            <Box sx={formGridSx}>
              <TextField
                label="Assunto *"
                fullWidth
                sx={fullWidthField}
                {...register('assunto')}
                error={!!errors.assunto}
                helperText={errors.assunto?.message}
              />

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
                    onChange={(e) => handleEmpresaChange(e, field)}
                  >
                    {empresas.map((e) => (
                      <MenuItem key={e.id} value={e.nome}>{e.nome}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <TextField
                label="Escopo *"
                fullWidth
                {...register('escopo')}
                error={!!errors.escopo}
                helperText={errors.escopo?.message}
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
                    onChange={(e) => handleFornecedorChange(e, field)}
                  >
                    {fornecedores.map((f) => (
                      <MenuItem key={f.id} value={f.nome}>{f.nome}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="cnpjFornecedor"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <CnpjTextField
                    label="CNPJ do Fornecedor"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={!!errors.cnpjFornecedor}
                    helperText={
                      errors.cnpjFornecedor?.message
                      || (fornecedorSelecionado ? 'Preenchido automaticamente' : '')
                    }
                    slotProps={{ inputLabel: { shrink: !!field.value || !!fornecedorSelecionado || undefined } }}
                  />
                )}
              />

              {temContrato && (
                <TextField
                  label="Contrato"
                  select
                  fullWidth
                  defaultValue=""
                  onChange={handleContratoChange}
                  helperText={contratosSelecionaveis.length === 0 ? 'Selecione fornecedor e empresa primeiro' : ''}
                  disabled={contratosSelecionaveis.length === 0}
                >
                  {contratosSelecionaveis.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.id} — {c.objeto}
                      {' '}(Saldo: {c.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {temContrato && contratoSelecionado && (
                <TextField
                  label="Item do Contrato"
                  select
                  fullWidth
                  defaultValue=""
                >
                  {contratoSelecionado.itens.map((it) => (
                    <MenuItem key={it.codigo} value={it.codigo}>
                      {it.codigo} — {it.descricao} ({it.unidade})
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <Box sx={formGridTripleSx}>
                <Controller
                  name="tipoPagamento"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tipo de Pagamento *"
                      select
                      fullWidth
                      error={!!errors.tipoPagamento}
                      helperText={errors.tipoPagamento?.message}
                    >
                      <MenuItem value="OPEX">OPEX</MenuItem>
                      <MenuItem value="CAPEX">CAPEX</MenuItem>
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
                      label="Conta *"
                      select
                      fullWidth
                      error={!!errors.conta}
                      helperText={errors.conta?.message}
                    >
                      {contasContabeis.map((c) => (
                        <MenuItem key={c.codigo} value={c.codigo}>{c.codigo}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />

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
              </Box>

              <TextField
                label="Justificativa do Desvio"
                fullWidth
                multiline
                rows={2}
                sx={fullWidthField}
                {...register('justificativaDesvio')}
                placeholder="Informe o desvio em relação ao planejado (se houver)"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Dados SAP</Typography>
            <Box sx={formGridSx}>
              <Box sx={formGridTripleSx}>
                <TextField label="NCM / Cód. Serviço / ISS" fullWidth {...register('ncm')} />
                <TextField label="Nº Serviço / Código SAP" fullWidth {...register('codigoSap')} />
                <TextField label="Descrição Item" fullWidth {...register('descricaoItem')} />
              </Box>

              {isElektro && (
                <>
                  <Chip
                    label="Campos específicos Elektro"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ ...fullWidthField, justifySelf: 'start' }}
                  />
                  <Box
                    sx={{
                      ...formGridTripleSx,
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(4, minmax(0, 1fr))',
                      },
                    }}
                  >
                    <TextField label="Diagrama Elektro" fullWidth {...register('diagrama')} />
                    <TextField label="Atividade (Operação)" fullWidth {...register('atividade')} />
                    <TextField label="Descrição Atividade" fullWidth {...register('descricaoAtividade')} />
                    <TextField label="Classe de Custo" fullWidth {...register('classeCusto')} />
                  </Box>
                </>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Solicitante</Typography>
            <Box sx={formGridSx}>
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
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mt: 4,
                justifyContent: { sm: 'flex-end' },
                '& .MuiButton-root': {
                  width: { xs: '100%', sm: 'auto' },
                },
              }}
            >
              <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={handleCancelar}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" startIcon={<Save />}>
                Salvar Pedido
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
