import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  MenuItem, Button, Divider, Chip, FormControlLabel,
  Switch, Stack, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TablePagination, useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Save, Cancel, InfoOutlined, Add, Visibility, Edit, Delete, Close,
} from '@mui/icons-material';
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

const pedidosMock = [
  {
    id: 'PED-001',
    tipoPedido: 'servico-com-contrato',
    assunto: 'Suporte NOC 24x7',
    empresa: 'Neoenergia Coelba',
    escopo: 'Operação e monitoramento de rede',
    fornecedor: 'JR Teletrica',
    cnpjFornecedor: '12.345.678/0001-01',
    tipoPagamento: 'OPEX',
    valor: 145000,
    conta: '230L',
    solicitante: 'Rafael Coelho',
    departamento: 'Telecom',
    status: 'Pendente',
    data: '2026-05-21',
  },
  {
    id: 'PED-002',
    tipoPedido: 'material-sem-contrato',
    assunto: 'Aquisição de switches L2',
    empresa: 'Neoenergia Elektro',
    escopo: 'Compra para expansão de backbone',
    fornecedor: 'Mgitech',
    cnpjFornecedor: '34.567.890/0001-03',
    tipoPagamento: 'CAPEX',
    valor: 98000,
    conta: '220M',
    solicitante: 'Ana Souza',
    departamento: 'Engenharia',
    status: 'Aprovado',
    data: '2026-05-18',
  },
  {
    id: 'PED-003',
    tipoPedido: 'servico-sem-contrato',
    assunto: 'Instalação de fibra em site crítico',
    empresa: 'Neoenergia Pernambuco',
    escopo: 'Atendimento emergencial',
    fornecedor: 'Telespazio',
    cnpjFornecedor: '23.456.789/0001-02',
    tipoPagamento: 'OPEX',
    valor: 56000,
    conta: '230D',
    solicitante: 'João Ferreira',
    departamento: 'Operações',
    status: 'Em análise',
    data: '2026-05-15',
  },
  {
    id: 'PED-004',
    tipoPedido: 'material-com-contrato',
    assunto: 'Rádios para enlace redundante',
    empresa: 'Neoenergia Coelba',
    escopo: 'Atualização de enlaces de rádio',
    fornecedor: 'Ericsson',
    cnpjFornecedor: '56.789.012/0001-05',
    tipoPagamento: 'CAPEX',
    valor: 320000,
    conta: '2393',
    solicitante: 'Pedro Alves',
    departamento: 'Infraestrutura',
    status: 'Pendente',
    data: '2026-05-10',
  },
  {
    id: 'PED-005',
    tipoPedido: 'servico-com-contrato',
    assunto: 'Gestão de chips IoT',
    empresa: 'Neoenergia Pernambuco',
    escopo: 'Operação contínua de conectividade IoT',
    fornecedor: 'Mgitech',
    cnpjFornecedor: '34.567.890/0001-03',
    tipoPagamento: 'OPEX',
    valor: 74000,
    conta: '230L',
    solicitante: 'Luciana Ramos',
    departamento: 'Telecom',
    status: 'Aprovado',
    data: '2026-05-08',
  },
];

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
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { enqueueSnackbar } = useSnackbar();
  const [pedidos] = useState(pedidosMock);
  const [showForm, setShowForm] = useState(false);
  const [pedidoEmEdicao, setPedidoEmEdicao] = useState(null);
  const [pedidoVisualizacao, setPedidoVisualizacao] = useState(null);
  const [pedidoExclusao, setPedidoExclusao] = useState(null);
  const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);
  const [modoLista, setModoLista] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listVisibleCount, setListVisibleCount] = useState(3);
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

  const showTable = !isTabletOrMobile || !modoLista;
  const showList = isTabletOrMobile && modoLista;
  const pedidosPaginados = pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const pedidosLista = pedidos.slice(0, listVisibleCount);
  const hasMoreListItems = listVisibleCount < pedidos.length;

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

  const abrirNovoPedido = () => {
    reset();
    setPedidoEmEdicao(null);
    setTipoPedido('');
    setFornecedorSelecionado(null);
    setEmpresaSelecionada(null);
    setContratosSelecionaveis([]);
    setContratoSelecionado(null);
    setShowForm(true);
  };

  const abrirEdicaoPedido = (pedido) => {
    reset({
      tipoPedido: pedido.tipoPedido,
      assunto: pedido.assunto,
      empresa: pedido.empresa,
      escopo: pedido.escopo,
      fornecedor: pedido.fornecedor,
      cnpjFornecedor: pedido.cnpjFornecedor,
      tipoPagamento: pedido.tipoPagamento,
      valor: pedido.valor,
      conta: pedido.conta,
      solicitante: pedido.solicitante,
      departamento: pedido.departamento,
      justificativaDesvio: '',
      ncm: '',
      codigoSap: '',
      descricaoItem: '',
      diagrama: '',
      atividade: '',
      descricaoAtividade: '',
      classeCusto: '',
    });
    setPedidoEmEdicao(pedido);
    setTipoPedido(pedido.tipoPedido);
    const emp = empresas.find((x) => x.nome === pedido.empresa) || null;
    const forn = fornecedores.find((x) => x.nome === pedido.fornecedor) || null;
    setEmpresaSelecionada(emp);
    setFornecedorSelecionado(forn);
    filterContratos(pedido.empresa, pedido.fornecedor);
    setContratoSelecionado(null);
    setShowForm(true);
  };

  const abrirVisualizacaoPedido = (pedido) => {
    setPedidoVisualizacao(pedido);
  };

  const confirmarExclusaoPedido = (pedido) => {
    setPedidoExclusao(pedido);
  };

  const executarExclusaoSimulada = () => {
    enqueueSnackbar(`Pedido ${pedidoExclusao?.id} excluído com sucesso!`, {
      variant: 'success',
      autoHideDuration: 3500,
    });
    setPedidoExclusao(null);
  };

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    enqueueSnackbar(
      pedidoEmEdicao
        ? `Pedido ${pedidoEmEdicao.id} atualizado com sucesso!`
        : 'Pedido criado com sucesso! Aprovador notificado.',
      {
      variant: 'success',
      autoHideDuration: 5000,
      },
    );
    reset();
    setShowForm(false);
    setPedidoEmEdicao(null);
    setTipoPedido('');
    setFornecedorSelecionado(null);
    setEmpresaSelecionada(null);
    setContratosSelecionaveis([]);
    setContratoSelecionado(null);
  };

  const handleCancelar = () => {
    reset();
    setShowForm(false);
    setPedidoEmEdicao(null);
    setTipoPedido('');
    setFornecedorSelecionado(null);
    setEmpresaSelecionada(null);
    setContratosSelecionaveis([]);
    setContratoSelecionado(null);
  };

  const handleSolicitarCancelamento = () => {
    setConfirmarCancelamento(true);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="primary.dark">Criação de Pedido</Typography>
            <Typography variant="body2" color="text.secondary">Crie pedidos de serviço ou material com ou sem contrato</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={!isTabletOrMobile ? <Add /> : undefined}
            onClick={abrirNovoPedido}
            sx={{
              minWidth: { xs: 48, lg: 'auto' },
              width: { xs: 48, lg: 'auto' },
              height: { xs: 48, lg: 42 },
              px: { xs: 0, lg: 2.25 },
              borderRadius: { xs: '50%', lg: 1 },
            }}
          >
            {isTabletOrMobile ? <Add /> : 'Cadastrar novo pedido'}
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
            Pedidos Cadastrados
          </Typography>

          {isTabletOrMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={<Switch checked={modoLista} onChange={(e) => setModoLista(e.target.checked)} color="primary" />}
                label={<Typography variant="body2" fontWeight={600}>{modoLista ? 'Modo lista' : 'Modo tabela'}</Typography>}
                labelPlacement="end"
                sx={{ m: 0 }}
              />
            </Box>
          )}

          {showList && (
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {pedidosLista.map((p) => (
                <Card key={p.id} variant="outlined" sx={{ borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.dark">{p.id}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar pedido">
                          <IconButton size="small" onClick={() => abrirVisualizacaoPedido(p)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar pedido">
                          <IconButton size="small" onClick={() => abrirEdicaoPedido(p)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir pedido">
                          <IconButton size="small" color="error" onClick={() => confirmarExclusaoPedido(p)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>{p.assunto}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.empresa} — {p.fornecedor}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.25 }}>
                      <Chip size="small" label={p.tipoPagamento} color={p.tipoPagamento === 'CAPEX' ? 'secondary' : 'primary'} />
                      <Chip size="small" label={p.status} variant="outlined" />
                      <Chip size="small" label={p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {hasMoreListItems && (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                  <Button
                    variant="text"
                    onClick={() => setListVisibleCount((current) => Math.min(current + 3, pedidos.length))}
                    sx={{ fontWeight: 700 }}
                  >
                    Mostrar mais
                  </Button>
                </Box>
              )}
            </Stack>
          )}

          {showTable && (
            <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'divider', mb: 1 }}>
              <Box component="table" sx={{ width: 'max-content', minWidth: '100%', borderCollapse: 'collapse' }}>
                <Box component="thead">
                  <Box component="tr">
                    {['ID', 'Assunto', 'Empresa', 'Fornecedor', 'Valor', 'Status', 'Ações'].map((h) => (
                      <Box
                        component="th"
                        key={h}
                        sx={{
                          p: '12px 16px',
                          textAlign: 'left',
                          bgcolor: 'primary.dark',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box component="tbody">
                  {pedidosPaginados.map((p, i) => (
                    <Box
                      component="tr"
                      key={p.id}
                      sx={{ bgcolor: i % 2 === 0 ? 'white' : '#F0F7F3', '&:hover': { bgcolor: '#DCEBE1' } }}
                    >
                      <Box component="td" sx={{ p: '10px 16px', fontWeight: 700, color: 'primary.dark', whiteSpace: 'nowrap' }}>{p.id}</Box>
                      <Box component="td" sx={{ p: '10px 16px', minWidth: 220 }}>{p.assunto}</Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>{p.empresa}</Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>{p.fornecedor}</Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </Box>
                      <Box component="td" sx={{ p: '10px 16px' }}>
                        <Chip size="small" label={p.status} variant="outlined" />
                      </Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>
                        <Tooltip title="Visualizar pedido">
                          <IconButton size="small" onClick={() => abrirVisualizacaoPedido(p)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar pedido">
                          <IconButton size="small" onClick={() => abrirEdicaoPedido(p)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir pedido">
                          <IconButton size="small" color="error" onClick={() => confirmarExclusaoPedido(p)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {showTable && (
            <TablePagination
              component="div"
              count={pedidos.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  px: { xs: 1, sm: 2 },
                  display: { xs: 'grid', sm: 'flex' },
                  gridTemplateColumns: { xs: 'auto auto 1fr', sm: 'none' },
                  gridTemplateAreas: {
                    xs: '"label input rows" "actions actions actions"',
                    sm: 'none',
                  },
                  alignItems: 'center',
                  columnGap: { xs: 1, sm: 0 },
                  rowGap: { xs: 0.75, sm: 0 },
                },
                '& .MuiTablePagination-spacer': {
                  display: { xs: 'none', sm: 'block' },
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  margin: 0,
                },
                '& .MuiTablePagination-selectLabel': {
                  gridArea: { xs: 'label', sm: 'auto' },
                  justifySelf: { xs: 'start', sm: 'auto' },
                },
                '& .MuiTablePagination-input': {
                  gridArea: { xs: 'input', sm: 'auto' },
                  justifySelf: { xs: 'start', sm: 'auto' },
                },
                '& .MuiTablePagination-displayedRows': {
                  gridArea: { xs: 'rows', sm: 'auto' },
                  justifySelf: { xs: 'start', sm: 'auto' },
                },
                '& .MuiTablePagination-actions': {
                  gridArea: { xs: 'actions', sm: 'auto' },
                  justifySelf: { xs: 'end', sm: 'auto' },
                },
                '& .MuiTablePagination-actions .MuiIconButton-root': {
                  color: 'text.secondary',
                },
                '& .MuiTablePagination-actions .MuiIconButton-root.Mui-disabled': {
                  color: 'text.disabled',
                  opacity: 0.75,
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      {showForm && (
        <Dialog
          open={showForm}
          onClose={handleCancelar}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            {pedidoEmEdicao ? `Editar Pedido ${pedidoEmEdicao.id}` : 'Novo Pedido'}
            <IconButton size="small" onClick={handleCancelar} aria-label="Fechar formulário">
              <Close fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
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
              <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={handleSolicitarCancelamento}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" startIcon={<Save />}>
                {pedidoEmEdicao ? 'Salvar Alterações' : 'Salvar Pedido'}
              </Button>
            </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!pedidoVisualizacao} onClose={() => setPedidoVisualizacao(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Resumo do Pedido</DialogTitle>
        <DialogContent dividers>
          {pedidoVisualizacao && (
            <Stack spacing={1.25}>
              <Typography variant="body2"><strong>ID:</strong> {pedidoVisualizacao.id}</Typography>
              <Typography variant="body2"><strong>Assunto:</strong> {pedidoVisualizacao.assunto}</Typography>
              <Typography variant="body2"><strong>Tipo:</strong> {tiposPedido.find((t) => t.value === pedidoVisualizacao.tipoPedido)?.label || pedidoVisualizacao.tipoPedido}</Typography>
              <Typography variant="body2"><strong>Empresa:</strong> {pedidoVisualizacao.empresa}</Typography>
              <Typography variant="body2"><strong>Fornecedor:</strong> {pedidoVisualizacao.fornecedor}</Typography>
              <Typography variant="body2"><strong>Valor:</strong> {pedidoVisualizacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {pedidoVisualizacao.status}</Typography>
              <Typography variant="body2"><strong>Data:</strong> {new Date(pedidoVisualizacao.data).toLocaleDateString('pt-BR')}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setPedidoVisualizacao(null)}>Fechar</Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => {
              const pedido = pedidoVisualizacao;
              setPedidoVisualizacao(null);
              abrirEdicaoPedido(pedido);
            }}
          >
            Editar pedido
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!pedidoExclusao} onClose={() => setPedidoExclusao(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Excluir pedido</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Confirma a exclusão do pedido <strong>{pedidoExclusao?.id}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setPedidoExclusao(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={executarExclusaoSimulada}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmarCancelamento} onClose={() => setConfirmarCancelamento(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {pedidoEmEdicao ? 'Cancelar edição do pedido' : 'Cancelar cadastro do pedido'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {pedidoEmEdicao
              ? 'Tem certeza que deseja cancelar as alterações feitas neste pedido?'
              : 'Tem certeza que deseja cancelar o cadastro deste novo pedido?'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setConfirmarCancelamento(false)}>
            {pedidoEmEdicao ? 'Continuar editando' : 'Continuar cadastro'}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setConfirmarCancelamento(false);
              handleCancelar();
            }}
          >
            Confirmar cancelamento
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
