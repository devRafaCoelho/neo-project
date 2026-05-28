import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  MenuItem, Button, FormControlLabel, Switch, Stack,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, TablePagination, Chip, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Save, Cancel, Add, Visibility, Edit, Delete, Close,
} from '@mui/icons-material';
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

const provisoesMock = [
  {
    id: 'PROV-001',
    empresa: 'Neoenergia Coelba',
    fornecedor: 'JR Teletrica',
    valor: 1100,
    conta: '230L',
    status: 'Aprovada',
    dataNf: '2026-05-10',
    solicitante: 'Rafael Coelho',
    departamento: 'Telecom',
  },
  {
    id: 'PROV-002',
    empresa: 'Neoenergia Elektro',
    fornecedor: 'Mgitech',
    valor: 45000,
    conta: '220M',
    status: 'Pendente',
    dataNf: '2026-05-15',
    solicitante: 'Ana Souza',
    departamento: 'Engenharia',
  },
  {
    id: 'PROV-003',
    empresa: 'Neoenergia Pernambuco',
    fornecedor: 'Telespazio',
    valor: 8500,
    conta: '230D',
    status: 'Aprovada',
    dataNf: '2026-05-18',
    solicitante: 'João Ferreira',
    departamento: 'Operações',
  },
  {
    id: 'PROV-004',
    empresa: 'Neoenergia Brasília',
    fornecedor: 'Telefônica',
    valor: 12500,
    conta: '2311',
    status: 'Em análise',
    dataNf: '2026-05-20',
    solicitante: 'Marina Costa',
    departamento: 'Telecom',
  },
  {
    id: 'PROV-005',
    empresa: 'Neoenergia Coelba',
    fornecedor: 'Ericsson',
    valor: 38000,
    conta: '2393',
    status: 'Pendente',
    dataNf: '2026-05-22',
    solicitante: 'Pedro Alves',
    departamento: 'Infraestrutura',
  },
];

function statusChipColor(status) {
  if (status === 'Aprovada') return 'success';
  if (status === 'Pendente' || status === 'Em análise') return 'warning';
  return 'default';
}

export default function ProvisaoPage() {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { enqueueSnackbar } = useSnackbar();
  const [provisoes] = useState(provisoesMock);
  const [showForm, setShowForm] = useState(false);
  const [provisaoEmEdicao, setProvisaoEmEdicao] = useState(null);
  const [provisaoVisualizacao, setProvisaoVisualizacao] = useState(null);
  const [provisaoExclusao, setProvisaoExclusao] = useState(null);
  const [modoLista, setModoLista] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listVisibleCount, setListVisibleCount] = useState(3);
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

  const showTable = !isTabletOrMobile || !modoLista;
  const showList = isTabletOrMobile && modoLista;
  const provisoesPaginadas = provisoes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const provisoesLista = provisoes.slice(0, listVisibleCount);
  const hasMoreListItems = listVisibleCount < provisoes.length;

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

  const abrirNovaProvisao = () => {
    reset();
    setProvisaoEmEdicao(null);
    setEmpresaSelecionada(null);
    setFornecedorSelecionado(null);
    setShowForm(true);
  };

  const abrirEdicaoProvisao = (provisao) => {
    reset({
      empresa: provisao.empresa,
      conta: provisao.conta,
      centroCusto: '',
      elementoPep: '',
      ordem: '',
      valor: provisao.valor,
      fornecedor: provisao.fornecedor,
      codigoFornecedor: '',
      dataNf: provisao.dataNf,
      nfNumero: '',
      pedidoCompra: '',
      solicitante: provisao.solicitante,
      departamento: provisao.departamento,
      justificativa: '',
    });
    const emp = empresas.find((x) => x.nome === provisao.empresa) || null;
    const forn = fornecedores.find((x) => x.nome === provisao.fornecedor) || null;
    setEmpresaSelecionada(emp);
    setFornecedorSelecionado(forn);
    setProvisaoEmEdicao(provisao);
    setShowForm(true);
  };

  const executarExclusaoSimulada = () => {
    enqueueSnackbar(`Provisão ${provisaoExclusao?.id} excluída com sucesso!`, {
      variant: 'success',
      autoHideDuration: 3500,
    });
    setProvisaoExclusao(null);
  };

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    enqueueSnackbar(
      provisaoEmEdicao
        ? `Provisão ${provisaoEmEdicao.id} atualizada com sucesso!`
        : 'Provisão criada com sucesso!',
      { variant: 'success', autoHideDuration: 4000 },
    );
    reset();
    setShowForm(false);
    setProvisaoEmEdicao(null);
    setEmpresaSelecionada(null);
    setFornecedorSelecionado(null);
  };

  const handleCancelar = () => {
    reset();
    setShowForm(false);
    setProvisaoEmEdicao(null);
    setEmpresaSelecionada(null);
    setFornecedorSelecionado(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="primary.dark">Criação de Provisão</Typography>
            <Typography variant="body2" color="text.secondary">Solicite uma provisão financeira para aprovação</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={!isTabletOrMobile ? <Add /> : undefined}
            onClick={abrirNovaProvisao}
            sx={{
              minWidth: { xs: 48, lg: 'auto' },
              width: { xs: 48, lg: 'auto' },
              height: { xs: 48, lg: 42 },
              px: { xs: 0, lg: 2.25 },
              borderRadius: { xs: '50%', lg: 1 },
            }}
          >
            {isTabletOrMobile ? <Add /> : 'Cadastrar nova provisão'}
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h6" fontWeight={700} color="primary.dark" sx={{ mb: 2 }}>
            Provisões Cadastradas
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
              {provisoesLista.map((p) => (
                <Card key={p.id} variant="outlined" sx={{ borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} color="primary.dark">{p.id}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar provisão">
                          <IconButton size="small" onClick={() => setProvisaoVisualizacao(p)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar provisão">
                          <IconButton size="small" onClick={() => abrirEdicaoProvisao(p)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir provisão">
                          <IconButton size="small" color="error" onClick={() => setProvisaoExclusao(p)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>{p.fornecedor}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.empresa} — Conta {p.conta}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.25 }}>
                      <Chip size="small" label={p.status} color={statusChipColor(p.status)} />
                      <Chip size="small" label={p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {hasMoreListItems && (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
                  <Button
                    variant="text"
                    onClick={() => setListVisibleCount((current) => Math.min(current + 3, provisoes.length))}
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
                    {['ID', 'Empresa', 'Fornecedor', 'Conta', 'Valor', 'Status', 'Ações'].map((h) => (
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
                  {provisoesPaginadas.map((p, i) => (
                    <Box
                      component="tr"
                      key={p.id}
                      sx={{ bgcolor: i % 2 === 0 ? 'white' : '#F0F7F3', '&:hover': { bgcolor: '#DCEBE1' } }}
                    >
                      <Box component="td" sx={{ p: '10px 16px', fontWeight: 700, color: 'primary.dark', whiteSpace: 'nowrap' }}>{p.id}</Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>{p.empresa}</Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>{p.fornecedor}</Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>{p.conta}</Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </Box>
                      <Box component="td" sx={{ p: '10px 16px' }}>
                        <Chip size="small" label={p.status} color={statusChipColor(p.status)} />
                      </Box>
                      <Box component="td" sx={{ p: '10px 16px', whiteSpace: 'nowrap' }}>
                        <Tooltip title="Visualizar provisão">
                          <IconButton size="small" onClick={() => setProvisaoVisualizacao(p)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar provisão">
                          <IconButton size="small" onClick={() => abrirEdicaoProvisao(p)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir provisão">
                          <IconButton size="small" color="error" onClick={() => setProvisaoExclusao(p)}>
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
              count={provisoes.length}
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
            {provisaoEmEdicao ? `Editar Provisão ${provisaoEmEdicao.id}` : 'Nova Provisão'}
            <IconButton size="small" onClick={handleCancelar} aria-label="Fechar formulário">
              <Close fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
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

              <Controller
                name="nfNumero"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nº NF (opcional)"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: !!field.value || undefined } }}
                  />
                )}
              />

              <Controller
                name="pedidoCompra"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pedido de Compra (opcional)"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: !!field.value || undefined } }}
                  />
                )}
              />

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
                {provisaoEmEdicao ? 'Salvar Alterações' : 'Salvar Provisão'}
              </Button>
            </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!provisaoVisualizacao} onClose={() => setProvisaoVisualizacao(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Resumo da Provisão</DialogTitle>
        <DialogContent dividers>
          {provisaoVisualizacao && (
            <Stack spacing={1.25}>
              <Typography variant="body2"><strong>ID:</strong> {provisaoVisualizacao.id}</Typography>
              <Typography variant="body2"><strong>Empresa:</strong> {provisaoVisualizacao.empresa}</Typography>
              <Typography variant="body2"><strong>Fornecedor:</strong> {provisaoVisualizacao.fornecedor}</Typography>
              <Typography variant="body2"><strong>Conta:</strong> {provisaoVisualizacao.conta}</Typography>
              <Typography variant="body2"><strong>Valor:</strong> {provisaoVisualizacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {provisaoVisualizacao.status}</Typography>
              <Typography variant="body2"><strong>Data NF:</strong> {new Date(provisaoVisualizacao.dataNf).toLocaleDateString('pt-BR')}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setProvisaoVisualizacao(null)}>Fechar</Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => {
              const provisao = provisaoVisualizacao;
              setProvisaoVisualizacao(null);
              abrirEdicaoProvisao(provisao);
            }}
          >
            Editar provisão
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!provisaoExclusao} onClose={() => setProvisaoExclusao(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Excluir provisão</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Confirma a exclusão da provisão <strong>{provisaoExclusao?.id}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setProvisaoExclusao(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={executarExclusaoSimulada}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
