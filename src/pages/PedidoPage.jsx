import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField,
  MenuItem, Button, Divider, Chip,
} from '@mui/material';
import { Save, Cancel, InfoOutlined } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { empresas, fornecedores, contasContabeis, tiposPedido, contratos } from '../data/mockData';

const schema = yup.object({
  tipoPedido: yup.string().required('Tipo de pedido obrigatório'),
  assunto: yup.string().required('Assunto obrigatório').min(5, 'Mínimo 5 caracteres'),
  empresa: yup.string().required('Empresa obrigatória'),
  escopo: yup.string().required('Escopo obrigatório'),
  fornecedor: yup.string().required('Fornecedor obrigatório'),
  cnpjFornecedor: yup.string(),
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
    watch,
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

  const onSubmit = async (data) => {
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

            {/* Tipo de Pedido */}
            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Tipo de Pedido</Typography>
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
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
              </Grid>
              {tipoPedido && (
                <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    icon={<InfoOutlined />}
                    label={temContrato ? 'Requer contrato ativo' : 'Sem vínculo contratual'}
                    color={temContrato ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Grid>
              )}
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Dados Gerais */}
            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Dados Gerais</Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  label="Assunto *"
                  fullWidth
                  {...register('assunto')}
                  error={!!errors.assunto}
                  helperText={errors.assunto?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
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
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Escopo *" fullWidth {...register('escopo')} error={!!errors.escopo} helperText={errors.escopo?.message} />
              </Grid>

              {/* Fornecedor */}
              <Grid item xs={12} md={6}>
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
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="CNPJ do Fornecedor"
                  fullWidth
                  {...register('cnpjFornecedor')}
                  slotProps={{ inputLabel: { shrink: !!fornecedorSelecionado || undefined } }}
                  helperText={fornecedorSelecionado ? 'Preenchido automaticamente' : ''}
                />
              </Grid>

              {/* Contrato (somente se temContrato) */}
              {temContrato && (
                <Grid item xs={12} md={6}>
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
                </Grid>
              )}

              {temContrato && contratoSelecionado && (
                <Grid item xs={12} md={6}>
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
                </Grid>
              )}

              {/* Tipo de Pagamento */}
              <Grid item xs={12} md={4}>
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
              </Grid>

              {/* Conta */}
              <Grid item xs={12} md={4}>
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
              </Grid>

              {/* Valor */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Valor (R$) *"
                  fullWidth
                  type="number"
                  slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
                  {...register('valor')}
                  error={!!errors.valor}
                  helperText={errors.valor?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Justificativa do Desvio"
                  fullWidth
                  multiline
                  rows={2}
                  {...register('justificativaDesvio')}
                  placeholder="Informe o desvio em relação ao planejado (se houver)"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Dados SAP */}
            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Dados SAP</Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={4}>
                <TextField label="NCM / Cód. Serviço / ISS" fullWidth {...register('ncm')} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Nº Serviço / Código SAP" fullWidth {...register('codigoSap')} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Descrição Item" fullWidth {...register('descricaoItem')} />
              </Grid>

              {isElektro && (
                <>
                  <Grid item xs={12}>
                    <Chip label="Campos específicos Elektro" color="primary" variant="outlined" size="small" />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField label="Diagrama Elektro" fullWidth {...register('diagrama')} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField label="Atividade (Operação)" fullWidth {...register('atividade')} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField label="Descrição Atividade" fullWidth {...register('descricaoAtividade')} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField label="Classe de Custo" fullWidth {...register('classeCusto')} />
                  </Grid>
                </>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Solicitante */}
            <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>Solicitante</Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome do Solicitante *"
                  fullWidth
                  {...register('solicitante')}
                  error={!!errors.solicitante}
                  helperText={errors.solicitante?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Departamento *"
                  fullWidth
                  {...register('departamento')}
                  error={!!errors.departamento}
                  helperText={errors.departamento?.message}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
